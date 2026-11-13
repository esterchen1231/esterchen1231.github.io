import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().with_name('publish_results.sh')


class PublishResultsTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory(prefix='citation-publish-')
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.remote = self.root / 'remote.git'
        self.repo = self.root / 'site'
        # These tests publish only to disposable local repositories. Do not
        # inherit Git paths, index settings, or authentication from the runner.
        self.env = {
            key: value for key, value in os.environ.items()
            if not key.startswith('GIT_')
        }
        self.env.update({
            'GIT_CONFIG_GLOBAL': os.devnull,
            'GIT_CONFIG_NOSYSTEM': '1',
            'GIT_TERMINAL_PROMPT': '0',
        })
        self.run_command('git', 'init', '--bare', str(self.remote), cwd=self.root)
        self.run_command('git', 'init', str(self.repo), cwd=self.root)
        self.git('config', 'user.name', 'Test User')
        self.git('config', 'user.email', 'test@example.invalid')
        self.git('remote', 'add', 'origin', str(self.remote))
        (self.repo / 'index.html').write_text('site page')
        self.git('add', 'index.html')
        self.git('commit', '-m', 'Site baseline')
        self.head = self.git('rev-parse', 'HEAD').stdout.strip()
        self.results = self.repo / 'google_scholar_crawler' / 'results'
        self.results.mkdir(parents=True)
        self.write_results(12)

    def run_command(self, *args, cwd=None, check=True):
        result = subprocess.run(
            args, cwd=cwd or self.repo, env=self.env,
            text=True, capture_output=True, timeout=30,
        )
        if check and result.returncode:
            self.fail(f'{args} failed: {result.stderr}')
        return result

    def git(self, *args):
        return self.run_command('git', *args)

    def remote_git(self, *args):
        return self.run_command('git', '--git-dir', str(self.remote), *args)

    def write_results(self, citations):
        (self.results / 'gs_data.json').write_text(json.dumps({'citedby': citations}))
        (self.results / 'gs_data_shieldsio.json').write_text(json.dumps({'message': str(citations)}))

    def publish(self, check=True):
        return self.run_command('bash', str(SCRIPT), check=check)

    def test_new_branch_contains_only_outputs_with_bot_identity(self):
        self.publish()
        self.assertEqual(self.remote_git('ls-tree', '--name-only', 'google-scholar-stats').stdout.splitlines(), ['gs_data.json', 'gs_data_shieldsio.json'])
        self.assertEqual(self.remote_git('rev-list', '--count', 'google-scholar-stats').stdout.strip(), '1')
        self.assertEqual(self.remote_git('show', '-s', '--format=%an <%ae>', 'google-scholar-stats').stdout.strip(), 'github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>')

    def test_existing_branch_keeps_history_and_other_files(self):
        self.publish()
        data_checkout = self.root / 'data'
        self.run_command('git', 'clone', '--branch', 'google-scholar-stats', str(self.remote), str(data_checkout))
        self.run_command('git', 'config', 'user.name', 'Test User', cwd=data_checkout)
        self.run_command('git', 'config', 'user.email', 'test@example.invalid', cwd=data_checkout)
        (data_checkout / 'keep.txt').write_text('Preserve existing data files')
        self.run_command('git', 'add', 'keep.txt', cwd=data_checkout)
        self.run_command('git', 'commit', '-m', 'Existing extra data', cwd=data_checkout)
        self.run_command('git', 'push', 'origin', 'google-scholar-stats', cwd=data_checkout)
        old = self.remote_git('rev-parse', 'google-scholar-stats').stdout.strip()
        self.write_results(13)
        self.publish()
        self.assertEqual(self.remote_git('rev-parse', 'google-scholar-stats^').stdout.strip(), old)
        self.assertEqual(json.loads(self.remote_git('show', 'google-scholar-stats:gs_data.json').stdout)['citedby'], 13)
        self.assertEqual(self.remote_git('show', 'google-scholar-stats:keep.txt').stdout, 'Preserve existing data files')

    def test_no_change_exits_successfully_without_a_commit(self):
        self.publish()
        old = self.remote_git('rev-parse', 'google-scholar-stats').stdout.strip()
        self.assertIn('unchanged', self.publish().stdout)
        self.assertEqual(self.remote_git('rev-parse', 'google-scholar-stats').stdout.strip(), old)

    def test_site_index_and_working_tree_are_untouched(self):
        (self.repo / 'index.html').write_text('staged user edit')
        self.git('add', 'index.html')
        (self.repo / 'index.html').write_text('unstaged user edit')
        before = self.git('status', '--porcelain').stdout
        self.publish()
        self.assertEqual(self.git('status', '--porcelain').stdout, before)
        self.assertEqual(self.git('rev-parse', 'HEAD').stdout.strip(), self.head)
        self.assertEqual(self.git('show', ':index.html').stdout, 'staged user edit')

    def test_missing_output_does_not_publish(self):
        (self.results / 'gs_data.json').unlink()
        result = self.publish(check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn('Missing or empty', result.stderr)
        self.assertEqual(self.remote_git('for-each-ref', '--format=%(refname)').stdout, '')

    def test_remote_query_failure_does_not_create_a_branch(self):
        self.git('remote', 'set-url', 'origin', str(self.root / 'missing.git'))
        result = self.publish(check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertEqual(self.git('rev-parse', 'HEAD').stdout.strip(), self.head)
        self.assertEqual(self.remote_git('for-each-ref', '--format=%(refname)').stdout, '')


if __name__ == '__main__':
    unittest.main(verbosity=2)

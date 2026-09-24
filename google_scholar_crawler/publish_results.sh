#!/usr/bin/env bash
set -euo pipefail

# Publish only generated citation data. Reuse checkout's authenticated origin
# without putting a token into a URL or replacing the existing branch history.
cd "$(git rev-parse --show-toplevel)"
results_dir="$(cd "${1:-google_scholar_crawler/results}" && pwd)"
stats_ref=refs/heads/google-scholar-stats
files=(gs_data.json gs_data_shieldsio.json)
for filename in "${files[@]}"; do
  if [[ ! -s "$results_dir/$filename" ]]; then
    printf 'Missing or empty citation output: %s\n' "$filename" >&2
    exit 1
  fi
done

# A failed remote query must not be mistaken for a missing branch.
remote_branch="$(git ls-remote --heads origin "$stats_ref")"
commit_args=(-m 'Update citation data')
if [[ -n "$remote_branch" ]]; then
  git fetch --no-tags origin "$stats_ref"
  parent_commit="$(git rev-parse FETCH_HEAD)"
  commit_args+=(-p "$parent_commit")
fi

# A temporary index lets us update the data branch without switching the site
# checkout or including any site files in a newly created data branch.
index_file="$(mktemp "${TMPDIR:-/tmp}/citation-index.XXXXXX")"
trap 'rm -f "$index_file"' EXIT
rm "$index_file"
export GIT_INDEX_FILE="$index_file"
if [[ -n "${parent_commit:-}" ]]; then
  git read-tree "$parent_commit"
else
  git read-tree --empty
fi

for filename in "${files[@]}"; do
  blob_id="$(git hash-object -w -- "$results_dir/$filename")"
  git update-index --add --cacheinfo "100644,$blob_id,$filename"
done
tree_id="$(git write-tree)"
if [[ -n "${parent_commit:-}" ]] && [[ "$tree_id" == "$(git rev-parse "$parent_commit^{tree}")" ]]; then
  printf 'Citation data is unchanged; nothing to publish.\n'
  exit 0
fi

new_commit="$(git -c user.name='github-actions[bot]' \
  -c user.email='41898282+github-actions[bot]@users.noreply.github.com' \
  commit-tree "$tree_id" "${commit_args[@]}")"
# A normal push rejects concurrent edits instead of overwriting them.
git push origin "$new_commit:$stats_ref"

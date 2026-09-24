"""Regression checks for configuration and the site's citation JSON contract."""

import json
import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import Mock, patch

from main import get_scholar_id, update_results


class CitationDataTests(unittest.TestCase):
    def setUp(self):
        self.author = {
            "name": "Example Author",
            "citedby": 12,
            "publications": [{"author_pub_id": "profile:paper", "num_citations": 12}],
        }
        self.client = Mock()
        self.client.fill.return_value = self.author

    def test_missing_or_blank_configuration_fails_clearly(self):
        for env in ({}, {"GOOGLE_SCHOLAR_ID": "  "}):
            with self.subTest(env=env), patch.dict(os.environ, env, clear=True):
                with self.assertRaisesRegex(ValueError, "Set GOOGLE_SCHOLAR_ID"):
                    get_scholar_id()

    @patch.dict(os.environ, {"GOOGLE_SCHOLAR_ID": " cBErukUAAAAJ "}, clear=True)
    def test_configured_id_and_website_json_schema(self):
        with tempfile.TemporaryDirectory() as folder:
            update_results(self.client, folder)
            self.client.search_author_id.assert_called_once_with("cBErukUAAAAJ")
            data = json.loads((Path(folder) / "gs_data.json").read_text())
            badge = json.loads((Path(folder) / "gs_data_shieldsio.json").read_text())
            self.assertEqual(data["citedby"], 12)
            self.assertEqual(data["publications"]["profile:paper"]["num_citations"], 12)
            self.assertEqual(badge, {"schemaVersion": 1, "label": "citations", "message": "12"})
            self.assertTrue(data["updated"].endswith("+00:00"))

    @patch.dict(os.environ, {"GOOGLE_SCHOLAR_ID": "profile"}, clear=True)
    def test_valid_zero_citations(self):
        self.client.fill.return_value = {"citedby": 0, "publications": []}
        with tempfile.TemporaryDirectory() as folder:
            update_results(self.client, folder)
            badge = json.loads((Path(folder) / "gs_data_shieldsio.json").read_text())
            self.assertEqual(badge["message"], "0")

    @patch.dict(os.environ, {"GOOGLE_SCHOLAR_ID": "profile"}, clear=True)
    def test_failed_or_incomplete_fetch_preserves_previous_results(self):
        for bad_author in ({}, {"citedby": 12}, {"citedby": "unknown", "publications": []},
                           {"citedby": 12, "publications": [{"author_pub_id": "profile:paper"}]}):
            with self.subTest(author=bad_author), tempfile.TemporaryDirectory() as folder:
                previous = Path(folder) / "gs_data.json"
                previous.write_text('{"citedby": 7}')
                self.client.fill.return_value = bad_author
                with self.assertRaises(ValueError):
                    update_results(self.client, folder)
                self.assertEqual(previous.read_text(), '{"citedby": 7}')
                self.assertFalse((Path(folder) / "gs_data_shieldsio.json").exists())

        with tempfile.TemporaryDirectory() as folder:
            previous = Path(folder) / "gs_data.json"
            previous.write_text('{"citedby": 7}')
            self.client.search_author_id.side_effect = RuntimeError("Fetch unavailable")
            with self.assertRaisesRegex(RuntimeError, "Fetch unavailable"):
                update_results(self.client, folder)
            self.assertEqual(previous.read_text(), '{"citedby": 7}')


if __name__ == "__main__":
    unittest.main()

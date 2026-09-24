"""Fetch the public Scholar statistics consumed by the website."""

import json
import os
from datetime import datetime, timezone
from pathlib import Path


def get_scholar_id():
    scholar_id = os.environ.get("GOOGLE_SCHOLAR_ID", "").strip()
    if not scholar_id:
        raise ValueError("Set GOOGLE_SCHOLAR_ID to the public Google Scholar profile ID.")
    return scholar_id


def prepare_results(author):
    """Validate a complete response before replacing any saved statistics."""
    citedby = author.get("citedby")
    if type(citedby) is not int or citedby < 0:
        raise ValueError("Google Scholar returned no valid total citation count.")

    publications = author.get("publications")
    if not isinstance(publications, list):
        raise ValueError("Google Scholar returned no publication list.")

    publications_by_id = {}
    for publication in publications:
        paper_id = publication.get("author_pub_id")
        count = publication.get("num_citations")
        if not paper_id or type(count) is not int or count < 0:
            raise ValueError("Google Scholar returned an incomplete publication.")
        publications_by_id[paper_id] = publication

    data = dict(author)
    data["updated"] = datetime.now(timezone.utc).isoformat()
    data["publications"] = publications_by_id
    badge = {"schemaVersion": 1, "label": "citations", "message": str(citedby)}
    return data, badge


def update_results(client, output_dir):
    scholar_id = get_scholar_id()
    author = client.search_author_id(scholar_id)
    author = client.fill(author, sections=["basics", "indices", "counts", "publications"])
    data, badge = prepare_results(author)

    # Serialize both responses first so a bad response never replaces good data.
    payloads = {
        "gs_data.json": json.dumps(data, ensure_ascii=False, indent=2) + "\n",
        "gs_data_shieldsio.json": json.dumps(badge, ensure_ascii=False, indent=2) + "\n",
    }
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    for filename, payload in payloads.items():
        temporary = output_dir / (filename + ".tmp")
        temporary.write_text(payload, encoding="utf-8")
        temporary.replace(output_dir / filename)
    print(f"Updated citation data: {data['citedby']} citations, {len(data['publications'])} publications.")


def main():
    get_scholar_id()  # Report missing configuration before initializing the client.
    from scholarly import scholarly

    scholarly.set_timeout(30)
    scholarly.set_retries(2)
    update_results(scholarly, Path(__file__).resolve().parent / "results")


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""Revia AOS compliance export for the certification dashboard.

Produces docs/compliance/compliance-export.json: a machine-readable
snapshot of the program's software compliance posture —

  - every requirement (ID + text) from docs/requirements/AOS-SRS.md
  - implementing source files (@satisfies tags)
  - verifying test cases (@verifies file tags + UT_CASE entries)
  - the means-of-compliance table rows
  - trace-gap status

The dashboard ingests one export per build/baseline. CI regenerates
the export and fails on drift, so the committed JSON always matches
the committed code.

Verification-support tool (DO-330 TQL-5 candidate: output is
independently reviewed; cannot insert errors into airborne software).
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SRS = ROOT / "docs" / "requirements" / "AOS-SRS.md"
MOC = ROOT / "docs" / "compliance" / "means-of-compliance.md"
OUT = ROOT / "docs" / "compliance" / "compliance-export.json"

REQ_RE = re.compile(
    r"^- \*\*(AOS-(?:HLR|SRS)-\d{3})\*\* — (.+?)(?=^- \*\*|^#|^###|\Z)",
    re.M | re.S)
TAG_RE = re.compile(r"@(satisfies|verifies)\s+([A-Z0-9-]+(?:\.\.\d+)?)")
ID_RE = re.compile(r"(AOS-(?:HLR|SRS)-)(\d{3})(?:\.\.(\d{3}))?")
CASE_RE = re.compile(r'UT_CASE\(\s*"([^"]+)"\s*,\s*\n?\s*"([^"]+)"', re.S)

SRC_DIRS = ["kernel", "partitions", "config", "tools/host_sim"]
TEST_DIR = "tests"


def expand(tag: str) -> list[str]:
    m = ID_RE.fullmatch(tag)
    if not m:
        return [tag]
    prefix, lo, hi = m.group(1), m.group(2), m.group(3)
    if hi is None:
        return [prefix + lo]
    return [f"{prefix}{n:03d}" for n in range(int(lo), int(hi) + 1)]


def main() -> int:
    srs_text = SRS.read_text()
    requirements = {
        rid: " ".join(body.split())
        for rid, body in REQ_RE.findall(srs_text)
    }

    satisfies: dict[str, list[str]] = {r: [] for r in requirements}
    for d in SRC_DIRS:
        for path in sorted((ROOT / d).rglob("*.[ch]")):
            rel = path.relative_to(ROOT).as_posix()
            for verb, tag in TAG_RE.findall(path.read_text()):
                if verb == "satisfies":
                    for req in expand(tag):
                        if req in satisfies and rel not in satisfies[req]:
                            satisfies[req].append(rel)

    cases: dict[str, list[dict[str, str]]] = {r: [] for r in requirements}
    case_count = 0
    for path in sorted((ROOT / TEST_DIR).rglob("*.c")):
        rel = path.relative_to(ROOT).as_posix()
        for name, req in CASE_RE.findall(path.read_text()):
            case_count += 1
            for r in expand(req):
                if r in cases:
                    cases[r].append({"file": rel, "case": name})

    moc_rows = []
    if MOC.exists():
        for line in MOC.read_text().splitlines():
            cols = [c.strip() for c in line.strip().strip("|").split("|")]
            if len(cols) == 4 and cols[0] not in ("Regulation", "---"):
                if not set(cols[0]) <= {"-", " "}:
                    moc_rows.append({
                        "regulation": cols[0], "subject": cols[1],
                        "means": cols[2], "standards": cols[3],
                    })

    items = []
    gaps = []
    for rid in sorted(requirements):
        traced = bool(satisfies[rid]) and bool(cases[rid])
        if not traced:
            gaps.append(rid)
        items.append({
            "id": rid,
            "text": requirements[rid],
            "satisfied_by": satisfies[rid],
            "verified_by": cases[rid],
            "fully_traced": traced,
        })

    export = {
        "schema": "revia-compliance-export/1",
        "program": "Revia R-100",
        "component": "Revia AOS (REV-AOS)",
        "source_documents": {
            "requirements": SRS.relative_to(ROOT).as_posix(),
            "means_of_compliance": MOC.relative_to(ROOT).as_posix(),
        },
        "summary": {
            "requirements": len(items),
            "fully_traced": len(items) - len(gaps),
            "trace_gaps": gaps,
            "test_cases": case_count,
        },
        "requirements": items,
        "means_of_compliance": moc_rows,
    }

    OUT.write_text(json.dumps(export, indent=2) + "\n")
    print(f"wrote {OUT.relative_to(ROOT)}: {len(items)} requirements, "
          f"{case_count} test cases, {len(moc_rows)} MoC rows, "
          f"{len(gaps)} gaps")
    return 1 if gaps else 0


if __name__ == "__main__":
    sys.exit(main())

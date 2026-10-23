#!/usr/bin/env python3
"""
PrepTrack by UD — daily news feed builder.

Fetches current-affairs headlines (English and Hindi) from public Google News
RSS searches, keeps the last 3 days, and writes feed.json for the app.

Safety rules:
  * If no headlines can be fetched, the existing feed.json is left untouched.
  * Practice questions in feed.json are preserved (they are edited by hand).

Usage:  python3 scripts/update_feed.py feed.json
Test:   PT_FIXTURE_DIR=path/with/xml python3 scripts/update_feed.py out.json
"""
import datetime as dt
import time
import email.utils
import html
import json
import os
import re
import sys
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET

EN_TOPICS = [
    ("National", "India cabinet approves scheme"),
    ("Government", "India government new scheme launched"),
    ("Economy", "RBI policy India economy"),
    ("Finance", "SEBI new rules India"),
    ("Science & Tech", "ISRO space mission India"),
    ("Defence", "DRDO India defence"),
    ("Sports", "India sports award winners"),
    ("International", "India foreign affairs agreement"),
    ("Appointments", "India appointed new chairman secretary"),
]
HI_TOPICS = [
    ("राष्ट्रीय", "केंद्रीय कैबिनेट फैसला योजना"),
    ("सरकार", "भारत सरकार नई योजना"),
    ("अर्थव्यवस्था", "आरबीआई नीति भारत अर्थव्यवस्था"),
    ("विज्ञान", "इसरो मिशन भारत"),
    ("रक्षा", "भारत रक्षा समाचार"),
    ("खेल", "भारत खेल पुरस्कार विजेता"),
    ("अंतरराष्ट्रीय", "भारत विदेश समझौता"),
]
MAX_EN, MAX_HI, MAX_AGE_DAYS = 24, 16, 3
UA = {"User-Agent": "Mozilla/5.0 (PrepTrack feed builder)"}


def rss_url(query, lang):
    if lang == "en":
        params = {"q": query, "hl": "en-IN", "gl": "IN", "ceid": "IN:en"}
    else:
        params = {"q": query, "hl": "hi", "gl": "IN", "ceid": "IN:hi"}
    return "https://news.google.com/rss/search?" + urllib.parse.urlencode(params)


def fetch_xml(query, lang, idx):
    fixture_dir = os.environ.get("PT_FIXTURE_DIR")
    if fixture_dir:  # offline testing
        with open(os.path.join(fixture_dir, f"{lang}-{idx}.xml"), "rb") as f:
            return f.read()
    req = urllib.request.Request(rss_url(query, lang), headers=UA)
    with urllib.request.urlopen(req, timeout=25) as r:
        return r.read()


def clean_title(title, source):
    t = html.unescape(title or "").strip()
    if source and t.endswith(" - " + source):
        t = t[: -len(" - " + source)]
    return t.strip()


def parse(xml_bytes, tag):
    out = []
    root = ET.fromstring(xml_bytes)
    for item in root.iter("item"):
        title = item.findtext("title") or ""
        link = item.findtext("link") or ""
        pub = item.findtext("pubDate") or ""
        src_el = item.find("source")
        source = (src_el.text or "").strip() if src_el is not None else ""
        try:
            d = email.utils.parsedate_to_datetime(pub).astimezone(dt.timezone.utc).date()
        except (TypeError, ValueError):
            continue
        t = clean_title(title, source)
        if not t:
            continue
        out.append({"d": d.isoformat(), "t": t, "src": source or "Google News", "url": link, "tag": tag})
    return out


def collect(topics, lang, cap, cutoff):
    seen, items = set(), []
    for idx, (tag, query) in enumerate(topics):
        try:
            batch = parse(fetch_xml(query, lang, idx), tag)
        except Exception as e:  # one failing topic must not stop the others
            print(f"warn: {lang} topic '{tag}' failed: {e}", file=sys.stderr)
            continue
        for it in batch:
            key = re.sub(r"\W+", "", it["t"].lower())[:60]
            if key in seen or dt.date.fromisoformat(it["d"]) < cutoff:
                continue
            seen.add(key)
            items.append(it)
    items.sort(key=lambda x: x["d"], reverse=True)
    return items[:cap]


REGION_FILES = [("state", "js/data-states.js"), ("world", "js/data-world.js")]
REGION_MAX, REGION_AGE_DAYS = 12, 7


def load_regions(root):
    """Read the region ids and names straight from the app's data files (single source of truth)."""
    out = []
    for kind, rel in REGION_FILES:
        path = os.path.join(root, rel)
        if not os.path.exists(path):
            print(f"warn: {rel} not found; skipping {kind} regions", file=sys.stderr)
            continue
        with open(path, encoding="utf-8") as f:
            txt = f.read()
        for rid, name in re.findall(r"id:\s*'([a-z0-9]+)',\s*name:\s*'([^']+)'", txt):
            out.append((kind, rid, name))
    return out


def region_query(kind, name):
    clean = re.sub(r"\s*\(.*?\)", "", name).strip()
    return f"{clean} India news" if kind == "state" else f"{clean} news"


def collect_regions(root, old_regions, today):
    cutoff = today - dt.timedelta(days=REGION_AGE_DAYS)
    regions = {}
    for kind, rid, name in load_regions(root):
        key = f"{kind}:{rid}"
        items = collect([(kind, region_query(kind, name))], "en", REGION_MAX, cutoff)
        if items:
            regions[key] = [{"d": i["d"], "t": i["t"], "b": "", "src": i["src"], "url": i["url"], "tag": kind} for i in items]
        else:  # keep the last good news for this section
            regions[key] = old_regions.get(key, [])
        time.sleep(0.6)  # be polite to the news server
    return regions


def main():
    out_path = sys.argv[1] if len(sys.argv) > 1 else "feed.json"
    today = dt.datetime.now(dt.timezone.utc).date()
    cutoff = today - dt.timedelta(days=MAX_AGE_DAYS)
    en = collect(EN_TOPICS, "en", MAX_EN, cutoff)
    hi = collect(HI_TOPICS, "hi", MAX_HI, cutoff)
    news = []
    for lang, arr in (("en", en), ("hi", hi)):
        for it in arr:
            news.append({"lang": lang, "d": it["d"], "t": it["t"], "b": "", "src": it["src"], "url": it["url"], "tag": it["tag"]})
    if len(news) < 5:
        print(f"Only {len(news)} headlines fetched; keeping the existing feed.", file=sys.stderr)
        sys.exit(1)

    old = {}
    if os.path.exists(out_path):
        try:
            with open(out_path, encoding="utf-8") as f:
                old = json.load(f)
        except (OSError, ValueError):
            old = {}
    old_regions = old.get("regions", {}) if isinstance(old, dict) else {}
    regions = collect_regions(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), old_regions, today)
    feed = {
        "version": 3,
        "updated": today.isoformat(),
        "source_edition": today.isoformat(),
        "note": "Headlines are generated automatically each day from public Google News searches (English and Hindi). Each headline links to its original source.",
        "items": news,
        "regions": regions,
        "questions": old.get("questions", []),
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(feed, f, ensure_ascii=False, indent=1)
    filled = sum(1 for v in regions.values() if v)
    print(f"wrote {out_path}: {len(en)} English, {len(hi)} Hindi headlines, {filled}/{len(regions)} regions with news, {len(feed['questions'])} questions")


if __name__ == "__main__":
    main()

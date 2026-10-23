# PrepTrack by UD — app, daily sync and maps

This repository hosts the PrepTrack web app. The daily news job refreshes headlines automatically.

## One-time setup (about 10 minutes)
1. Create a new **public** GitHub repository (for example `preptrack`).
2. Upload **everything in this folder**, including the hidden `.github` folder, and commit.
3. Turn on **GitHub Pages**: Settings → Pages → Deploy from a branch → `main`, folder `/ (root)` → Save.
   The app then lives at `https://<your-username>.github.io/preptrack/` (install it from there).
4. Turn on the **daily sync**: Actions tab → enable workflows. Then Actions → *Daily sync* → *Run workflow* once to test.
   This fills `feed.json` with today's headlines and recent news for every state, UT and country.
5. In the app: **Profile → Content feed**, paste the raw feed link:
   `https://raw.githubusercontent.com/<your-username>/preptrack/main/feed.json`
   (needed for the Android and Windows apps, which keep their own copy of the files).

After this, nothing needs doing each day. GitHub rebuilds `feed.json` at 06:00 IST. The app picks up
new news when opened, or when you tap **🔄 Sync** (header) or **🔄 Sync new data** (in a section).

## What the sync buttons change
- **🔄 Sync** and the Current Affairs card: today's headlines and the practice question pack.
- **🔄 Sync new data** in a Map section: only that state, UT or country's recent news.
- Nothing else. Capitals, seats, rivers, symbols, organisation facts and maps are fixed and work offline.

## Maps (offline)
Maps are drawn from boundary files. Two ways to get them:

**Option A — run on your computer (recommended)**
1. Install Python 3 (python.org).
2. In this folder run: `python3 scripts/fetch_geojson.py` — it downloads `india_28states_8uts_exact.geojson` and `world_countries_exact.geojson`.
3. Build the maps:
   `python3 scripts/build_maps.py india india_28states_8uts_exact.geojson`
   `python3 scripts/build_maps.py world world_countries_exact.geojson`
4. Commit the new `maps/` folder. The app saves the maps for offline use on the next visit.

The builder matches names to the app's 36 states/UTs and 33 countries (for example "Orissa" → Odisha) and lists any it cannot match.
For India, use boundaries approved by the Survey of India for the official depiction; community datasets may differ on disputed areas.

## Files
- `index.html`, `js/`, `css/`, `icons/`, `sw.js`, `manifest.webmanifest` — the app.
- `js/data-states.js` — all 28 states and 8 UTs (capital, seats, rivers, parks, dances, festivals, railway zones, etc.).
- `js/data-world.js` — important countries (capital, currency, head, rivers, mountains, volcanoes, neighbours).
- `js/data-orgs.js` — national and international organisations (HQ, founded, head, tagline, work).
- `js/data-mains.js` — mains-level (Tier-II) questions, mixed into daily Tier-II practice sets.
- `scripts/update_feed.py` — builds `feed.json` (headlines + per-region news). Keeps the last good news if a source fails.
- `scripts/build_maps.py` — turns GeoJSON boundaries into the per-region SVG maps.
- `scripts/fetch_geojson.py` — downloads the two GeoJSON boundary files.
- `.github/workflows/daily-sync.yml` — runs the feed script every day and commits the result.

## Please verify before the exam
Chief Ministers, Governors, heads of state and government, organisation heads, Lok Sabha/Rajya Sabha counts and
national parks / tiger reserves change over time. The app marks these with **(verify)**. Check them against an
official source before you rely on them.

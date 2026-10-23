#!/usr/bin/env python3
"""
Turns a GeoJSON boundary file into the per-region SVG maps used by the app.

Usage:
  python3 scripts/build_maps.py india   path/to/india-states.geojson  [--prop NAME_PROPERTY]
  python3 scripts/build_maps.py world   path/to/countries.geojson     [--prop NAME_PROPERTY]

Writes maps/<kind>/<region-name-slug>.svg, one per feature. The chosen region is filled, the rest of
the map is drawn faintly for context. Each new file is added to maps/manifest.json so the app
saves it for offline use. Use boundary data from a source you are allowed to use (for India,
the official Survey of India-approved boundaries).
"""
import json, math, os, re, sys

def slug(s):
    s = s.lower().replace("&", "and")
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", s))

def rings(geom):
    if geom["type"] == "Polygon":
        return [geom["coordinates"]]
    if geom["type"] == "MultiPolygon":
        return geom["coordinates"]
    return []

def path_d(geom, proj):
    out = []
    for poly in rings(geom):
        for ring in poly:
            pts = [proj(lon, lat) for lon, lat in ring]
            if not pts:
                continue
            out.append("M" + " L".join(f"{x:.2f},{y:.2f}" for x, y in pts) + " Z")
    return " ".join(out)

def bbox(geoms):
    xs, ys = [], []
    for g in geoms:
        for poly in rings(g):
            for ring in poly:
                for lon, lat in ring:
                    xs.append(lon); ys.append(lat)
    return min(xs), min(ys), max(xs), max(ys)

NAME_PROPS = ["st_nm", "NAME_1", "ST_NM", "STATE", "name", "NAME", "ADMIN", "admin", "name_en"]
ALIASES = {
    "orissa": "odisha", "uttaranchal": "uttarakhand", "pondicherry": "puducherry",
    "nctofdelhi": "delhi", "nationalcapitalterritoryofdelhi": "delhi",
    "andamanandnicobar": "andamanandnicobarislands", "jammuandkashmir": "jammuandkashmir",
    "chhattisgarh": "chhattisgarh", "telengana": "telangana", "uttaranchal ": "uttarakhand",
    "dadraandnagarhaveli": "dadraandnagarhaveliandddamananddiu", "damananddiu": "dadraandnagarhaveliandddamananddiu",
    "unitedstatesofamerica": "unitedstatesofamerica", "unitedstates": "unitedstatesofamerica", "usa": "unitedstatesofamerica",
    "russianfederation": "russia", "southkorea": "southkorea", "korearepublicof": "southkorea", "republicofkorea": "southkorea",
    "turkey": "turkeytürkiye", "türkiye": "turkeytürkiye", "czechrepublic": "czechia", "ivorycoast": "cotedivoire",
}
def norm(s):
    return re.sub(r"[^a-z]", "", s.lower().replace("&", "and").replace("ü", "u").replace("ö", "o").replace("é", "e"))

def app_regions(root):
    """(kind, app name, slug) for every state/UT and country in the app's data files."""
    out = []
    for kind, rel in (("india", "js/data-states.js"), ("world", "js/data-world.js")):
        path = os.path.join(root, rel)
        if not os.path.exists(path):
            continue
        txt = open(path, encoding="utf-8").read()
        for name in re.findall(r"id:\s*'[a-z0-9]+',\s*name:\s*'([^']+)'", txt):
            out.append((kind, name, slug(name)))
    return out

ALIAS_KEYS = {
    "orissa": "odisha", "uttaranchal": "uttarakhand", "pondicherry": "puducherry", "telengana": "telangana",
    "nctofdelhi": "delhi", "nationalcapitalterritoryofdelhi": "delhi", "nationalcapitalterritory": "delhi",
    "andamanandnicobarislands": "andaman", "andamanandnicobar": "andaman",
    "dadraandnagarhaveli": "dadra", "damananddiu": "dadra", "dadraandnagarhavelianddamananddiu": "dadra",
    "jammuandkashmir": "jammu", "unitedstates": "unitedstatesofamerica", "unitedstatesofamerica": "unitedstatesofamerica",
    "russianfederation": "russia", "republicofkorea": "southkorea", "korearepublicof": "southkorea", "turkiye": "turkey",
}
def match_feature(fname, regions):
    """Match a GeoJSON name to an app region of the same kind. Returns (app name, slug) or (None, None)."""
    f = norm(fname)
    key = ALIAS_KEYS.get(f) or next((v for k, v in ALIAS_KEYS.items() if f.startswith(k)), None) or f
    for kind, name, sl in regions:
        n = norm(name)
        if n == key or (len(key) >= 5 and (key in n or n.startswith(key))):
            return name, sl
    return None, None

def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    kind, src = sys.argv[1], sys.argv[2]
    prop = sys.argv[sys.argv.index("--prop") + 1] if "--prop" in sys.argv else None
    if kind not in ("india", "world"):
        sys.exit("kind must be india or world")
    gj = json.load(open(src, encoding="utf-8"))
    feats = gj.get("features", [])
    props = [prop] if prop else [p for p in NAME_PROPS if feats and p in (feats[0].get("properties") or {})]
    if not props:
        sys.exit("No name property found. Re-run with --prop <property name>. Keys: " + ", ".join((feats[0].get("properties") or {}).keys()))
    regions = app_regions(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    same_kind = [r for r in regions if r[0] == kind]
    geoms = [f["geometry"] for f in feats if f.get("geometry")]
    minx, miny, maxx, maxy = bbox(geoms)
    k = math.cos(math.radians((miny + maxy) / 2))
    W = 800.0
    scale = W / ((maxx - minx) * k) if maxx > minx else 1
    H = (maxy - miny) * scale
    def proj(lon, lat):
        return ((lon - minx) * k * scale + 10, (maxy - lat) * scale + 10)
    out_dir = os.path.join("maps", kind)
    os.makedirs(out_dir, exist_ok=True)
    manifest_path = os.path.join("maps", "manifest.json")
    manifest = json.load(open(manifest_path)) if os.path.exists(manifest_path) else []
    context = " ".join(path_d(f["geometry"], proj) for f in feats if f.get("geometry"))
    unmatched, done = [], set()
    for f in feats:
        raw = next(((f.get("properties") or {}).get(p) for p in props if (f.get("properties") or {}).get(p)), None)
        if not raw or not f.get("geometry"):
            continue
        name, sl = match_feature(raw, same_kind) if same_kind else (raw, slug(raw))
        if not name:
            unmatched.append(raw); continue
        if sl in done:
            continue
        done.add(sl)
        region = path_d(f["geometry"], proj)
        svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W + 20:.0f} {H + 20:.0f}" role="img" aria-label="{name}">'
               f'<rect width="100%" height="100%" fill="#ffffff"/>'
               f'<path d="{context}" fill="#eef1f6" stroke="#9aa3b5" stroke-width="0.6"/>'
               f'<path d="{region}" fill="#f7c503" fill-opacity="0.85" stroke="#1d2b53" stroke-width="1.4"/>'
               f'<text x="20" y="{H + 12:.0f}" font-family="sans-serif" font-size="16" fill="#1d2b53">{name}</text></svg>')
        rel = f"maps/{kind}/{sl}.svg"
        with open(rel, "w", encoding="utf-8") as fh:
            fh.write(svg)
        if rel not in manifest:
            manifest.append(rel)
        print("wrote", rel)
    if unmatched:
        print("Not matched to an app region (check spelling):", ", ".join(unmatched))
    missing = [n for k, n, sl in same_kind if sl not in done]
    if missing:
        print("App regions with no map in this file:", ", ".join(missing))
    with open(manifest_path, "w", encoding="utf-8") as fh:
        json.dump(sorted(manifest), fh, indent=1)
    print(f"manifest: {len(manifest)} files")

if __name__ == "__main__":
    main()

MAP FILES
Put one SVG per region here (a file name = the region name in lower case with dashes):
  maps/india/andhra-pradesh.svg   maps/india/uttar-pradesh.svg   ... (36 states and UTs)
  maps/world/india.svg            maps/world/united-states-of-america.svg ... (countries)
Then list every new file in maps/manifest.json, for example:  ["maps/india/andhra-pradesh.svg", ...]
The app saves listed files for offline use on the next visit. Use scripts/build_maps.py to create them.

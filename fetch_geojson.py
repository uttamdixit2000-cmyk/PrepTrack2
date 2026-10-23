import urllib.request
import os

def download_file(url, filename):
    print(f"Downloading {filename}...")
    try:
        urllib.request.urlretrieve(url, filename)
        file_size = os.path.getsize(filename) / (1024 * 1024)
        print(f"Successfully downloaded {filename} ({file_size:.2f} MB)")
    except Exception as e:
        print(f"Failed to download {filename}. Error: {e}")

if __name__ == "__main__":
    print("Starting GeoJSON downloads...\n")

    # URL for World Countries (Natural Earth dataset converted to GeoJSON)
    world_url = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
    
    # URL for Indian States (Datameet repository)
    # Note: Using a widely trusted open-source repository for Indian boundaries
    india_url = "https://raw.githubusercontent.com/datameet/maps/master/States/Admin2.geojson"

    # Download World Map
    download_file(world_url, "world_countries_exact.geojson")
    
    # Download India Map
    download_file(india_url, "india_28states_8uts_exact.geojson")

    print("\nDownloads complete. The files are saved in your current directory.")
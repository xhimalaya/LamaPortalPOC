import os
import json
import requests
import geopandas as gpd
from dotenv import load_dotenv


class SentinelDownloader:

    TOKEN_URL = "https://identity.dataspace.copernicus.eu/auth/realms/CDSE/protocol/openid-connect/token"
    PROCESS_URL = "https://sh.dataspace.copernicus.eu/api/v1/process"
    ODATA_URL = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"

    def __init__(self):

        load_dotenv()

        self.client_id = "sh-96eb0eb7-3ffe-4133-9b3d-103f1e780118"
        self.client_secret = "drvtTkj4mqgJCrw8AvhCIvuXq7nnyIJT"

        self.token = None
        self.geometry = None
        self.items = []

        self.output_dir = "sentinel_downloads"
        os.makedirs(self.output_dir, exist_ok=True)

    # -----------------------
    # AUTH
    # -----------------------
    def authenticate(self):

        payload = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret
        }

        r = requests.post(self.TOKEN_URL, data=payload)

        if r.status_code != 200:
            raise Exception(r.text)

        self.token = r.json()["access_token"]

        print("Authenticated")

    # -----------------------
    # LOAD AOI
    # -----------------------
    def load_aoi(self):

        print("Loading AOI...")

        gdf = gpd.read_file(
            "https://raw.githubusercontent.com/stefanocudini/geojson-resources/refs/heads/master/ladakh.json"
        )

        self.geometry = json.loads(gdf.to_json())["features"][0]["geometry"]

    # -----------------------
    # SEARCH SCENES (ODATA)
    # -----------------------
    def search_scenes(self):

        print("Searching scenes...")

        query = (
            "Collection/Name eq 'SENTINEL-2' "
            "and ContentDate/Start ge 2025-01-10T00:00:00.000Z "
            "and ContentDate/Start le 2025-01-10T23:59:59.000Z"
        )

        url = f"{self.ODATA_URL}?$filter={query}&$top=50"

        r = requests.get(url)

        if r.status_code != 200:
            raise Exception(r.text)

        data = r.json()

        self.items = data["value"]

        print("Found", len(self.items), "scenes")

    # -----------------------
    # DOWNLOAD BAND
    # -----------------------
    def download_band(self, band, folder):

        evalscript = f"""
        //VERSION=3
        function setup() {{
          return {{
            input: ["{band}"],
            output: {{
              bands: 1,
              sampleType: "UINT16"
            }}
          }}
        }}

        function evaluatePixel(sample) {{
          return [sample.{band}]
        }}
        """

        request = {
            "input": {
                "bounds": {
                    "geometry": self.geometry
                },
                "data": [{
                    "type": "sentinel-2-l2a"
                }]
            },
            "output": {
                "width": 1024,
                "height": 1024,
                "responses": [{
                    "identifier": "default",
                    "format": {"type": "image/tiff"}
                }]
            },
            "evalscript": evalscript
        }

        headers = {
            "Authorization": f"Bearer {self.token}",
            "Content-Type": "application/json",
            "Accept": "image/tiff"
        }

        r = requests.post(self.PROCESS_URL, headers=headers, json=request)

        if r.status_code != 200:
            print("Failed:", band)
            return

        path = os.path.join(folder, f"{band}.tif")

        with open(path, "wb") as f:
            f.write(r.content)

        print("Saved", path)

    # -----------------------
    # DOWNLOAD SCENE
    # -----------------------
    def download_scene(self, scene):

        scene_id = scene["Name"]

        print("\nScene:", scene_id)

        folder = os.path.join(self.output_dir, scene_id)
        os.makedirs(folder, exist_ok=True)

        for band in ["B03", "B06", "B11"]:
            print("Downloading", band)
            self.download_band(band, folder)

    # -----------------------
    # RUN
    # -----------------------
    def run(self):

        self.authenticate()
        self.load_aoi()
        self.search_scenes()

        for scene in self.items:
            self.download_scene(scene)


if __name__ == "__main__":

    downloader = SentinelDownloader()
    downloader.run()
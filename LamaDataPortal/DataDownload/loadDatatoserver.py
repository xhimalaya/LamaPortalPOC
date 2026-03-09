import os
import requests

GEOSERVER_URL = "http://localhost:8080/geoserver"
USERNAME = "admin"
PASSWORD = "geoserver"
WORKSPACE = "sentinel"
STORE = "sentinel_store"
DATA_DIR = "sentinel_downloads"
auth = (USERNAME, PASSWORD)


def create_workspace():
    url = f"{GEOSERVER_URL}/rest/workspaces"
    headers = {"Content-Type": "text/xml"}
    data = f"""
    <workspace>
        <name>{WORKSPACE}</name>
    </workspace>
    """
    requests.post(url, auth=auth, headers=headers, data=data)


def upload_geotiff(tif_path, layer_name):
    url = f"{GEOSERVER_URL}/rest/workspaces/{WORKSPACE}/coveragestores/{layer_name}/file.geotiff"
    headers = {"Content-type": "image/tiff"}
    with open(tif_path, "rb") as f:
        r = requests.put(url, auth=auth, headers=headers, data=f)
    print(layer_name, r.status_code)


def find_tiffs():
    for root, dirs, files in os.walk(DATA_DIR):
        for file in files:
            if file.lower().endswith(".tif"):
                full_path = os.path.join(root, file)
                scene = os.path.basename(root)
                band = file.replace(".tif", "")
                layer_name = f"{scene}_{band}"
                yield full_path, layer_name


def main():
    create_workspace()
    for path, layer in find_tiffs():
        print("Uploading:", layer)
        upload_geotiff(path, layer)


if __name__ == "__main__":
    main()
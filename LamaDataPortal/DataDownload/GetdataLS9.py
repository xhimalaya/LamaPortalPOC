import os
import requests
import boto3
import urllib3
from tqdm import tqdm
from osgeo import gdal
import datetime

# --- SETTINGS ---

S3_ACCESS_KEY = "YOUR_KEY"
S3_SECRET_KEY = "YOUR_SECRET"

START_DATE = "2024-01-01T00:00:00.000Z"
END_DATE   = "2024-01-05T23:59:59.999Z"

COLLECTION = "LANDSAT-9"

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

S3_ENDPOINT = "https://eodata.dataspace.copernicus.eu"
ODATA_URL = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"


# ---------------- SEARCH ----------------
def search_products(start, end, collection):

    bbox_wkt = "POLYGON((72.5 32.0, 80.5 32.0, 80.5 37.5, 72.5 37.5, 72.5 32.0))"

    headers = {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
    }

    query_filter = (
        f"Collection/Name eq '{collection}' and "
        f"ContentDate/Start gt {start} and "
        f"ContentDate/Start lt {end} and "
        f"OData.CSC.Intersects(area=geography'SRID=4326;{bbox_wkt}')"
    )

    query_filter += " and Attributes/OData.CSC.DoubleAttribute/any(att:att/Name eq 'cloudCover' and att/Value lt 20.0)"

    params = {
        "$filter": query_filter,
        "$top": 20
    }

    print("Searching Landsat scenes...")

    response = requests.get(
        ODATA_URL,
        params=params,
        headers=headers,
        timeout=60,
        verify=False
    )

    response.raise_for_status()

    return response.json().get("value", [])


# ---------------- JP2 → TIFF ----------------
def convert_to_tiff(input_path):

    output_path = input_path.replace(".TIF", ".tif")

    print(f" > Converting to GeoTIFF: {os.path.basename(output_path)}")

    ds = gdal.Open(input_path)

    if ds is None:
        print(f"Failed to open {input_path}")
        return

    options = gdal.TranslateOptions(
        format='GTiff',
        creationOptions=['COMPRESS=LZW']
    )

    gdal.Translate(output_path, ds, options=options)

    ds = None

    os.remove(input_path)


# ---------------- DOWNLOAD ----------------
def download_via_s3(s3_resource, s3_path, product_name):

    try:
        date_str = product_name.split('_')[3]
        year, month, day = date_str[0:4], date_str[4:6], date_str[6:8]
    except:
        year, month, day = "Unknown", "Unknown", "Unknown"

    bucket_name, prefix = s3_path.lstrip('/').split('/', 1)

    bucket = s3_resource.Bucket(bucket_name)

    # Landsat bands
    target_bands = [
        "_B2.TIF",
        "_B3.TIF",
        "_B4.TIF",
        "_B5.TIF"
    ]

    print(f"\nProcessing Product: {product_name}")

    objects = list(bucket.objects.filter(Prefix=prefix))

    for obj in objects:

        is_target_band = any(band in obj.key for band in target_bands)
        is_metadata = obj.key.endswith('.xml')

        if is_target_band or is_metadata:

            rel_path = os.path.relpath(obj.key, prefix)

            local_dir = os.path.join(year, month, day, product_name)

            local_file = os.path.join(local_dir, rel_path)

            if os.path.exists(local_file):
                continue

            os.makedirs(os.path.dirname(local_file), exist_ok=True)

            with tqdm(
                total=obj.size,
                unit='B',
                unit_scale=True,
                desc=os.path.basename(rel_path)
            ) as pbar:

                bucket.download_file(
                    obj.key,
                    local_file,
                    Callback=pbar.update
                )


# ---------------- MAIN ----------------
def main(start, end):

    scenes = search_products(start, end, COLLECTION)

    count = len(scenes)

    total_gb = sum(s.get("ContentLength", 0) for s in scenes) / (1024**3)

    print(f"\nFound {count} scenes")
    print(f"Total download size: {total_gb:.2f} GB")

    if count == 0:
        return

    s3_res = boto3.resource(
        's3',
        endpoint_url=S3_ENDPOINT,
        aws_access_key_id=S3_ACCESS_KEY,
        aws_secret_access_key=S3_SECRET_KEY
    )

    for scene in scenes:

        download_via_s3(
            s3_res,
            scene['S3Path'],
            scene['Name']
        )


main(START_DATE, END_DATE)
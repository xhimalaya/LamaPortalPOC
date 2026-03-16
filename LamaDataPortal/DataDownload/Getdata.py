import os
import requests
import boto3
import urllib3
from tqdm import tqdm
from shapely.geometry import shape
import re
from osgeo import gdal

# --- 1. SETTINGS ---
# Get these from your Copernicus Data Space Dashboard
S3_ACCESS_KEY = "N044LJBWLQ2442M3KRS8"
S3_SECRET_KEY = "XrflYnL0RMTUbYqvEgTXQEGIcusLrEWn17owK3gN"

START_DATE = "2024-01-01T00:00:00.000Z"
END_DATE   = "2024-01-05T23:59:59.999Z"
COLLECTION = "SENTINEL-2" 

# Bypass SSL warnings for corporate networks
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Endpoints
S3_ENDPOINT = "https://eodata.dataspace.copernicus.eu"
ODATA_URL = "https://catalogue.dataspace.copernicus.eu/odata/v1/Products"

def search_products(start, end, collection):
    bbox_wkt = "POLYGON((72.5 32.0, 80.5 32.0, 80.5 37.5, 72.5 37.5, 72.5 32.0))"
    
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0.0.0 Safari/537.36",
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
    print(f"Searching for scenes...")
    response = requests.get(ODATA_URL, params=params, headers=headers, timeout=60, verify=False)
    response.raise_for_status()
    
    return response.json().get("value", [])


def convert_to_tiff(input_path):
    """Converts a .jp2 file to a GeoTIFF and removes the original."""
    output_path = input_path.replace(".jp2", ".tif")
    
    print(f" > Converting to GeoTIFF: {os.path.basename(output_path)}")
    
    # Open the JP2 file
    ds = gdal.Open(input_path)
    if ds is None:
        print(f"   ! Failed to open {input_path}")
        return
    
    # Translate to GTiff with LZW compression (saves space)
    options = gdal.TranslateOptions(format='GTiff', creationOptions=['COMPRESS=LZW'])
    gdal.Translate(output_path, ds, options=options)
    
    ds = None # Close file
    
    # Optional: Delete the original .jp2 to save disk space
    os.remove(input_path)

def download_via_s3(s3_resource, s3_path, product_name):
    try:
        date_str = product_name.split('_')[2]
        year, month, day = date_str[0:4], date_str[4:6], date_str[6:8]
    except (IndexError, ValueError):
        year, month, day = "Unknown", "Unknown", "Unknown"
    bucket_name, prefix = s3_path.lstrip('/').split('/', 1)
    bucket = s3_resource.Bucket(bucket_name)
    target_bands = ["_B03", "_B06", "_B11"]
    print(f"\n--- Processing Product: {product_name} ---")
    objects = list(bucket.objects.filter(Prefix=prefix))
    
    for obj in objects:
        is_target_band = any(band in obj.key for band in target_bands) and obj.key.endswith('.jp2')
        is_metadata = obj.key.endswith('.xml')

        if is_target_band or is_metadata:
            rel_path = os.path.relpath(obj.key, prefix)
            local_dir = os.path.join(year, month, day, product_name)
            local_file = os.path.join(local_dir, rel_path)
            final_file_check = local_file.replace(".jp2", ".tif") if is_target_band else local_file
            if os.path.exists(final_file_check):
                continue
            
            os.makedirs(os.path.dirname(local_file), exist_ok=True)
            with tqdm(total=obj.size, unit='B', unit_scale=True, desc=f" > {os.path.basename(rel_path)}") as pbar:
                bucket.download_file(obj.key, local_file, Callback=pbar.update)
            if is_target_band:
                convert_to_tiff(local_file)


import datetime
def main(START_DATE, END_DATE):
    try:
        if not START_DATE:
            START_DATE = datetime.datetime.now().date()
        
        if not END_DATE:
            END_DATE = datetime.datetime.now().date()
        scenes = search_products(START_DATE, END_DATE, "SENTINEL-2")
        count = len(scenes)
        total_gb = sum(s.get("ContentLength", 0) for s in scenes) / (1024**3)
        
        print(f"\nSuccess! Found {count} scenes.")
        print(f"Total Download Volume: {total_gb:.2f} GB")
        
        if count > 0:
            print("Starting Downloading")
            s3_res = boto3.resource(
                's3',
                endpoint_url=S3_ENDPOINT,
                aws_access_key_id=S3_ACCESS_KEY,
                aws_secret_access_key=S3_SECRET_KEY
            )
            
            for scene in scenes:
                download_via_s3(s3_res, scene['S3Path'], scene['Name'])
        else:
            print("Zero scenes found. Try adjusting the date range.")

    except Exception as e:
        print(f"\nError: {e}")

import argparse

# if __name__ == "__main__":
#     parser = argparse.ArgumentParser(description="Sentinel-2 S3 Downloader for Ladakh")
#     parser.add_argument(
#         "--startdate", 
#         required=True, 
#         help="Start date in YYYY-MM-DD format (e.g., 2024-01-01)"
#     )
#     parser.add_argument(
#         "--enddate", 
#         required=True, 
#         help="End date in YYYY-MM-DD format (e.g., 2024-01-05)"
#     )

#     args = parser.parse_args()
#     formatted_start = f"{args.start}T00:00:00.000Z"
#     formatted_end = f"{args.end}T23:59:59.999Z"
#     main(formatted_start, formatted_end)

main(START_DATE, END_DATE)
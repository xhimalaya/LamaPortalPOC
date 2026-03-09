import os
import glob
import rioxarray
import xarray as xr
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATA_DIR = os.path.join(BASE_DIR, "DataDownload", "sentinel_downloads")
CUBE_DIR = os.path.join(BASE_DIR, "cube_storage")
CUBE_PATH = os.path.join(CUBE_DIR, "sentinel_cube.zarr")

os.makedirs(CUBE_DIR, exist_ok=True)

bands = ["B03", "B06", "B11"]

datasets = []

safe_dirs = sorted(glob.glob(os.path.join(DATA_DIR, "*.SAFE")))

print("SAFE scenes:", len(safe_dirs))

for safe in safe_dirs:

    scene_name = os.path.basename(safe)

    try:
        time_str = scene_name.split("_")[2]
        time = datetime.strptime(time_str, "%Y%m%dT%H%M%S")
    except:
        print("Skipping:", scene_name)
        continue

    band_arrays = []

    for band in bands:

        tif = os.path.join(safe, f"{band}.tif")

        if not os.path.exists(tif):
            continue

        print("Loading:", tif)

        da = rioxarray.open_rasterio(tif, chunks={"x":1024,"y":1024})

        # remove raster band dimension
        da = da.squeeze("band")

        # preserve spatial coordinates
        da = da.rio.write_crs(da.rio.crs)

        # add band dimension
        da = da.expand_dims(band=[band])

        band_arrays.append(da)

    if not band_arrays:
        continue

    scene_cube = xr.concat(band_arrays, dim="band")

    scene_cube = scene_cube.expand_dims(time=[time])

    datasets.append(scene_cube)

print("Building cube...")

cube = xr.concat(datasets, dim="time")

print("Cube dims:", cube.dims)

cube.to_zarr(CUBE_PATH, mode="w")

print("Cube created:", CUBE_PATH)
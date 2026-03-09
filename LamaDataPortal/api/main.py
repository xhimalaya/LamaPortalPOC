from fastapi import FastAPI, Query
import xarray as xr
import numpy as np
import os

app = FastAPI()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CUBE_PATH = os.path.join(BASE_DIR, "cube_storage", "sentinel_cube.zarr")

print("Loading cube:", CUBE_PATH)

cube = xr.open_zarr(CUBE_PATH)

cube = cube.assign_coords(
    x=np.array(cube.x.values, dtype="float64"),
    y=np.array(cube.y.values, dtype="float64")
)

print("Cube loaded")
print("Dimensions:", cube.dims)

@app.get("/health")
def health():

    return {
        "status": "ok",
        "cube_dimensions": cube.dims
    }


@app.get("/scenes")
def scenes():

    return {
        "scenes": cube.time.values.tolist()
    }


@app.get("/pixel")
def pixel(
    lat: float = Query(...),
    lon: float = Query(...),
    band: str = Query("B03")
):

    data = cube.sel(
        band=band,
        x=lon,
        y=lat,
        method="nearest"
    )

    values = data.values.tolist()

    return {
        "band": band,
        "values": values
    }

 

@app.get("/timeseries")
def timeseries(
    lat: float = Query(...),
    lon: float = Query(...),
    band: str = Query("B03")
):

    pixel = cube.sel(
        band=band,
        x=lon,
        y=lat,
        method="nearest"
    )

    results = []

    for t, v in zip(cube.time.values, pixel.values):

        results.append([
            str(t),
            [float(v)]
        ])

    return {"result": results}

@app.get("/ndvi")
def ndvi(lat: float, lon: float):

    nir = cube.sel(band="B08", x=lon, y=lat, method="nearest")
    red = cube.sel(band="B04", x=lon, y=lat, method="nearest")

    ndvi = (nir - red) / (nir + red)

    results = []

    for t, v in zip(cube.time.values, ndvi.values):

        results.append([
            str(t),
            [float(v)]
        ])

    return {"result": results}

@app.get("/ndsi")
def ndsi(lat: float, lon: float):

    green = cube.sel(band="B03", x=lon, y=lat, method="nearest")
    swir = cube.sel(band="B11", x=lon, y=lat, method="nearest")

    ndsi = (green - swir) / (green + swir)

    results = []

    for t, v in zip(cube.time.values, ndsi.values):

        results.append([
            str(t),
            [float(v)]
        ])

    return {"result": results}
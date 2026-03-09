import rioxarray
import xarray as xr
import glob

def build_cube():
    files = sorted(glob.glob("/satellite_data/*.tif"))
    datasets = []
    for i, f in enumerate(files):
        da = rioxarray.open_rasterio(
            f,
            chunks={"x":512, "y":512}
        )
        da = da.assign_coords(time=i)
        datasets.append(da)
    cube = xr.concat(datasets, dim="time")

    cube.to_zarr(
        "/cube_storage/sentinel_cube.zarr",
        mode="w"
    )
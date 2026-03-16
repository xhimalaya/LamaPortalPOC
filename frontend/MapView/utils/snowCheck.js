import { transform } from "ol/proj";

export async function checkSnowAtCoordinate(coord, map) {
  const snowLayer = map.getLayers().getArray().find(
    layer => layer.get("name") === "Snow Layer"
  );

  if (!snowLayer) {
    console.warn("Snow Layer not found on map");
    return false;
  }

  const source = snowLayer.getSource();
  const view = map.getView();
  const viewProjection = view.getProjection();
  const coordInView = transform(coord, "EPSG:4326", viewProjection);

  let url = source.getFeatureInfoUrl(
    coordInView,
    view.getResolution(),
    viewProjection,
    { INFO_FORMAT: "application/json" }
  );

  if (!url) {
    console.warn("Could not build GetFeatureInfo URL");
    return false;
  }

  url = url.replace(
    "https://vedas.sac.gov.in/ridam/",
    "/ridam/"
  );

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.features || data.features.length === 0) {
      console.log("No snow feature returned");
      return false;
    }

    const props = data.features[0].properties;
    const value =
      props.GRAY_INDEX ??
      props.value ??
      props.band1 ??
      props.Band1;

    console.log("Snow pixel value:", value, "at coord", coord);

    return value >= 20;

  } catch (err) {
    console.error("Snow detection error:", err);
    return false;
  }
}
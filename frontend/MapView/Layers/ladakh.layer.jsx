import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import { Style, Stroke, Fill } from "ol/style";
import Feature from "ol/Feature";
import Polygon from "ol/geom/Polygon";

export const createLadakhLayer = () => {

  const source = new VectorSource();

  fetch("/ladakh.geojson")
    .then(res => res.json())
    .then((data) => {

      const format = new GeoJSON();
      const features = format.readFeatures(data, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:4326",
      });
      const extent = features[0].getGeometry().getExtent()
      const padding = 5

      const worldExtent = [[
        [extent[0] - padding, extent[1] - padding],
        [extent[2] + padding, extent[1] - padding],
        [extent[2] + padding, extent[3] + padding],
        [extent[0] - padding, extent[3] + padding],
        [extent[0] - padding, extent[1] - padding],
      ]]

      const holes = [];

      features.forEach((feature) => {
        const geom = feature.getGeometry();

        if (geom.getType() === "Polygon") {
          holes.push(geom.getCoordinates()[0]);
        }

        if (geom.getType() === "MultiPolygon") {
          geom.getCoordinates().forEach((poly) => {
            holes.push(poly[0]);
          });
        }
      });

      const maskPolygon = new Polygon([...worldExtent, ...holes]);
      const maskFeature = new Feature(maskPolygon);

      source.addFeature(maskFeature);
    });

  const layer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        color: "#000000",
        width: 3,
      }),
      fill: new Fill({
        color: "rgb(0, 0, 0)",
      }),
    }),
    zIndex: 20,
  });

  return { layer, source };
};
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import { checkSnowAtCoordinate } from "../utils/snowCheck.js";

export const createRoadLayer = () => {
  const width = {
    motorway: 5,
    trunk: 4,
    primary: 3,
    secondary: 2.5,
    tertiary: 2,
  };

  const source = new VectorSource({
    url: "/vectorLayers/roads.geojson",
    format: new GeoJSON(),
  });

  const layer = new VectorLayer({
    source,
    declutter: true,

    style: (feature) => {
      const type = feature.get("highway");
      return new Style({
        stroke: new Stroke({
          color: "#111",
          width: width[type] || 2,
        }),
      });
    },
  });


  source.on("addfeature", async (e) => {
    const feature = e.feature;
    const geometry = feature.getGeometry();
    const map = window.__MAP_INSTANCE__;
    if (!map) return;
    let lineCoords;
    const geomType = geometry.getType();
    if (geomType === "LineString") {
      lineCoords = geometry.getCoordinates();
    } else if (geomType === "MultiLineString") {
      lineCoords = geometry
        .getCoordinates()
        .reduce((a, b) => (a.length > b.length ? a : b));
    } else {
      return;
    }
 
    const samplePoints = [
      lineCoords[0],
      lineCoords[Math.floor(lineCoords.length / 2)],
      lineCoords[lineCoords.length - 1],
    ];

    let snowDetected = false;
    console.log("-----------------------", samplePoints);
    for (const p of samplePoints) {
      console.log(">>>>>>>>>>>>>  ", p)
      const hasSnow = await checkSnowAtCoordinate(p, map);
      if (hasSnow) {
        snowDetected = true;
        break;
      }
    }

    if (!snowDetected) return;
    const type = feature.get("highway");
    feature.setStyle(
      new Style({
        stroke: new Stroke({
          color: "#ff0000",
          width: width[type] || 2,
        }),
      })
    );
    console.log(`Road marked CLOSED due to snow: ${feature.get("name") || "unknown"}`);
  });

  return layer;
};
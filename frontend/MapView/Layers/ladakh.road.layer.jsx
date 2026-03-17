// frontend/MapView/Layers/ladakh.road.layer.jsx

import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import { checkSnowAtCoordinate } from "../utils/snowCheck.js";

export const createRoadLayer = (map) => {

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
      const hasSnow = feature.get("hasSnow");

      return new Style({
        stroke: new Stroke({
          color: hasSnow ? "#ff0000" : "#111",
          width: width[type] || 2,
        }),
      });
    },
  });

  const checkAndMarkRoad = async (feature) => {
    const geometry = feature.getGeometry();
    let lineCoords;

    const geomType = geometry.getType();

    if (geomType === "LineString") {
      lineCoords = geometry.getCoordinates();
    } else if (geomType === "MultiLineString") {
      lineCoords = geometry
        .getCoordinates()
        .reduce((a, b) => (a.length > b.length ? a : b));
    } else return;

    if (!lineCoords || lineCoords.length === 0) return;

    const numSamples = 5;
    let snowDetected = false;

    for (let i = 0; i < numSamples; i++) {
      const idx = Math.floor((i * (lineCoords.length - 1)) / (numSamples - 1));
      const coord = lineCoords[idx];

      const hasSnow = checkSnowAtCoordinate(coord, map);

      if (hasSnow) {
        snowDetected = true;
        break;
      }
    }

    feature.set("hasSnow", snowDetected);
    feature.changed();

    console.log(
      snowDetected
        ? `Snow detected on road: ${feature.get("name") || "unknown"}`
        : `Clear road: ${feature.get("name") || "unknown"}`
    );
  };

  // Initial load
  source.on("addfeature", (e) => {
    setTimeout(() => checkAndMarkRoad(e.feature), 100);
  });

  // Refresh all roads
  layer.refreshSnowChecks = async () => {
    console.log("Refreshing snow status on ALL roads...");

    const features = source.getFeatures();

    for (const feature of features) {
      await checkAndMarkRoad(feature);
    }

    console.log(`Refreshed ${features.length} roads`);
  };

  // Listen to snow layer change
  setTimeout(() => {
    const snowLayer = map
      .getLayers()
      .getArray()
      .find((l) => l.get("name") === "Snow Layer");

    if (snowLayer) {
      console.log("Attached auto-refresh listener to Snow Layer");

      snowLayer.on("change", async () => {
        console.log("now Layer updated — refreshing roads");
        await layer.refreshSnowChecks();
      });
    }
  }, 500);

  return layer;
};
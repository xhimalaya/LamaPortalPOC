import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import GeoJSON from "ol/format/GeoJSON";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";

import {
  isSnowPixel,
  buildSnowGrid,
  initSnowWorker,
  onSnowGridReady
} from "../utils/snowCache.js";

export const createRoadLayer = (map) => {

  // INIT WORKER ONCE
  initSnowWorker();

  const widthMap = {
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
          width: widthMap[type] || 2,
        }),
      });
    },
  });

  // FAST ROAD CHECK (NO ASYNC)
  const checkAndMarkRoad = (feature) => {
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

    // minimal sampling (fast + accurate)
    const indices = [
      0,
      Math.floor(lineCoords.length / 2),
      lineCoords.length - 1
    ];

    let snowDetected = false;

    for (let i = 0; i < indices.length; i++) {
      const coord = lineCoords[indices[i]];

      if (isSnowPixel(map, coord)) {
        snowDetected = true;
        break;
      }
    }

    feature.set("hasSnow", snowDetected);
    feature.changed();
  };

  // Initial feature load
  source.on("addfeature", (e) => {
    setTimeout(() => checkAndMarkRoad(e.feature), 50);
  });

  // REFRESH ALL ROADS
  layer.refreshSnowChecks = async () => {
    console.log("Refreshing snow status on ALL roads...");

    const features = source.getFeatures();

    for (const feature of features) {
      checkAndMarkRoad(feature);
    }

    console.log(`Refreshed ${features.length} roads`);
  };

  // INITIAL GRID BUILD (WORKER)
  setTimeout(() => {
    console.log("Initial worker grid build...");

    buildSnowGrid(map);

    onSnowGridReady(async () => {
      console.log("Initial grid ready → updating roads");
      await layer.refreshSnowChecks();
    });

  }, 300);

  // LISTEN TO SNOW LAYER CHANGES (DEBOUNCED + WORKER)
  setTimeout(() => {
    const snowLayer = map
      .getLayers()
      .getArray()
      .find((l) => l.get("name") === "Snow Layer");

    if (!snowLayer) return;

    console.log("Attached worker-based snow listener");

    let timeout;

    snowLayer.on("change", () => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        console.log("Snow layer updated → sending to worker");

        buildSnowGrid(map);

        onSnowGridReady(async () => {
          console.log("Worker finished → updating roads");

          await layer.refreshSnowChecks();
        });

      }, 200);
    });

  }, 500);

  return layer;
};
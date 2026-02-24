<script setup>
import { onMounted } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { Style, Stroke, Fill } from "ol/style"
import { fromLonLat } from "ol/proj"

// WMS layers
import {
  nationalHighwaysLayer,
  // districtRoadsLayer,
  // stateBoundaryLayer,
  glacierOutlineLayer
} from "./vedasLayers.jsx"

onMounted(() => {

  const vectorSource = new VectorSource({
    url: "/ladakh.geojson",
    format: new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:4326'
    })
  })

  const ladakhLayer = new VectorLayer({
    source: vectorSource,
    style: new Style({
      stroke: new Stroke({
        color: "#FFD700",
        width: 3
      }),
      fill: new Fill({
        color: "rgba(255,215,0,0)"
      })
    })
  })

  const view = new View({
    projection: 'EPSG:4326',
    center: fromLonLat([77.6, 34.2]),
    zoom: 6
  })

  const map = new Map({
    target: "map",
    layers: [
      // stateBoundaryLayer,
      // districtRoadsLayer,
      nationalHighwaysLayer,
      glacierOutlineLayer,
      ladakhLayer
    ],
    view: view
  })

  vectorSource.once("change", () => {
    if (vectorSource.getState() === "ready") {
      view.fit(vectorSource.getExtent(), {
        padding: [60, 60, 60, 60],
        duration: 1000,
        maxZoom: 10
      })
    }
  })

})
</script>

<template>
  <div id="map" style="height: 100vh; width: 100%; background: #ffffff;"></div>
</template>
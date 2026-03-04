<script setup>
import { onMounted, ref } from "vue"
import Map from "ol/Map"
import View from "ol/View"

import MapHeader from "./utils/MapHeader.vue"
import ToggleLayer from "./utils/toggleLayer.vue"

import { getLayers } from "./vedaslayers.jsx"
import { applyTileBoundaryFilter } from "./utils/tileFilter.js"
import { attachTileClickHandler } from "./utils/clicklocation.jsx"

const layerStates = ref([])

onMounted(() => {

  const view = new View({
    projection: "EPSG:4326",
    center: [77.6, 34.2],
    zoom: 7
  })

  const map = new Map({
    target: "map",
    layers: [],
    view
  })

  const {
    ladakh,
    nationalHighwaysLayer,
    glacierOutlineLayer,
    ridamLayers
  } = getLayers()

  map.addLayer(ladakh.layer)

  layerStates.value.push({
    id: "Ladakh Boundary",
    layer: ladakh.layer,
    visible: ladakh.layer.getVisible()
  })

  ladakh.source.once("change", () => {

    if (ladakh.source.getState() !== "ready") return

    const extent = ladakh.source.getExtent()

    view.fit(extent, {
      padding: [60, 60, 60, 60],
      duration: 1200,
      maxZoom: 12
    })

    // Apply tile filtering
    applyTileBoundaryFilter(
      nationalHighwaysLayer,
      extent,
      "National Highways"
    )

    applyTileBoundaryFilter(
      glacierOutlineLayer,
      extent,
      "Glacier Outline"
    )

    map.addLayer(nationalHighwaysLayer)
    map.addLayer(glacierOutlineLayer)

    layerStates.value.push({
      id: "National Highways",
      layer: nationalHighwaysLayer,
      visible: nationalHighwaysLayer.getVisible()
    })

    layerStates.value.push({
      id: "Glacier Outline",
      layer: glacierOutlineLayer,
      visible: glacierOutlineLayer.getVisible()
    })

    ridamLayers.forEach(layer => {

      applyTileBoundaryFilter(
        layer,
        extent,
        layer.__layerId
      )

      map.addLayer(layer)

      layerStates.value.push({
        id: layer.__layerId,
        layer,
        visible: layer.getVisible()
      })

      // Attach click handler only for ridam_T0S0M0
      if (layer.__layerId === "ridam_T0S0M0") {
        attachTileClickHandler(map, layer)
      }
    })

    console.log("All layers loaded and boundary filtering applied.")
  })
})
</script>

<template>
  <div class="map-container">
    <MapHeader />

    <div class="map-wrapper">
      <div id="map"></div>

      <!-- Layer Toggle Panel -->
      <ToggleLayer :layerStates="layerStates" />
    </div>
  </div>
</template>

<style>
/* ========================= */
/* Layout */
/* ========================= */

.map-container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  position: relative;
  flex: 1;
}

#map {
  width: 100%;
  height: 100%;
  background: #ffffff;
}

/* ========================= */
/* OpenLayers Controls Styling */
/* ========================= */

.ol-overlaycontainer-stopevent {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  top: 110px !important;
  left: 20px !important;
  width: auto !important;
  height: auto !important;
  pointer-events: none;
}

.ol-control {
  pointer-events: auto;
  position: relative !important;
  top: unset !important;
  left: unset !important;
  margin: 0 !important;
  border-radius: 10px;
}

/* ========================= */
/* Zoom Buttons */
/* ========================= */

.ol-zoom {
  display: flex;
  flex-direction: column;
}

.ol-zoom button {
  width: 50px;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 10px;
  border: 5px solid #05a0b4;
  background: rgba(0, 0, 0, 0.85);
  color: #05a0b4;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
}

.ol-zoom button:hover {
  background: #bed305;
  color: #000;
  transform: scale(1.05);
}

.ol-zoom button:focus {
  outline: none;
}

/* ========================= */
/* Rotate Button */
/* ========================= */

.ol-rotate {
  display: block;
}

.ol-rotate button {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  border: 5px solid #05a0b4;
  background: rgba(0, 0, 0, 0.85);
  color: #05a0b4;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 10px rgba(236, 6, 6, 0.3);
}

.ol-rotate button:hover {
  background: #cec006;
  color: black;
  transform: scale(1.05);
}

/* ========================= */
/* Attribution */
/* ========================= */

.ol-attribution {
  display: block;
  bottom: 15px !important;
  right: 15px !important;
  background: rgba(0, 0, 0, 0.75);
  border-radius: 6px;
  padding: 4px 8px;
  color: white;
  font-size: 12px;
}

.ol-attribution button,
.ol-attribution ul {
  color: white;
}

.ol-control button {
  border: none;
}
</style>
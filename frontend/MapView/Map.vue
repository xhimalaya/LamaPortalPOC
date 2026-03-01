<script setup>
import { onMounted } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import MapHeader from './utils/MapHeader.vue'

import { getLayers } from "./vedaslayers.jsx"
import { applyTileBoundaryFilter } from "./utils/tileFilter.js"
import { initTileBoundaryEngine } from "./utils/tileBoundaryEngine"
import { applyGlobalTileFilter } from "./utils/applyGlobalTileFilter"

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

  ladakh.source.once("change", () => {

    if (ladakh.source.getState() !== "ready") return

    const extent = ladakh.source.getExtent()

    view.fit(extent, {
      padding: [60, 60, 60, 60],
      duration: 1200,
      maxZoom: 12
    })

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

    ridamLayers.forEach(layer => {

  applyTileBoundaryFilter(
        layer,
        extent,
        layer.__layerId
      )

      map.addLayer(layer)
    })

    console.log("✔ All layers loaded and boundary filtering applied.")
  })
})
</script>

<template>
  <div class="map-container">
    <MapHeader />

    <!-- Your map div – offset by header height -->
    <div id="map" style="height: calc(100vh - 90px); width: 100%; margin-top: 90px;"></div>
  </div>
  <div
    id="map"
    style="height: 100vh; width: 100%; background: #ffffff;"
  ></div>
</template>
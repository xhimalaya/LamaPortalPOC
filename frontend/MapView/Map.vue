<script setup>
import { onMounted, ref } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import MapHeader from './utils/MapHeader.vue'

import { getLayers } from "./vedaslayers.jsx"
import { applyTileBoundaryFilter } from "./utils/tileFilter.js"
import ToggleLayer from "./utils/toggleLayer.vue"

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

  // Add Ladakh mask
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

    // Apply tile filtering (unchanged)
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

  <!-- Extracted Layer Toggle Component -->
  <ToggleLayer :layerStates="layerStates" />
</template>
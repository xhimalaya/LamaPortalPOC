<script setup>
import { onMounted, ref } from "vue"
import Map from "ol/Map"
import View from "ol/View"

import MapHeader from "./utils/MapHeader.vue"
import ToggleLayer from "./utils/toggleLayer.vue"
import Chart from "./utils/Chart.vue"

import { getLayers } from "./vedaslayers.jsx"
import { applyTileBoundaryFilter } from "./utils/tileFilter.js"
import { attachTileClickHandler } from "./utils/clicklocation.jsx"

const layerStates = ref([])

// 🔥 Chart state
const showChart = ref(false)
const selectedBBox = ref(null)

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

    applyTileBoundaryFilter(nationalHighwaysLayer, extent, "National Highways")
    applyTileBoundaryFilter(glacierOutlineLayer, extent, "Glacier Outline")

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

      applyTileBoundaryFilter(layer, extent, layer.__layerId)
      map.addLayer(layer)

      layerStates.value.push({
        id: layer.__layerId,
        layer,
        visible: layer.getVisible()
      })

      if (layer.__layerId === "ridam_T0S0M0") {
        attachTileClickHandler(map, layer, (bbox) => {
          selectedBBox.value = bbox
          showChart.value = true
        })
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
      <ToggleLayer :layerStates="layerStates" />
    </div>
  </div>
  <Chart
    :show="showChart"
    :bbox="selectedBBox"
    @close="showChart = false"
  />
</template>

<style>
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
</style>
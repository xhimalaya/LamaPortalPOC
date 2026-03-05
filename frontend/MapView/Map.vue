<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import Map from "ol/Map"
import View from "ol/View"

import MapHeader from "./utils/MapHeader.vue"
import ToggleLayer from "./utils/toggleLayer.vue"
import BottomModal from "./utils/Chart.vue"

import { getLayers } from "./vedaslayers.jsx"
import { applyTileBoundaryFilter } from "./utils/tileFilter.js"

import "./utils/css/map.css"

const layerStates = ref([])

const showModal = ref(false)
const clickedLat = ref(null)
const clickedLon = ref(null)

const chartRange = ref(null)

let map


function registerLayer(id, layer, options = {}) {

  map.addLayer(layer)

  layerStates.value.push({
    id,
    layer,
    visible: layer.getVisible(),
    daterange: options.daterange || false,
    compositeDays: 5,
    centerDate: null,
    startDate: null,
    endDate: null
  })

}


function handleDateChange(data) {

  chartRange.value = data

}


function closeModal() {
  showModal.value = false
}


onMounted(() => {

  const view = new View({
    projection: "EPSG:4326",
    center: [77.6, 34.2],
    zoom: 7
  })

  map = new Map({
    target: "map",
    layers: [],
    view
  })


  map.on("singleclick", (event) => {

    const [lon, lat] = event.coordinate

    clickedLon.value = lon
    clickedLat.value = lat

    showModal.value = true

  })


  const { ladakh, baseLayers, ridamLayers } = getLayers()

  registerLayer("Ladakh Boundary", ladakh.layer)


  ladakh.source.once("change", () => {

    if (ladakh.source.getState() !== "ready") return

    const extent = ladakh.source.getExtent()

    view.fit(extent, {
      padding: [60,60,60,60],
      duration: 1200,
      maxZoom: 12
    })


    baseLayers.forEach(layer => {

      applyTileBoundaryFilter(layer, extent, "base-layer")

      registerLayer(
        layer.get("name") || "Base Layer",
        layer
      )

    })


    ridamLayers.forEach(layer => {

      const id = layer.__layerId || "ridam-layer"

      applyTileBoundaryFilter(layer, extent, id)

      registerLayer(
        id,
        layer,
        { daterange: layer.__daterange || false }
      )

    })

  })

})


onUnmounted(() => {

  if (map) map.setTarget(null)

})
</script>


<template>

<div class="map-container">

<MapHeader />

<div class="map-wrapper">

<div id="map"></div>

<ToggleLayer
  :layerStates="layerStates"
  @dateChanged="handleDateChange"
/>

</div>

<BottomModal
  :visible="showModal"
  :lat="clickedLat"
  :lon="clickedLon"
  :dateRange="chartRange"
  @close="closeModal"
/>

</div>

</template>
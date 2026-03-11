<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import Overlay from 'ol/Overlay'

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
const clickedAddress = ref('')  // ← add this back

const chartRange = ref(null)

let map
let addressOverlay = null

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

async function getAddressFromLatLon(lat, lon) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    )
    if (!response.ok) throw new Error('Failed')
    const data = await response.json()
    const address = data.display_name || 'No address found'
    console.log('Nominatim address:', address)
    return address
  } catch (err) {
    console.error('Nominatim error:', err)
    return 'Error fetching address'
  }
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

  // Create overlay once
  const overlayEl = document.createElement('div')
  overlayEl.className = 'address-popup'
  overlayEl.innerHTML = `
    <div class="popup-content">
      <button class="popup-close" onclick="this.closest('.address-popup').style.display='none'">×</button>
      <h4>Clicked Location</h4>
      <p id="popup-coords"></p>
      <p id="popup-address">Loading address...</p>
    </div>
  `
  overlayEl.style.background = 'white'
  overlayEl.style.borderRadius = '12px'
  overlayEl.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)'
  overlayEl.style.padding = '16px 20px'
  overlayEl.style.minWidth = '240px'
  overlayEl.style.maxWidth = '360px'
  overlayEl.style.fontSize = '14px'
  overlayEl.style.color = '#333'
  overlayEl.style.border = '1px solid #ddd'

  addressOverlay = new Overlay({
    element: overlayEl,
    autoPan: true,
    autoPanAnimation: { duration: 250 },
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -15]
  })

  map.addOverlay(addressOverlay)

  // Single click handler (only one!)
  map.on("singleclick", async (event) => {
    const coordinate = event.coordinate
    const [lon, lat] = coordinate

    clickedLon.value = lon
    clickedLat.value = lat
    showModal.value = true  // keep bottom modal if you want

    // Position and show overlay
    addressOverlay.setPosition(coordinate)
    overlayEl.style.display = 'block'

    // Update coords
    overlayEl.querySelector('#popup-coords').textContent = `Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`

    // Fetch address
    overlayEl.querySelector('#popup-address').textContent = 'Fetching address...'
    const address = await getAddressFromLatLon(lat, lon)
    overlayEl.querySelector('#popup-address').textContent = address
  })

  // Rest of your layer loading...
  const { ladakh, baseLayers, ridamLayers } = getLayers()
  registerLayer("Ladakh Boundary", ladakh.layer)

  ladakh.source.once("change", () => {
    if (ladakh.source.getState() !== "ready") return
    const extent = ladakh.source.getExtent()
    view.fit(extent, { padding: [60,60,60,60], duration: 1200, maxZoom: 12 })

    baseLayers.forEach(layer => {
      applyTileBoundaryFilter(layer, extent, "base-layer")
      registerLayer(layer.get("name") || "Base Layer", layer)
    })

    ridamLayers.forEach(layer => {
      const id = layer.__layerId || "ridam-layer"
      applyTileBoundaryFilter(layer, extent, id)
      registerLayer(id, layer, { daterange: layer.__daterange || false })
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
      :address="clickedAddress"
      :dateRange="chartRange"
      @close="closeModal"
    />
    <!-- Footer -->
    <footer class="map-footer">
      Copyright © University of Ladakh
    </footer>
  </div>
</template>

<style scoped>
/* Your existing styles... */

/* Popup styles (white background) */
.address-popup {
  background: white;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.25);
  padding: 16px 20px;
  min-width: 240px;
  max-width: 360px;
  font-size: 14px;
  color: #333;
  z-index: 2000;
  pointer-events: auto;
  border: 1px solid #ddd;
}

.popup-content {
  position: relative;
}

.popup-close {
  position: absolute;
  top: -10px;
  right: -10px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 18px;
  cursor: pointer;
  line-height: 28px;
  text-align: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.popup-content h4 {
  margin: 0 0 12px;
  color: #0f4c81;
  font-size: 16px;
}

.popup-content p {
  margin: 6px 0;
  line-height: 1.4;
}
.map-container {
  display: flex;
  flex-direction: column;
  height: 95vh;
}

.map-wrapper {
  flex: 1;
  position: relative;
}

.map-footer {
  background: #0f4c81;
  color: white;
  text-align: center;
  padding: 6px 0;
  font-size: 13px;
  position: static;
  z-index: 1501;
}
</style>
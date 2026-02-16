<template>
  <div class="app-wrapper">
    <!-- OSM background map -->
    <div id="background-map" class="background-map"></div>

    <!-- Your app content on top -->
    <div class="content-overlay">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';

onMounted(() => {
  new Map({
    target: 'background-map',
    view: new View({
      center: [77.58 * 100000, 34.15 * 100000], // Approximate Ladakh center (in EPSG:3857 meters)
      zoom: 7
    }),
    layers: [
      new TileLayer({
        source: new OSM({
          attributions: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        })
      })
    ],
    controls: [] // Hide zoom, attribution, etc. for background
  });
});
</script>

<style scoped>
.app-wrapper {
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.background-map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* Behind content */
}

.content-overlay {
  position: relative;
  z-index: 1; /* On top of map */
  height: 100%;
  width: 100%;
  background: rgba(255, 255, 255, 0.1); /* Slight overlay to make text readable */
  backdrop-filter: blur(2px); /* Optional: subtle blur for readability */
}
</style>
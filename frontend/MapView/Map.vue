<script setup>
import { onMounted } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import TileLayer from "ol/layer/Tile"
import VectorLayer from "ol/layer/Vector"
import OSM from "ol/source/OSM"
import TileWMS from "ol/source/TileWMS"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { fromLonLat } from "ol/proj"
import { Style, Stroke, Fill } from "ol/style"

onMounted(() => {

  // // Base OSM Layer:
  // const baseLayer = new TileLayer({
  //   source: new OSM()
  // })

  // Snow WMS from VEDAS GeoServer
  const snowLayer = new TileLayer({
    source: new TileWMS({
      url: 'https://vedas.sac.gov.in/geoserver/vedas/wms',
      params: {
        'LAYERS': 'vedas:snow',    // replace with actual layer name
        'TILED': true,
        'FORMAT': 'image/png'
      },
      serverType: 'geoserver',
      crossOrigin: 'anonymous'
    }),
    opacity: 0.6
  })

  // Glacier WMS from VEDAS GeoServer
  const glacierLayer = new TileLayer({
    source: new TileWMS({
      url: 'https://vedas.sac.gov.in/geoserver/vedas/wms',
      params: {
        'LAYERS': 'vedas:glacier', // replace with actual layer name
        'TILED': true,
        'FORMAT': 'image/png'
      },
      serverType: 'geoserver',
      crossOrigin: 'anonymous'
    }),
    opacity: 0.6
  })

  // Ladakh boundary if you want
  const boundaryLayer = new VectorLayer({
    source: new VectorSource({
      url: "/geo/ladakh.geojson",
      format: new GeoJSON()
    }),
    style: new Style({
      stroke: new Stroke({ color: "#ff0000", width: 3 }),
      fill: new Fill({ color: "rgba(255,0,0,0.15)" })
    })
  })

  new Map({
    target: "map",
    layers: [
      snowLayer,
      glacierLayer,
      boundaryLayer
    ],
    view: new View({
      center: fromLonLat([77.6, 34.2]),
      zoom: 7
    })
  })

})
</script>

<template>
  <div id="map" style="height: 100vh; width: 100%"></div>
</template>

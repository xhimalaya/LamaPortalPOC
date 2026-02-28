<script setup>
import { onMounted } from "vue"
import Map from "ol/Map"
import View from "ol/View"

import { getLayers } from "./vedaslayers.jsx"

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
    glacierOutlineLayer
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

    const [minX, minY, maxX, maxY] = extent
    const safeWkt =
      `POLYGON((${minX} ${minY},${maxX} ${minY},${maxX} ${maxY},${minX} ${maxY},${minX} ${minY}))`

    nationalHighwaysLayer.getSource().updateParams({
      CQL_FILTER: `INTERSECTS(the_geom, ${safeWkt})`
    })

    glacierOutlineLayer.getSource().updateParams({
      CQL_FILTER: `INTERSECTS(geom, ${safeWkt})`
    })

    map.addLayer(nationalHighwaysLayer)
    map.addLayer(glacierOutlineLayer)

    console.log("All layers loaded cleanly.")
  })
})
</script>

<template>
  <div id="map" style="height: 100vh; width: 100%; background: #ffffff;"></div>
</template>
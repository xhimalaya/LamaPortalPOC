<script setup>
import { onMounted } from "vue"
import Map from "ol/Map"
import View from "ol/View"
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import WKT from "ol/format/WKT"
import { Style, Stroke, Fill } from "ol/style"

import {
  nationalHighwaysLayer,
  glacierOutlineLayer
} from "./vedasLayers.jsx"

onMounted(() => {
  const ladakhSource = new VectorSource({
    url: "/ladakh.geojson",
    format: new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:4326"
    })
  })

  const ladakhLayer = new VectorLayer({
    source: ladakhSource,
    style: new Style({
      stroke: new Stroke({ color: "#FFD700", width: 4 }),
      fill: new Fill({ color: "rgba(255, 215, 0, 0.1)" })
    })
  })

  const view = new View({
    projection: "EPSG:4326",
    center: [77.6, 34.2],
    zoom: 7
  })

  const map = new Map({
    target: "map",
    layers: [ladakhLayer],
    view
  })

  ladakhSource.once("change", () => {
    if (ladakhSource.getState() !== "ready") return

    const features = ladakhSource.getFeatures()
    if (features.length === 0) return

    const extent = ladakhSource.getExtent()
    view.fit(extent, { padding: [60, 60, 60, 60], duration: 1200, maxZoom: 12 })
    const [minX, minY, maxX, maxY] = extent
    const safeWkt = `POLYGON((${minX} ${minY},${maxX} ${minY},${maxX} ${maxY},${minX} ${maxY},${minX} ${minY}))`
    nationalHighwaysLayer.getSource().updateParams({
      CQL_FILTER: `INTERSECTS(the_geom, ${safeWkt})`
    })
    glacierOutlineLayer.getSource().updateParams({
      CQL_FILTER: `INTERSECTS(geom, ${safeWkt})`
    })
    const layersToClip = [
      { layer: nationalHighwaysLayer, name: "National Highways", column: "the_geom" },
      { layer: glacierOutlineLayer,   name: "Glacier Outline",   column: "geom" }
    ]

    layersToClip.forEach(({ layer, name }) => {
      const source = layer.getSource()

      source.on("tileloadstart", () => console.log(`${name} → requested`))
      source.on("tileloadend",   () => console.log(`${name} → loaded OK`))
      source.on("tileloaderror", (e) => console.error(`${name} ERROR`, e))

      layer.setExtent(extent)
      source.changed()
    })

    // Add layers
    map.addLayer(nationalHighwaysLayer)
    map.addLayer(glacierOutlineLayer)

    console.log("Done.")
  })
})
</script>

<template>
  <div id="map" style="height: 100vh; width: 100%; background: #ffffff;"></div>
</template>
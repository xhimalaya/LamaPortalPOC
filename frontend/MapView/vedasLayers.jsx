import TileLayer from "ol/layer/Tile"
import TileWMS from "ol/source/TileWMS"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import WKT from "ol/format/WKT"

const WMS_URL = "/vedas/geoserver/vedas/wms"

const ladakhSource = new VectorSource({
  url: "/ladakh.geojson",
  format: new GeoJSON()
})

let ladakhExtent = null
let ladakhWKT = null

// Wait until GeoJSON loads
ladakhSource.once("change", () => {
  if (ladakhSource.getState() === "ready") {
    ladakhExtent = ladakhSource.getExtent()
    console.log("Ladakh extent loaded:", ladakhExtent)

    const wktFormat = new WKT()
    const features = ladakhSource.getFeatures()
    if (features.length > 0) {
      const geom = features[0].getGeometry()
      ladakhWKT = wktFormat.writeGeometry(geom)
      console.log("Ladakh WKT loaded:", ladakhWKT)
    }

    // Apply extent restriction and CQL filter to all layers
    const layers = [nationalHighwaysLayer, districtRoadsLayer, stateBoundaryLayer, glacierOutlineLayer]
    layers.forEach(layer => {
      layer.setExtent(ladakhExtent)
      if (ladakhWKT) {
        const cql = `INTERSECTS(the_geom, ${ladakhWKT})`
        layer.getSource().updateParams({ CQL_FILTER: cql })
        layer.getSource().changed() // Trigger refresh if needed
      }
    })
  }
})

const createLayer = (layerName, opacity = 1) => {
  console.log("Creating WMS Layer:", layerName)

  const source = new TileWMS({
    url: WMS_URL,
    params: {
      LAYERS: layerName,
      FORMAT: "image/png",
      TRANSPARENT: true,
      TILED: true
    },
    serverType: "geoserver",
    transition: 0
  })

  source.on("tileloadstart", () => {
    console.log(`[${layerName}] Tile loading started`)
  })

  source.on("tileloadend", () => {
    console.log(`[${layerName}] Tile loaded successfully`)
  })

  source.on("tileloaderror", (e) => {
    console.error(`[${layerName}] Tile load ERROR`, e)
  })

  const layer = new TileLayer({
    source,
    opacity,
    visible: true
  })

  return layer
}

// Create layers
export const nationalHighwaysLayer = createLayer("INDIA_NHROADS", 0.9)
export const districtRoadsLayer = createLayer("INDIA_DISTROADS", 0.7)
export const stateBoundaryLayer = createLayer("INDIA_STATE_BOUNDARY_NEW", 0.8)
export const glacierOutlineLayer = createLayer("INDIA_50KGLACIEROUTLINE2004_07", 0.8)
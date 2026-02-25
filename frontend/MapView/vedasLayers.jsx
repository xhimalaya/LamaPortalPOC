import TileLayer from "ol/layer/Tile"
import TileWMS from "ol/source/TileWMS"

const WMS_URL = "/vedas/geoserver/vedas/wms"

const createLayer = (layerName, opacity = 1) => {
  return new TileLayer({
    source: new TileWMS({
      url: WMS_URL,
      params: {
        LAYERS: layerName,
        FORMAT: "image/png",
        TRANSPARENT: true,
        TILED: true
      },
      serverType: "geoserver",
      transition: 0
    }),
    opacity,
    visible: true
  })
}

export const nationalHighwaysLayer = createLayer("INDIA_NHROADS", 0.9)
export const districtRoadsLayer = createLayer("INDIA_DISTROADS", 0.7)
export const stateBoundaryLayer = createLayer("INDIA_STATE_BOUNDARY_NEW", 0.8)
export const glacierOutlineLayer = createLayer("INDIA_50KGLACIEROUTLINE2004_07", 0.8)
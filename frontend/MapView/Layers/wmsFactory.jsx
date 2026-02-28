import TileLayer from "ol/layer/Tile"
import TileWMS from "ol/source/TileWMS"

const WMS_URL = "/vedas/geoserver/vedas/wms"

export const createWMSLayer = (layerName, opacity = 1) => {
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
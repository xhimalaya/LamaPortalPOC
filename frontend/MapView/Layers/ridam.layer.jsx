import TileLayer from "ol/layer/Tile"
import TileWMS from "ol/source/TileWMS"

export const createRidamLayers = (configList = []) => {

  return configList
    .filter(cfg => cfg.active)
    .map(cfg => {

      let argsString = ""

      if (cfg.args && typeof cfg.args === "object") {
        argsString = Object.entries(cfg.args)
          .map(([key, value]) => `${key}:${value}`)
          .join(";")
      }

      const wmsParams = {
        ...cfg.wmsParams,
        ...(argsString && { ARGS: argsString }),
        ...(cfg.styleGradient && { STYLES: cfg.styleGradient }),
        ...(cfg.legendOptions && { LEGEND_OPTIONS: cfg.legendOptions })
      }

      const layer = new TileLayer({
        source: new TileWMS({
          url: cfg.baseUrl,
          params: wmsParams,
          serverType: cfg.serverType || "geoserver",
          transition: cfg.transition ?? 0,
          crossOrigin: cfg.crossOrigin ?? null
        }),
        opacity: cfg.opacity ?? 1,
        visible: cfg.visible ?? true,
        zIndex: cfg.zIndex ?? 1
      })

      layer.__layerId = cfg.id
      layer.__type = cfg.type || "RIDAM"
      layer.__datasetID = cfg.datasetID
      layer.__daterange = cfg.daterange || false

      return layer
    })
}
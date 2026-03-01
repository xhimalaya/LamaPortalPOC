import { getTopLeft } from "ol/extent"

const DEBUG = false

export const applyTileBoundaryFilter = (
  layer,
  boundaryExtent,
  layerName = "Layer"
) => {

  const source = layer.getSource()

  if (source.__boundaryFilterApplied) return
  source.__boundaryFilterApplied = true

  const original = source.getTileUrlFunction()

  const tileRangeCache = {}

  source.setTileUrlFunction((tileCoord, pixelRatio, projection) => {

    const [z, x, y] = tileCoord

    const tileGrid = source.getTileGridForProjection(projection)
    if (!tileGrid) return original(tileCoord, pixelRatio, projection)

    if (!tileRangeCache[z]) {

      const minTile = tileGrid.getTileCoordForCoordAndZ(
        [boundaryExtent[0], boundaryExtent[3]],
        z
      )

      const maxTile = tileGrid.getTileCoordForCoordAndZ(
        [boundaryExtent[2], boundaryExtent[1]],
        z
      )

      tileRangeCache[z] = {
        minX: minTile[1],
        maxX: maxTile[1],
        minY: minTile[2],
        maxY: maxTile[2]
      }

      if (DEBUG) {
        console.log(
          `⚡ ${layerName} Z${z} Tile Range:`,
          tileRangeCache[z]
        )
      }
    }

    const range = tileRangeCache[z]

    if (
      x < range.minX ||
      x > range.maxX ||
      y < range.minY ||
      y > range.maxY
    ) {
      if (DEBUG) console.log(`${layerName} CLIPPED`, { z, x, y })
      return ""
    }

    if (DEBUG) console.log(`${layerName} PASSED`, { z, x, y })

    return original(tileCoord, pixelRatio, projection)
  })
}
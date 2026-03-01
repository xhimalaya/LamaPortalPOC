import { isTileInsideBoundary } from "./tileBoundaryEngine"

export const applyGlobalTileFilter = (layer) => {

  const source = layer.getSource()

  if (source.__globalFilterApplied) return
  source.__globalFilterApplied = true

  const original = source.getTileUrlFunction()

  source.setTileUrlFunction((tileCoord, pixelRatio, projection) => {

    if (!isTileInsideBoundary(tileCoord)) {
      return undefined   // faster than ""
    }

    return original(tileCoord, pixelRatio, projection)
  })
}
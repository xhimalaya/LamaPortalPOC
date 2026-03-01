// tileBoundaryEngine.js

let boundaryExtent = null
let tileGrid = null
let zoomTileRangeCache = {}
let initialized = false

export const initTileBoundaryEngine = (
  extent,
  projection,
  sampleSource
) => {
  boundaryExtent = extent
  tileGrid = sampleSource.getTileGridForProjection(projection)
  zoomTileRangeCache = {}
  initialized = true
}

export const isTileInsideBoundary = (tileCoord) => {
  if (!initialized || !tileGrid) return true
  const [z, x, y] = tileCoord
  if (!zoomTileRangeCache[z]) {
    const minTile = tileGrid.getTileCoordForCoordAndZ(
      [boundaryExtent[0], boundaryExtent[3]],
      z
    )
    const maxTile = tileGrid.getTileCoordForCoordAndZ(
      [boundaryExtent[2], boundaryExtent[1]],
      z
    )
    zoomTileRangeCache[z] = {
      minX: minTile[1],
      maxX: maxTile[1],
      minY: minTile[2],
      maxY: maxTile[2]
    }
  }
  const range = zoomTileRangeCache[z]
  return !(
    x < range.minX ||
    x > range.maxX ||
    y < range.minY ||
    y > range.maxY
  )
}
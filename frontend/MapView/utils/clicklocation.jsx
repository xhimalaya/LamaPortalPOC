export const attachTileClickHandler = (map, wmsLayer) => {
  map.on("singleclick", (event) => {
    const coordinate = event.coordinate
    const view = map.getView()
    const zoom = view.getZoom()
    const projection = view.getProjection()

    const source = wmsLayer.getSource()
    const tileGrid = source.getTileGridForProjection(projection)

    if (!tileGrid) return

    const tileCoord = tileGrid.getTileCoordForCoordAndZ(
      coordinate,
      Math.round(zoom)
    )

    if (!tileCoord) return

    const tileExtent = tileGrid.getTileCoordExtent(tileCoord)

    console.log("RIDAM T0S0M0 Tile BBOX:", tileExtent)
  })
}
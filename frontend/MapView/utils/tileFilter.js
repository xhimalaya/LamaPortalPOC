import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"

export function applyTileBoundaryFilter(layer) {

  const source = new VectorSource({
    url: "/ladakh.geojson",
    format: new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:4326"
    })
  })

  let geometry

  source.once("change", () => {
    geometry = source.getFeatures()[0].getGeometry()
  })

  layer.on("prerender", function (event) {

    if (!geometry) return

    const ctx = event.context
    const frameState = event.frameState
    const transform = frameState.coordinateToPixelTransform

    const coords = geometry.getCoordinates()[0]

    ctx.save()
    ctx.beginPath()

    coords.forEach((coord, i) => {

      const x =
        transform[0] * coord[0] +
        transform[1] * coord[1] +
        transform[4]

      const y =
        transform[2] * coord[0] +
        transform[3] * coord[1] +
        transform[5]

      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)

    })

    ctx.clip()

  })

  layer.on("postrender", function (event) {
    event.context.restore()
  })

}
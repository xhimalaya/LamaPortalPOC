import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { Style, Stroke, Fill } from "ol/style"

export const createLadakhBoundaryLayer = () => {

  const source = new VectorSource({
    url: "/geojson/ladakh.geojson",
    format: new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:3857"
    })
  })

  const layer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({
        color: "#FFD700",
        width: 3
      }),
      fill: new Fill({
        color: "rgba(255, 215, 0, 0.1)"
      })
    }),
    zIndex: 20
  })

  return { layer, source }
}
import VectorLayer from "ol/layer/Vector"
import VectorSource from "ol/source/Vector"
import GeoJSON from "ol/format/GeoJSON"
import { Style, Stroke, Fill } from "ol/style"

export const createLadakhLayer = () => {
  const source = new VectorSource({
    url: "/ladakh.geojson",
    format: new GeoJSON({
      dataProjection: "EPSG:4326",
      featureProjection: "EPSG:4326"
    })
  })

  const layer = new VectorLayer({
    source,
    style: new Style({
      stroke: new Stroke({ color: "#0f0e08", width: 4 }),
      fill: new Fill({ color: "rgba(255, 215, 0, 0.1)" })
    })
  })

  return { layer, source }
}
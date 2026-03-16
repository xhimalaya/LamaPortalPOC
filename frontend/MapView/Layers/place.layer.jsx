import TileLayer from "ol/layer/Tile"
import XYZ from "ol/source/XYZ"

const API_KEY = "nwsgvbqbbw5ejwj112vvisgoggiq4ov3"

export const createMapMyIndiaLayer = () => {

  const urls = []

  for (let i = 0; i <= 9; i++) {
    urls.push(
      `https://mt${i}.mapmyindia.com/advancedmaps/v1/${API_KEY}/hybrid_label/{z}/{x}/{y}.png`
    )
  }

  const layer = new TileLayer({
    source: new XYZ({
      urls: urls,
      crossOrigin: "anonymous",
      maxZoom: 19
    })
  })

  return layer
}
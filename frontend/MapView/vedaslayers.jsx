import { createLadakhLayer } from "./Layers/ladakh.layer.jsx"
import { nationalHighwaysLayer } from "./Layers/highways.layer.jsx"
import { glacierOutlineLayer } from "./Layers/glaciers.layer.jsx"

export const getLayers = () => {
  const ladakh = createLadakhLayer()

  return {
    ladakh,
    nationalHighwaysLayer,
    glacierOutlineLayer
  }
}
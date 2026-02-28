import { createLadakhLayer } from "./ladakh.layer.jsx"
import { nationalHighwaysLayer } from "./highways.layer.jsx"
import { glacierOutlineLayer } from "./glaciers.layer.jsx"

export const getLayers = () => {
  const ladakh = createLadakhLayer()

  return {
    ladakh,
    nationalHighwaysLayer,
    glacierOutlineLayer
  }
}
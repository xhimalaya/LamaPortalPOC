import { createLadakhLayer } from "./Layers/ladakh.layer.jsx"
import { createRidamLayers } from "./Layers/ridam.layer.jsx"
import { createRoadLayer } from "./Layers/ladakh.road.layer.jsx"
import { createMapMyIndiaLayer } from "./Layers/place.layer.jsx"

import { fetchLayerConfig } from "./utils/getLayerConfig.js"

// GLOBAL STATE
let ridamConfigCache = []
let loadPromise = null

// LOAD FUNCTION (ONLY ONCE)
const loadRidamConfig = (layers) => {
  if (!loadPromise) {
    console.log("Loading ridam config (blocking first time)...")

    loadPromise = fetchLayerConfig(layers)
      .then(data => {
        if (Array.isArray(data)) {
          ridamConfigCache = data
          console.log("Cache updated:", ridamConfigCache)
        } else {
          ridamConfigCache = []
        }
      })
      .catch(err => {
        console.error("API failed:", err)
        ridamConfigCache = []
      })
  }

  return loadPromise
}

// MAIN FUNCTION (NOW ASYNC — BUT SAFE)
export const getLayers = async (map, theme, date, layerId) => {

  // -------------------------------
  // WAIT ONLY FIRST TIME
  // -------------------------------
  if (!ridamConfigCache.length) {
    await loadRidamConfig(layerId)
  }

  console.log("Using cache:", ridamConfigCache)

  // -------------------------------
  // LADAKH
  // -------------------------------
  const ladakh = createLadakhLayer()

  if (ladakh?.layer) {
    ladakh.layer.setZIndex(505)
  }

  // -------------------------------
  // BASE LAYERS
  // -------------------------------
  const ladakhRoadLayer = createRoadLayer(map)

  const baseLayers = [
    {
      id: "highway",
      layer: ladakhRoadLayer,
      opacity: 1,
      zIndex: 800
    }
  ]

  baseLayers.forEach(l => {
    if (!l.layer) return
    l.layer.setOpacity(l.opacity)
    l.layer.setZIndex(l.zIndex)
  })

  // -------------------------------
  // RIDAM (NOW ALWAYS FILLED)
  // -------------------------------
  const safeConfig = ridamConfigCache.filter(l => l && l.active)

  console.log("Final config used:", safeConfig)

  let ridamLayers = []

  try {
    ridamLayers = createRidamLayers(safeConfig) || []
  } catch (err) {
    console.error("createRidamLayers error:", err)
    ridamLayers = []
  }

  ridamLayers = ridamLayers.filter(l => l && typeof l === "object")

  return {
    ladakh,
    baseLayers: baseLayers.map(l => l.layer).filter(Boolean),
    ridamLayers
  }
}
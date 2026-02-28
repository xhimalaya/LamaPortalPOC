import { createWMSLayer } from "./wmsFactory.jsx"

export const nationalHighwaysLayer =
  createWMSLayer("INDIA_NHROADS", 0.9)

export const districtRoadsLayer =
  createWMSLayer("INDIA_DISTROADS", 0.7)
import { createLadakhLayer } from "./Layers/ladakh.layer.jsx"
import { nationalHighwaysLayer } from "./Layers/highways.layer.jsx"
import { glacierOutlineLayer } from "./Layers/glaciers.layer.jsx"
import { createRidamLayers } from "./Layers/ridam.layer.jsx"

export const getLayers = () => {

  const ladakh = createLadakhLayer()

  ladakh.layer.setZIndex(50)

  const baseLayers = [
    {
      id: "National Highways",
      layer: nationalHighwaysLayer,
      opacity: 0.9,
      zIndex: 15
    },
    {
      id: "Glacier Outline",
      layer: glacierOutlineLayer,
      opacity: 0.8,
      zIndex: 10
    }
  ]

  baseLayers.forEach(l => {
    l.layer.setOpacity(l.opacity)
    l.layer.setZIndex(l.zIndex)
  })

  const ridamConfig = [

    {
      id: "ridam_T3S1P1",
      type: "RIDAM",
      active: true,
      daterange: false,
      baseUrl: "https://vedas.sac.gov.in/ridam/wms",

      wmsParams: {
        SERVICE: "WMS",
        VERSION: "1.3.0",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        TRANSPARENT: "true",
        LAYERS: "T3S1P1",
        CRS: "EPSG:4326"
      },

      args: {
        merge_method: "max",
        dataset_id: "T3S2P3",
        from_time: "20250115",
        to_time: "20250120",
        indexes: 1
      },

      styleGradient: "[0:00000000:0.1:800080ff:1:00000000:10:E19D69ff:11:E19D69ff:89:E19D69ff:90:3CC8FFFF:210:3CC8FFFF];nodata:FFFFFF00",

      legendOptions: "columnHeight:400;height:100",

      opacity: 0.9,
      zIndex: 65,
      visible: true
    },

    {
    id:  "Snow Layer",
    type:  "RIDAM",
    active:  true,
    daterange: true,
    baseUrl:  "https://vedas.sac.gov.in/ridam/wms",
    serverType:  "geoserver",
    wmsParams:  {
        SERVICE:  "WMS",
        VERSION:  "1.3.0",
        REQUEST:  "GetMap",
        FORMAT:  "image/png",
        TRANSPARENT:  "true",
        name:  "RDSGrdient",
        layers:  "T0S0M0",
        PROJECTION:  "EPSG:4326",
        STYLES:  "[0:00000000:0.1:800080ff:1:800080ff:10:E19D69ff:11:E19D69ff:89:E19D69ff:90:3CC8FFFF:210:3CC8FFFF];nodata:FFFFFF00",
        LEGEND_OPTIONS:  "columnHeight:400;height:100",
        CRS:  "EPSG:4326"
          },
          args:  {
              merge_method:  "max",
              dataset_id:  "T4S1P2",
              from_time:  "20250511",
              to_time:  "20250520",
              indexes:  "1"
          },
          styleGradient:  "[0:00000000:0.1:800080ff:1:800080ff:10:E19D69ff:11:E19D69ff:89:E19D69ff:90:3CC8FFFF:210:3CC8FFFF];nodata:FFFFFF00",
          legendOptions:  "columnHeight:400;height:100",
          opacity:  0.9,
          zIndex:  5,
          visible:  true,
          transition:  0,
          crossOrigin:  null
      },
    {
      id: "glacier_lakes_2004_07",
      type: "GEOSERVER",
      active: true,
      daterange: false,
      baseUrl: "https://vedas.sac.gov.in/geoserver/vedas/wms",

      wmsParams: {
        SERVICE: "WMS",
        VERSION: "1.1.1",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        TRANSPARENT: "true",
        LAYERS: "vedas:INDIA_50KGLACIERLAKES2004_07",
        SRS: "EPSG:4326"
      },

      opacity: 0.8,
      zIndex: 20,
      visible: true
    },

    {
      id: "geoserver_lama_basin",
      type: "GEOSERVER",
      active: true,
      daterange: false,
      baseUrl: "https://vedas.sac.gov.in/lama_wms/wms",

      wmsParams: {
        SERVICE: "WMS",
        VERSION: "1.1.1",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        TRANSPARENT: "true",
        LAYERS: "lama:lama_basin",
        SRS: "EPSG:4326"
      },
      opacity: 0.9,
      zIndex: 55,
      visible: true
    }
  ]
  const ridamLayers = createRidamLayers(
    ridamConfig.filter(l => l.active)
  )
  return {
    ladakh,
    baseLayers: baseLayers.map(l => l.layer),
    ridamLayers
  }
}
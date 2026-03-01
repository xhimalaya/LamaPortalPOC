import { createLadakhLayer } from "./Layers/ladakh.layer.jsx"
import { nationalHighwaysLayer } from "./Layers/highways.layer.jsx"
import { glacierOutlineLayer } from "./Layers/glaciers.layer.jsx"
import { createRidamLayers } from "./Layers/ridam.layer.jsx"

export const getLayers = () => {

  const ladakh = createLadakhLayer()
  ladakh.layer.setZIndex(50)

  nationalHighwaysLayer.setZIndex(15)
  nationalHighwaysLayer.setOpacity(0.9)

  glacierOutlineLayer.setZIndex(10)
  glacierOutlineLayer.setOpacity(0.8)

  const ridamConfig = [
    {
      id: "ridam_T3S1P1",
      type: "RIDAM",
      active: true,

      baseUrl: "https://vedas.sac.gov.in/ridam/wms",
      serverType: "geoserver",

      wmsParams: {
        SERVICE: "WMS",
        VERSION: "1.3.0",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        TRANSPARENT: true,
        name: "RDSGrdient",
        layers: "T3S1P1",
        CRS: "EPSG:4326",
        PROJECTION: "EPSG:4326"
      },

      args: {
        merge_method: "max",
        dataset_id: "T3S2P3",
        from_time: "20250115",
        to_time: "20250120",
        indexes: 1
      },

      styleGradient: `[0:00000000:
        0.1:800080ff:
        1:00000000:
        10:E19D69ff:
        11:E19D69ff:
        89:E19D69ff:
        90:3CC8FFFF:
        210:3CC8FFFF];
        nodata:FFFFFF00`
        .replace(/\s+/g, ""),

      legendOptions: "columnHeight:400;height:100",

      opacity: 0.9,
      zIndex: 5,
      visible: true,
      transition: 0,
      crossOrigin: null
    },
    {
      id: "glacier_lakes_2004_07",
      type: "GEOSERVER",
      active: true,

      baseUrl: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      serverType: "geoserver",
      wmsParams: {
            SERVICE: "WMS",
            VERSION: "1.1.1",
            REQUEST: "GetMap",
            FORMAT: "image/png",
            TRANSPARENT: true,
            LAYERS: "vedas:INDIA_50KGLACIERLAKES2004_07",
            SRS: "EPSG:4326",
            STYLES: "",                 // default server style
            FORMAT_OPTIONS: "dpi:180"
          },
          args: null,
          styleGradient: null,
          legendOptions: null,
          opacity: 0.8,
          zIndex: 20,
          visible: true,
          transition: 0,
          crossOrigin: null
        },
      {
      id: "ridam_T0S0M0",
      type: "RIDAM",
      active: true,
      baseUrl: "https://vedas.sac.gov.in/ridam/wms",
      serverType: "geoserver",
      wmsParams: {
        SERVICE: "WMS",
        VERSION: "1.3.0",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        TRANSPARENT: "true",
        name: "RDSGrdient",
        layers: "T0S0M0",
        PROJECTION: "EPSG:4326",
        STYLES: "[0:00000000:0.1:800080ff:1:800080ff:10:E19D69ff:11:E19D69ff:89:E19D69ff:90:3CC8FFFF:210:3CC8FFFF];nodata:FFFFFF00",
        LEGEND_OPTIONS: "columnHeight:400;height:100",
        CRS: "EPSG:4326"
      },
      args: {
        merge_method: "max",
        dataset_id: "T4S1P2",
        from_time: "20250111",
        to_time: "20250120",
        indexes: "1"
      },
      styleGradient: "[0:00000000:0.1:800080ff:1:800080ff:10:E19D69ff:11:E19D69ff:89:E19D69ff:90:3CC8FFFF:210:3CC8FFFF];nodata:FFFFFF00",
      legendOptions: "columnHeight:400;height:100",
      opacity: 0.9,
      zIndex: 5,
      visible: true,
      transition: 0,
      crossOrigin: null
    },
    {
          id: "geoserver_vedas_INDIA_50KGLACIERSUBBASIN2004_07",
          type: "GEOSERVER",
          active: true,
          baseUrl: "https://vedas.sac.gov.in/geoserver/vedas/wms",
          serverType: "geoserver",
          wmsParams: {
              SERVICE: "WMS",
              VERSION: "1.1.1",
              REQUEST: "GetMap",
              FORMAT:  "image/png",
              TRANSPARENT: "true",
              LAYERS: "vedas:INDIA_50KGLACIERSUBBASIN2004_07",
              SRS: "EPSG:4326",
              FORMAT_OPTIONS: "dpi:180"
            },
          args: null,
          styleGradient: null,
          legendOptions: null,
          opacity: 0.9,
          zIndex: 5,
          visible: true,
          transition: 0,
          crossOrigin: null
      },
  ]

  const ridamLayers = createRidamLayers(ridamConfig)

  return {
    ladakh,
    nationalHighwaysLayer,
    glacierOutlineLayer,
    ridamLayers
  }
}
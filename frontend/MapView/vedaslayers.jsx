import { createLadakhLayer } from "./Layers/ladakh.layer.jsx"
import { createRidamLayers } from "./Layers/ridam.layer.jsx"
import { createRoadLayer } from "./Layers/ladakh.road.layer.jsx"
import { createMapMyIndiaLayer } from "./Layers/place.layer.jsx"

export const getLayers = (map) => {

  const ladakh = createLadakhLayer()
  ladakh.layer.setZIndex(505)

  const ladakhRoadLayer = createRoadLayer(map)
  const mapmyindiaLayer = createMapMyIndiaLayer()

  const baseLayers = [
    {
      id: "highway",
      layer: ladakhRoadLayer,
      opacity: 1,
      zIndex: 800
    },
    // {
    //   id: "MapMyIndia Hybrid",
    //   layer: mapmyindiaLayer,
    //   opacity: 1,
    //   zIndex: 100
    // }
  ]

  baseLayers.forEach(l => {
    l.layer.setOpacity(l.opacity)
    l.layer.setZIndex(l.zIndex)
  })

  const ridamConfig = [

    {
      id: "vedas:INDIA_50KGLACIEROUTLINE2004_07",
      type: "WMS",
      active: true,
      daterange: false,
      baseUrl: "https://vedas.sac.gov.in/geoserver/vedas/wms",
      serverType: "geoserver",
      wmsParams: {
        SERVICE: "WMS",
        VERSION: "1.1.1",
        REQUEST: "GetMap",
        FORMAT: "image/png",
        TRANSPARENT: "true",
        layers: "vedas:INDIA_50KGLACIEROUTLINE2004_07",
        STYLES: null,
        CRS: "EPSG:4326",
        WIDTH: "646",
        HEIGHT: "1235",
        BBOX: "76.75103592611661,34.5857323318241,77.14106699953761,35.33137997218777"
      },
      opacity: 0.9,
      zIndex: 50,
      visible: true,
      transition: 0
    },

    {
      id: "Snow Layer",
      type: "RIDAM",
      active: true,
      daterange: true,
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
        from_time: "20250511",
        to_time: "20250520",
        indexes: "1"
      },
      styleGradient: "[0:00000000:0.1:800080ff:1:800080ff:10:E19D69ff:11:E19D69ff:89:E19D69ff:90:3CC8FFFF:210:3CC8FFFF];nodata:FFFFFF00",
      legendOptions: "columnHeight:400;height:100",
      opacity: 0.9,
      zIndex: 1,
      visible: true,
      transition: 0,
      crossOrigin: null
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
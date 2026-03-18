export const fetchLayerConfig = async (layerIds = []) => {
  try {
    console.log("fetchLayerConfig called with:", layerIds)

    if (!Array.isArray(layerIds) || layerIds.length === 0) {
      console.warn("No layer IDs provided")
      return []
    }

    const ids = layerIds.join(",")
    const url = `http://127.0.0.1:8001/mapconfig/layers?ids=${ids}`

    console.log("API URL:", url)

    const res = await fetch(url)

    console.log("Response status:", res.status)

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`)
    }

    console.log("Waiting for JSON...")

    const data = await res.json()

    console.log("Raw API response:", data)

    if (!Array.isArray(data)) {
      console.error("API did not return array:", data)
      return []
    }

    const transformed = data.map((item, index) => {
      const style = item.layer_style || {}

      console.log(`Transforming layer ${index}:`, style)

      return {
        id: style.id || item.layer_name,
        type: style.type || "GEOSERVER",
        active: style.active ?? true,
        daterange: style.type === "RIDAM",
        baseUrl: style.baseUrl,
        serverType: style.serverType || "geoserver",
        wmsParams: style.wmsParams || {},
        args: style.args || null,
        opacity: style.opacity ?? 1,
        zIndex: style.zIndex ?? 1,
        visible: style.visible ?? true,
        transition: style.transition ?? 0,
        crossOrigin: style.crossOrigin || "anonymous",
        legendOptions: style.legendOptions || null,
        styleGradient: style.styleGradient || null
      }
    })

    console.log("Final transformed config:", transformed)

    return transformed

  } catch (err) {
    console.error("Layer API Error:", err)
    return []
  }
}
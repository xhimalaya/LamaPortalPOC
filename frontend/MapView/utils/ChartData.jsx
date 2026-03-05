export async function fetchRidamInfo(lat, lon) {

  // Read selected date range from toggleLayer
  const range = window.__RIDAM_DATE_RANGE__ || {}

  const payload = {
    layer: "T0S0I0",
    args: {
      dataset_id: "T4S1P2",
      filter_nodata: "no",
      lon: lon,
      lat: lat,
      indexes: [1],

      // Use selected range if available
      from_time: "19700101",
      to_time: range.to || "20300615",

      composite: true,
      composite_operation: "max",

      composite_timestamp_profile: {
        profile_type: "date_range",
        date_range: [
          [1,10,6],
          [11,20,16],
          [21,31,26]
        ]
      }
    }
  }
  console.log(range.from, range.to)
  try {

    const response = await fetch("/ridam/info/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      console.error("RIDAM API request failed:", response.status)
      return []
    }

    const json = await response.json()

    if (!json || !json.result) {
      return []
    }

    return json.result.map(([timestamp, value]) => {

      const date = new Date(timestamp)

      return {
        date,
        month: date.getMonth(),
        day: date.getDate(),
        value: value?.[0] ?? 0
      }

    })

  } catch (error) {

    console.error("RIDAM API Error:", error)
    return []

  }

}
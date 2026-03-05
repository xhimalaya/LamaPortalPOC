<script setup>
import { watch, ref, nextTick } from "vue"
import * as echarts from "echarts"
import { fetchRidamInfo } from "./ChartData.jsx"
import "./css/chart.css"

const props = defineProps({
  visible: Boolean,
  lat: Number,
  lon: Number
})

const emit = defineEmits(["close"])

const loading = ref(false)
const chartContainer = ref(null)

let chart = null

function closeModal() {
  emit("close")
}


function buildMatrix(data) {

  if (!data || data.length === 0) {
    return { matrix: [], years: [], periods: [] }
  }

  const years = [...new Set(data.map(d => d.date.getFullYear()))].sort()

  const periods = [
    "06-Jan","16-Jan","26-Jan",
    "06-Feb","16-Feb","26-Feb",
    "06-Mar","16-Mar","26-Mar",
    "06-Apr","16-Apr","26-Apr",
    "06-May","16-May","26-May",
    "06-Jun","16-Jun","26-Jun",
    "06-Jul","16-Jul","26-Jul",
    "06-Aug","16-Aug","26-Aug",
    "06-Sep","16-Sep","26-Sep",
    "06-Oct","16-Oct","26-Oct",
    "06-Nov","16-Nov","26-Nov",
    "06-Dec","16-Dec","26-Dec"
  ]

  const matrix = []

  data.forEach(d => {

    const year = d.date.getFullYear()
    const month = d.date.toLocaleString("en", { month: "short" })
    const day = String(d.day).padStart(2, "0")

    const label = `${day}-${month}`

    const x = periods.indexOf(label)
    const y = years.indexOf(year)

    if (x !== -1 && y !== -1) {

      let val = 0

      if (d.value === 0) val = 1
      else if (d.value > 0) val = 2

      matrix.push([x, y, val])
    }

  })

  return { matrix, years, periods }
}


function renderChart(series) {

  if (!chart) {
    chart = echarts.init(chartContainer.value)
  }

  chart.clear()

  const option = {

    tooltip: {
      formatter: (p) => {

        const val = p.value[2]

        let text = "No Data"
        if (val === 1) text = "No Snow"
        if (val === 2) text = "Snow"

        return `
        ${series.periods[p.value[0]]}<br>
        ${series.years[p.value[1]]}<br>
        ${text}
        `
      }
    },

    grid: {
      top: 20,
      left: 60,
      right: 20,
      bottom: 20
    },

    xAxis: {
      type: "category",
      data: series.periods,
      splitArea: { show: true },
      axisLabel: {
        rotate: 45,
        fontSize: 10
      }
    },

    yAxis: {
      type: "category",
      data: series.years,
      splitArea: { show: true }
    },

    visualMap: {
      show: false,
      min: 0,
      max: 2,
      inRange: {
        color: [
          "#ddd",      
          "#FFA500",   
          "#3CC8FF"    
        ]
      }
    },

    series: [
      {
        type: "heatmap",
        data: series.matrix,
        itemStyle: {
          borderColor: "#ddd",
          borderWidth: 1
        }
      }
    ]

  }

  chart.setOption(option)
}

watch(
  () => [props.lat, props.lon],
  async ([lat, lon]) => {
    if (!lat || !lon) return
    loading.value = true
    const data = await fetchRidamInfo(lat, lon)
    const series = buildMatrix(data)
    await nextTick()
    renderChart(series)
    loading.value = false
  }
)
</script>

<template>
  <div v-if="visible" class="chart-modal">
    <div class="chart-header">
      <div class="flex-container">

        <button class="item-1" @click="closeModal">
          <span class="inner">
          <span class="label">Close</span>
          </span>
        </button>

      </div>
    </div>
    <div class="chart-content">

        <div style="display:flex;align-items:center;margin-bottom:8px;font-family:Arial;font-size:14px">

            <div style="display:flex;align-items:center;margin-right:15px">
                <div style="width:24px;height:24px;background:#ddd;border:1px solid #ccc;margin-right:6px"></div>
                No Data
            </div>

            <div style="display:flex;align-items:center;margin-right:15px">
                <div style="width:24px;height:24px;background:#FFA500;border:1px solid #ccc;margin-right:6px"></div>
                No Snow
            </div>

            <div style="display:flex;align-items:center">
                <div style="width:24px;height:24px;background:#3CC8FF;border:1px solid #ccc;margin-right:6px"></div>
                Snow
            </div>
        </div>
        <div style="position:relative;width:100%;height:320px">
        <div ref="chartContainer" style="width:100%;height:100%"></div>
          <div v-if="loading" class="loading-overlay">
            <div class="loading-container">
              <div class="boxes">

                  <div class="box"><div></div><div></div><div></div><div></div></div>
                  <div class="box"><div></div><div></div><div></div><div></div></div>
                  <div class="box"><div></div><div></div><div></div><div></div></div>
                  <div class="box"><div></div><div></div><div></div><div></div></div>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>

</template>

<style scoped>
  .loading-overlay{
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background:rgba(255,255,255,0.9);
    display:flex;
    justify-content:center;
    align-items:center;
    z-index:10;
  }
</style>
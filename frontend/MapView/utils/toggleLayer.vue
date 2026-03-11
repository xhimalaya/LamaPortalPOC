<script setup>
import { ref, onMounted } from "vue"

const props = defineProps({
  layerStates: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(["dateChanged"])

const shown = ref(false)

function togglePanel() {
  shown.value = !shown.value
}

function toggleLayer(layerObj) {
  layerObj.visible = !layerObj.visible
  layerObj.layer.setVisible(layerObj.visible)
}

/* -----------------------
   DATE HELPERS
----------------------- */

function yesterdayDateObj() {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return d
}

function yesterday() {
  return yesterdayDateObj().toISOString().slice(0,10)
}

function formatRIDAM(date){
  return date.toISOString().slice(0,10).replaceAll("-","")
}

/* -----------------------
   DEFAULT DATE
----------------------- */

function nearestDivisibleDate(){

  const y = yesterdayDateObj()

  const day = y.getDate()

  const divisible = Math.floor(day/5)*5

  y.setDate(divisible)

  return y
}

/* -----------------------
   VALIDATE DATE
----------------------- */

function validateDate(e){

  const d = new Date(e.target.value)
  const day = d.getDate()

  // if(day % 5 !== 0){
  //   alert("Please select date divisible by 5 (5,10,15...)")
  //   e.target.value=""
  //   return false
  // }

  return true
}

/* -----------------------
   COMPOSITE WINDOW
----------------------- */

function updateComposite(layerObj){

  if(!layerObj.centerDate || !layerObj.compositeDays) return

  const center=new Date(layerObj.centerDate)

  const window = layerObj.compositeDays / 2

  const start=new Date(center)
  const end=new Date(center)

  start.setDate(center.getDate() - window)
  end.setDate(center.getDate() + window)

  layerObj.startDate=start
  layerObj.endDate=end

  updateWMS(layerObj)
}

/* -----------------------
   WMS UPDATE
----------------------- */

function updateWMS(layerObj){

  const source = layerObj.layer?.getSource()
  if(!source) return

  const params = source.getParams()

  let args=params.ARGS||""
  const argObj={}

  args.split(";").forEach(p=>{
    const [k,v]=p.split(":")
    if(k) argObj[k]=v
  })

  argObj.from_time = formatRIDAM(layerObj.startDate)
  argObj.to_time = formatRIDAM(layerObj.endDate)

  const newArgs = Object.entries(argObj)
    .map(([k,v])=>`${k}:${v}`)
    .join(";")

  source.updateParams({
    ARGS:newArgs,
    _refresh:Date.now()
  })

  /* -----------------------
     GLOBAL DATE FOR CHART
  ----------------------- */

  window.__RIDAM_DATE_RANGE__ = {
    from: argObj.from_time,
    to: argObj.to_time
  }

  emit("dateChanged",{
    layerId:layerObj.id,
    from:argObj.from_time,
    to:argObj.to_time
  })
}

/* -----------------------
   INITIALIZE DEFAULTS
----------------------- */

onMounted(()=>{

  const defaultCenter = nearestDivisibleDate()

  props.layerStates.forEach(layer=>{

    if(!layer.daterange) return

    layer.compositeDays = 5
    layer.centerDate = defaultCenter.toISOString().slice(0,10)

    updateComposite(layer)

  })

})
const showLayers = ref(false)
const showDate = ref(false)
</script>


<template>

<div class="layer-controller">
  <!-- Layers button - top-right -->
  <button class="toggle-btn layers-btn" @click="showLayers = !showLayers">
    Layers
  </button>

  <!-- Date button - bottom-left -->
  <button class="toggle-btn date-btn" @click="showDate = !showDate">
    Menu
  </button>

  <!-- Layers Panel (opens near top-right button) -->
  <div v-if="showLayers" class="panel layers-panel">
    <div
      v-for="layerObj in layerStates"
      :key="layerObj.id"
      class="layer-card"
    >
      <div class="layer-row">
        <input
          type="checkbox"
          :checked="layerObj.visible"
          @change="toggleLayer(layerObj)"
        />
        <span class="layer-name">{{ layerObj.id }}</span>
      </div>
    </div>
  </div>

  <!-- Date Panel (opens near bottom-left button) -->
  <div v-if="showDate" class="panel date-panel">
    <div
      v-for="layerObj in layerStates"
      :key="layerObj.id"
      class="layer-card"
    >
      <div v-if="layerObj.daterange" class="date-controls">
        <select
          v-model="layerObj.compositeDays"
          @change="updateComposite(layerObj)"
        >
          <option :value="5">5 days</option>
          <option :value="10">10 days</option>
          <option :value="15">15 days</option>
          <option :value="20">20 days</option>
        </select>

        <input
          type="date"
          :max="yesterday()"
          v-model="layerObj.centerDate"
          @change="validateDate($event) && updateComposite(layerObj)"
        />
      </div>
    </div>
  </div>
</div>

</template>


<style scoped>
.layer-controller {
  position: absolute;
  inset: 0;
  pointer-events: none; /* allows map clicks through empty areas */
  z-index: 10000;
  font-family: system-ui;
}

/* Layers button - top-right */
.layers-btn {
  position: absolute;
  top: 110px;                    /* below header - adjust if needed */
  right: 20px;
  background: #0f4c81;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  font-size: 14px;
  font-weight: 500;
  pointer-events: auto;          /* make button clickable */
  z-index: 10001;
}

.layers-btn:hover {
  background: #08345a;
}

/* Date button - bottom-left */
.date-btn {
  position: absolute;
  bottom: 50%;                  /* from bottom of screen - adjust if needed */
  left: 20px;
  background: #2e7d32;           /* green for date */
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  font-size: 14px;
  font-weight: 500;
  pointer-events: auto;
  z-index: 10001;
}

.date-btn:hover {
  background: #1b5e20;
}

/* Panels */
.panel {
  position: absolute;
  width: 280px;
  background: white;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: 0 6px 18px rgba(0,0,0,0.2);
  padding: 12px;
  pointer-events: auto;
}

/* Layers panel - opens near top-right button */
.layers-panel {
  top: 150px;                    /* below Layers button */
  right: 20px;
}

/* Date panel - opens near bottom-left button */
.date-panel {
  bottom: 22rem;                  /* above Date button */
  left: 20px;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .layers-btn {
    top: 9rem;                  /* closer to header on mobile */
    right: 16px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .date-btn {
    /* bottom: 20px; */
    left: 16px;
    padding: 8px 12px;
    font-size: 13px;
  }

  .layers-panel,
  .date-panel {
    width: 90%;
    max-width: 320px;
    left: 5%;
    right: 5%;
    
  }

  .layers-panel {
    top: 9rem;
  }

  .date-panel {
    bottom: 22rem;
  }
}
</style>
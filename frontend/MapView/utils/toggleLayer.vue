<script setup>
import { ref, onMounted, computed } from "vue"

const props = defineProps({
  layerStates: Array
})

const emit = defineEmits(["dateChanged"])

const showLayers = ref(false)
const showDate = ref(false)

/* -----------------------
   SAFE FILTER
----------------------- */
const dateLayers = computed(() =>
  props.layerStates.filter(l => l && l.daterange)
)

/* -----------------------
   URL DATE
----------------------- */
function getDateFromURL() {
  return new URLSearchParams(window.location.search).get("date")
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
   COMPOSITE
----------------------- */
function updateComposite(layerObj){
  if(!layerObj?.centerDate || !layerObj?.compositeDays) return

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

  emit("dateChanged",{
    layerId:layerObj.id,
    from:argObj.from_time,
    to:argObj.to_time
  })
}

/* -----------------------
   INIT
----------------------- */
onMounted(()=>{

  const urlDate = getDateFromURL()
  const defaultDate = urlDate || yesterday()

  props.layerStates.forEach(layer=>{
    if(!layer || !layer.daterange) return

    layer.compositeDays = 5
    layer.centerDate = defaultDate

    updateComposite(layer)
  })

  /* AUTO CLOSE */
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".panel") && !e.target.closest(".toggle-btn")) {
      showLayers.value = false
      showDate.value = false
    }
  })

})
</script>

<template>
<div class="layer-controller">

  <!-- BUTTONS -->
  <button class="toggle-btn layers-btn" @click="showLayers = !showLayers">
       Layers
  </button>

  <button class="toggle-btn date-btn" @click="showDate = !showDate">
    Menu
  </button>

  <!-- LAYERS PANEL -->
  <div v-if="showLayers" class="panel layers-panel">
    <div class="panel-header">
      Layers
      <button class="close-btn" @click="showLayers=false">✕</button>
    </div>

    <div v-for="l in layerStates" :key="l?.id" class="layer-card">
      <label>
        <input type="checkbox"
          :checked="l?.visible"
          @change="l.visible=!l.visible; l.layer?.setVisible(l.visible)"
        />
        {{ l?.id }}
      </label>
    </div>
  </div>

  <!-- DATE PANEL -->
  <div v-if="showDate" class="panel date-panel">

    <div class="panel-header">
      Time Control
      <button class="close-btn" @click="showDate=false">✕</button>
    </div>

    <!-- 🔥 PER LAYER -->
    <div
      v-for="layerObj in dateLayers"
      :key="layerObj.id"
      class="layer-card"
    >

      <!-- LAYER NAME -->
      <div class="layer-title">{{ layerObj.id }}</div>

      <!-- RANGE -->
      <select
        v-model="layerObj.compositeDays"
        @change="updateComposite(layerObj)"
      >
        <option :value="5">5 days</option>
        <option :value="10">10 days</option>
        <option :value="15">15 days</option>
        <option :value="20">20 days</option>
      </select>

      <!-- DATE -->
      <input
        type="date"
        :max="yesterday()"
        v-model="layerObj.centerDate"
        @change="updateComposite(layerObj)"
      />

      <!-- PREVIEW -->
      <div class="preview">
        {{ layerObj.compositeDays }} days around {{ layerObj.centerDate }}
      </div>

    </div>

  </div>

</div>
</template>

<style scoped>

/* BUTTONS */
.toggle-btn {
  min-width:90px;
  height:48px;
  border-radius:24px;
  padding:0 16px;
  position:absolute;
  color:white;
  border:none;
  font-size:16px;
  font-weight:600;
  z-index:10002;
  display:flex;
  align-items:center;
  justify-content:center;
}
.layers-btn { top:100px; right:10px; background:#1e88e5; }
.date-btn { bottom:60%; left:10px; background:#43a047; }

/* PANEL */
.panel {
  position:absolute;
  width:90%;
  max-width:340px;
  background:white;
  border-radius:14px;
  padding:12px;
  box-shadow:0 8px 20px rgba(0,0,0,0.2);
}

.layers-panel { top:170px; right:10px; }
.date-panel { bottom:180px; left:4%; }

/* HEADER */
.panel-header {
  display:flex;
  justify-content:space-between;
  margin-bottom:10px;
  font-weight:600;
}

.close-btn {
  background:red;
  color:white;
  border:none;
  width:28px;height:28px;
  border-radius:50%;
}

/* CARD */
.layer-card {
  padding:10px;
  background:#f3f4f6;
  border-radius:10px;
  margin-bottom:10px;
}

.layer-title {
  font-weight:600;
  margin-bottom:6px;
}

.preview {
  font-size:12px;
  margin-top:4px;
}

/* MOBILE */
@media(max-width:768px){
  .panel{width:95%}
}

</style>
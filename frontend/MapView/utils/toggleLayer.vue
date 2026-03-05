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

  if(day % 5 !== 0){
    alert("Please select date divisible by 5 (5,10,15...)")
    e.target.value=""
    return false
  }

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
</script>


<template>

<div class="layer-controller">

<button class="toggle-btn" @click="togglePanel">
Layers
</button>

<div v-if="shown" class="panel">

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
>

<span class="layer-name">
{{layerObj.id}}
</span>

</div>


<div v-if="layerObj.daterange" class="date-panel">

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
>

</div>

</div>

</div>

</div>

</template>


<style scoped>

.layer-controller{
position:absolute;
top:110px;
right:20px;
z-index:10000;
font-family:system-ui;
}

.toggle-btn{
background:#0f4c81;
color:white;
border:none;
padding:10px 14px;
border-radius:6px;
cursor:pointer;
box-shadow:0 2px 6px rgba(0,0,0,0.2);
}

.toggle-btn:hover{
background:#08345a;
}

.panel{
margin-top:8px;
width:260px;
background:white;
border-radius:8px;
border:1px solid #ddd;
box-shadow:0 6px 18px rgba(0,0,0,0.15);
}

.layer-card{
padding:10px;
border-bottom:1px solid #eee;
}

.layer-row{
display:flex;
gap:10px;
align-items:center;
}

.layer-name{
font-size:13px;
font-weight:500;
}

.date-panel{
margin-top:8px;
display:flex;
gap:8px;
}

select,input{
font-size:12px;
padding:4px;
border:1px solid #ccc;
border-radius:4px;
}

</style>
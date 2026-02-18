<template>
  <div
    class="relative left-1/2 -translate-x-1/2 w-screen min-h-screen bg-black overflow-x-hidden"
  >

    <!-- ================= LAYER 1 : BASE BACKGROUND ================= -->
    <div class="absolute inset-0 z-0 bg-gradient-to-r from-black via-[#0f1115] to-black"></div>


    <!-- ================= LAYER 2 : LEFT RINGS ================= -->
    <div
      v-for="(ring, index) in leftRings"
      :key="'left-' + index"
      class="absolute z-10"
      :style="{
        top: ring.centerY,
        left: '0',
        transform: 'translate(-50%, -50%)'
      }"
    >
      <img
        :src="ring.src"
        class="pointer-events-none select-none"
        :style="{
          width: ring.width,
          maxWidth: ring.maxWidth,
          height: ring.height,
          animation: `spin ${ring.speed}s linear infinite`,
          animationDirection: ring.clockwise ? 'normal' : 'reverse'
        }"
      />
    </div>


    <!-- ================= LAYER 3 : RIGHT RING ================= -->
    <div
      class="absolute z-10"
      :style="{
        top: rightRing.centerY,
        right: '0',
        transform: 'translate(50%, -50%)'
      }"
    >
      <img
        :src="rightRing.src"
        class="pointer-events-none select-none"
        :style="{
          width: rightRing.width,
          maxWidth: rightRing.maxWidth,
          height: rightRing.height,
          animation: `spin ${rightRing.speed}s linear infinite`,
          animationDirection: rightRing.clockwise ? 'normal' : 'reverse'
        }"
      />
    </div>


    <!-- ================= LAYER 4 : CENTER CONTENT ================= -->
    <div class="absolute inset-0 flex flex-col items-center justify-center z-20">

      <!-- Title aligned relative to emblem center axis -->
      <div>
        <LamaTitle />
      </div>
      <div>
        <GlassCard />
      </div>
      <!-- Emblem -->
      <img
          src="/national_emblem2.png"
          class="absolute left-1/2 -translate-x-1/2 object-contain z-20"
          :style="emblemStyle"
      />
    </div>

  </div>
</template>

<script setup>
import { computed } from 'vue'
import LamaTitle from './LamaTitle.jsx'
import GlassCard from './GlassCard.jsx'

/* ================= LEFT RINGS CONFIG ================= */

const leftRings = [
  {
    src: '/pwa_rings/LeftSide/r1.png',
    speed: 40,
    clockwise: true,
    width: '70vw',
    maxWidth: '1200px',
    height: 'auto',
    centerY: '50%'
  }
]

/* ================= RIGHT RING CONFIG ================= */

const rightRing = {
  src: '/pwa_rings/RightSide/ring1.png',
  speed: 30,
  clockwise: true,
  width: '90vw',
  maxWidth: '1000px',
  height: 'auto',
  centerY: '50%'
}

/* ================= EMBLEM CONFIG ================= */
const emblemWidth = '23vw'
const emblemMaxWidth = '500px'
const emblemMinWidth = '150px'
const emblemY = '50%'
const emblemOffsetY = '5vw'

/* ================= EMBLEM STYLE ================= */
const emblemStyle = computed(() => ({
  width: emblemWidth,
  maxWidth: emblemMaxWidth,
  minWidth: emblemMinWidth,
  height: 'auto',
  top: emblemY,
  transform: `translate(-50%, -50%) translateY(${emblemOffsetY})`
}))
</script>

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>

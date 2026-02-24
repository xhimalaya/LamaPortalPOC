<script setup>
      import { motion } from "motion-v"
      import { computed } from "vue"
      import LamaTitle from './LamaTitle.jsx'
      import GlassCard from './GlassCard.jsx'

      /* Generate random particles consistent across renders */
      const particles = computed(() => {
        return Array.from({ length: 150 }).map((_, i) => ({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 0.5,
          color: i % 2 === 0 ? "bg-gold" : "bg-teal",
          delay: Math.random() * 10,
          duration: Math.random() * 20 + 10,
          depth: Math.random() > 0.5 ? "z-0" : "z-20",
          opacity: Math.random() * 0.5 + 0.2,
        }))
      })
      /* ================= EMBLEM CONFIG ================= */
      const emblemWidth = '13vw'
      const emblemMaxWidth = '150px'
      const emblemMinWidth = '50px'

      const emblemY = '10%'
      const emblemOffsetY = '17vw'
      const emblemOffsetX = '-23vw'   

      /* ================= EMBLEM STYLE ================= */
      const emblemStyle = computed(() => ({
        width: emblemWidth,
        maxWidth: emblemMaxWidth,
        minWidth: emblemMinWidth,
        height: 'auto',
        top: emblemY,
        left: '50%',   // make sure left exists if centering
        transform: `
          translate(-50%, -50%)
          translateX(${emblemOffsetX})
          translateY(${emblemOffsetY})
        `
      }))


      const uolWidth = '20vw'
      const uolMaxWidth = '150px'
      const uolMinWidth = '50px'

      const uolY = '10%'
      const uolOffsetY = '13vw'
      const uolOffsetX = '41vw' 

      const uolStyle = computed(() => ({
        width: uolWidth,
        maxWidth: uolMaxWidth,
        minWidth: uolMinWidth,
        height: 'auto',
        top: uolY,
        left: '50%',   // make sure left exists if centering
        transform: `
          translate(-50%, -50%)
          translateX(${uolOffsetX})
          translateY(${uolOffsetY})
        `
      }))
</script>

<template>
  <div class="relative min-h-screen w-full bg-[#0B0B0F] overflow-hidden flex items-center justify-center font-sans">

    <!-- Radial Center Glow -->
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] md:w-[60vw] md:h-[60vw] opacity-30 blur-[120px] rounded-full mix-blend-screen pointer-events-none">
      <div class="absolute inset-0 bg-gradient-to-r from-gold/40 via-transparent to-teal/40 animate-pulse-slow"></div>
    </div>

    <!-- Floating Particles -->
    <div class="absolute inset-0 pointer-events-none">
      <motion.div
        v-for="p in particles"
        :key="p.id"
        :class="`absolute rounded-full ${p.color} ${p.depth} blur-[1px]`"
        :style="{
          width: p.size + 'px',
          height: p.size + 'px',
          left: p.x + '%',
          top: p.y + '%',
          opacity: p.opacity,
        }"
        :animate="{
          y: [0, -150, 0],
          opacity: [0, p.opacity, 0],
        }"
        :transition="{
          duration: p.duration,
          repeat: Infinity,
          delay: p.delay,
          ease: 'linear',
        }"
      />
    </div>

    <!-- LEFT SIDE: Gold Organic Vines -->
    <div class="absolute left-0 top-0 w-[50%] md:w-[35%] h-full pointer-events-none opacity-70 mix-blend-screen z-0">
      <svg class="w-full h-full" preserveAspectRatio="xMinYMid slice" viewBox="0 0 50 100">
        <defs>
          <filter id="gold-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D4AF37" />
            <stop offset="50%" stop-color="#B8860B" />
            <stop offset="100%" stop-color="#F5D06F" />
          </linearGradient>
        </defs>

        <motion.path
          d="M-5,110 C20,80 30,50 5,20 C-15,-10 35,-20 25,-30"
          fill="none"
          stroke="url(#gold-gradient)"
          stroke-width="0.5"
          filter="url(#gold-glow)"
          :initial="{ pathLength: 0, opacity: 0 }"
          :animate="{ pathLength: 1, opacity: 1 }"
          :transition="{ duration: 3.5, ease: 'easeInOut' }"
        />

        <motion.path
          d="M-15,80 C15,70 20,30 0,0 C-20,-30 25,-10 15,-40"
          fill="none"
          stroke="url(#gold-gradient)"
          stroke-width="0.2"
          filter="url(#gold-glow)"
          :initial="{ pathLength: 0, opacity: 0 }"
          :animate="{ pathLength: 1, opacity: 0.8 }"
          :transition="{ duration: 4.5, ease: 'easeInOut', delay: 0.5 }"
        />

        <motion.path
          d="M5,120 C35,90 15,40 25,10 C40,-20 0,-30 15,-50"
          fill="none"
          stroke="url(#gold-gradient)"
          stroke-width="0.3"
          filter="url(#gold-glow)"
          :initial="{ pathLength: 0, opacity: 0 }"
          :animate="{ pathLength: 1, opacity: 0.6 }"
          :transition="{ duration: 4, ease: 'easeInOut', delay: 1 }"
        />

        <motion.circle cx="12" cy="25" r="0.8" fill="#F5D06F" filter="url(#gold-glow)"
          :initial="{ scale: 0 }"
          :animate="{ scale: [0, 1.2, 1] }"
          :transition="{ duration: 2, delay: 2.5 }" />

        <motion.circle cx="16" cy="72" r="1.1" fill="#D4AF37" filter="url(#gold-glow)"
          :initial="{ scale: 0 }"
          :animate="{ scale: [0, 1.3, 1] }"
          :transition="{ duration: 2, delay: 3 }" />

        <motion.circle cx="2" cy="48" r="0.6" fill="#B8860B" filter="url(#gold-glow)"
          :initial="{ scale: 0 }"
          :animate="{ scale: [0, 1.5, 1] }"
          :transition="{ duration: 2, delay: 3.5 }" />
      </svg>
    </div>

    <!-- RIGHT SIDE: Full Circuit System -->
    <div class="absolute right-0 top-0 w-[50%] md:w-[35%] h-full pointer-events-none opacity-80 mix-blend-screen z-0">
      <svg class="w-full h-full" preserveAspectRatio="xMaxYMid slice" viewBox="0 0 50 100">
        <defs>
          <filter id="teal-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <linearGradient id="teal-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#1E90FF" />
            <stop offset="100%" stop-color="#00C2B2" />
          </linearGradient>
        </defs>

        <!-- Main Circuit -->
        <motion.path
          d="M55,-10 L35,10 L35,40 L15,60 L15,90 L35,110"
          fill="none"
          stroke="url(#teal-gradient)"
          stroke-width="0.4"
          filter="url(#teal-glow)"
          :initial="{ pathLength: 0, opacity: 0 }"
          :animate="{ pathLength: 1, opacity: 1 }"
          :transition="{ duration: 2.5, ease: 'linear' }"
        />

        <!-- Main Branches -->
        <motion.path
          d="M35,25 L20,25 L10,35"
          fill="none"
          stroke="url(#teal-gradient)"
          stroke-width="0.2"
          filter="url(#teal-glow)"
          :initial="{ pathLength: 0 }"
          :animate="{ pathLength: 1 }"
          :transition="{ duration: 2, delay: 1 }"
        />

        <motion.path
          d="M15,75 L5,75 L0,85"
          fill="none"
          stroke="url(#teal-gradient)"
          stroke-width="0.2"
          filter="url(#teal-glow)"
          :initial="{ pathLength: 0 }"
          :animate="{ pathLength: 1 }"
          :transition="{ duration: 2, delay: 1.5 }"
        />

        <!-- Secondary Circuit -->
        <motion.path
          d="M55,20 L45,30 L45,70 L25,90 L25,120"
          fill="none"
          stroke="url(#teal-gradient)"
          stroke-width="0.2"
          filter="url(#teal-glow)"
          :initial="{ pathLength: 0, opacity: 0 }"
          :animate="{ pathLength: 1, opacity: 0.8 }"
          :transition="{ duration: 3, delay: 0.3 }"
        />

        <!-- Tertiary Circuit -->
        <motion.path
          d="M65,-20 L40,15 L40,55 L50,65 L50,85 L30,105 L30,120"
          fill="none"
          stroke="url(#teal-gradient)"
          stroke-width="0.3"
          filter="url(#teal-glow)"
          :initial="{ pathLength: 0, opacity: 0 }"
          :animate="{ pathLength: 1, opacity: 0.9 }"
          :transition="{ duration: 2.8, delay: 0.6 }"
        />

        <!-- Pulsing Nodes -->
        <motion.rect x="34" y="10" width="2" height="2" fill="#1E90FF"
          filter="url(#teal-glow)"
          :animate="{ opacity: [0.2, 1, 0.2] }"
          :transition="{ duration: 2, repeat: Infinity }" />

        <motion.rect x="14" y="60" width="2" height="2" fill="#00C2B2"
          filter="url(#teal-glow)"
          :animate="{ opacity: [0.2, 1, 0.2] }"
          :transition="{ duration: 3, repeat: Infinity, delay: 0.5 }" />

        <motion.rect x="44" y="70" width="1.5" height="1.5" fill="#00C2B2"
          filter="url(#teal-glow)"
          :animate="{ opacity: [0.2, 1, 0.2] }"
          :transition="{ duration: 1.5, repeat: Infinity, delay: 1 }" />

      </svg>
    </div>

    <div class="absolute inset-0 flex flex-col items-center justify-start pt-12 z-20">

  <!-- Row: Emblem + Title + UT Logo -->
    <div class="flex items-center justify-center gap-8 relative z-20">

        <img
          src="/national_emblem2.png"
          class="object-contain"
          :style="emblemStyle"
        />
        <LamaTitle />
        
        <img
          src="https://vedas.sac.gov.in/vapps/lama/assets/img/univ_ladakh.png"
          class="w-[120px] md:w-[150px] object-contain"
          :style="uolStyle"
        />

      </div>

      <!-- Glass Card stays below -->
      <div>
        <GlassCard />
      </div>

  </div>

  </div>
</template>
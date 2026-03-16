<template>
  <div class="dashboard">
    <!-- Full-screen background -->
    <img
      src="/Background01.png"
      alt="Background"
      class="bg"
    />
    <!-- Shooting stars container -->
    <div class="shooting-stars"></div>
    <div class="shooting-stars">
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
      <div class="shooting-star"></div>
    </div>
    <!-- Centered emblem + animated title -->
    <div class="title-container">
      <img
        src="/GovernmentofIndia.png"
        alt="National Emblem of India"
        class="logo"
      />

      <div class="lama-title-wrapper">
        <!-- Animated phrase container -->
        <div class="phrase animate-phrase">
          <span class="text-highlight">L</span><span class="text-highlight">A</span>dakh 
          <span class="text-normal">s</span>pecific 
          <span class="text-highlight">M</span>odelling 
          and 
          <span class="text-normal">s</span>pace 
          <span class="text-highlight">A</span>pplications
        </div>

        <!-- Dash stays static -->
        <span class="dash"> — </span>

        <!-- The extracted LAMA that appears on the right -->
        <div class="acronym animate-acronym">
          <span>L</span><span>A</span><span>M</span><span>A</span>
        </div>
      </div>
    </div>

  <div class="category-dropdown-container">
  <label for="category-select" class="category-label">Applications:</label>

  <select
    id="category-select"
    v-model="selectedCategory"
    class="category-select"
    @change="onCategoryChange"
  >
    <option value="" disabled>Choose an Application</option>

    <option
      v-for="(card, index) in cards"
      :key="card.value"
      :value="card.value"
    >
      {{ card.title }}
    </option>

  </select>
</div>
  <!-- ***********************************Crousel def************************************************* -->
      <!-- Carousel Section - Under Dropdown, Above Footer -->
    <div class="carousel-section">
      <div 
        class="carousel-wrapper"
        @mouseenter="pauseAutoSlide"
        @mouseleave="startAutoSlide"
      >
        <!-- Left Arrow -->
        <button class="nav-arrow prev" @click="prevSlide">‹</button>

        <!-- Carousel Track -->
        <div class="carousel-track" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="(card, index) in cards" :key="index" class="carousel-card">
            <img :src="card.image" :alt="card.title" class="card-image" />
            
            <div class="card-content">
              <h3 class="card-title">{{ card.title }}</h3>
              <p class="card-desc">{{ card.description }}</p>
              <button class="card-btn" @click="openMap(card)">
                Explore Now →
              </button>
            </div>
          </div>
        </div>

        <!-- Right Arrow -->
        <button class="nav-arrow next" @click="nextSlide">›</button>
      </div>

      <!-- Progress Dots -->
      <div class="dots">
        <span 
          v-for="(card, i) in cards" 
          :key="i"
          class="dot"
          :class="{ active: i === currentIndex }"
          @click="goToSlide(i)"
        ></span>
      </div>
    </div>
    <!-- **********************************Recent Updates Section *********************************************** -->
     <!-- Latest / Recent Updates Ticker -->
<div class="updates-container">
  <div class="updates-label">Recent Updates:</div>
  <div class="updates-ticker">
    <div class="ticker-wrapper">
      <!-- First set -->
      <div class="ticker-content">
        <div v-for="(update, index) in updates" :key="'a-' + index" class="ticker-item">
          {{ update.text }}
          <span class="ticker-date">{{ update.date }}</span>
        </div>
      </div>

      <!-- Duplicate set for seamless loop -->
      <div class="ticker-content">
        <div v-for="(update, index) in updates" :key="'b-' + index" class="ticker-item">
          {{ update.text }}
          <span class="ticker-date">{{ update.date }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
  <!-- ***************************************crousel end*************************************************** -->

    <!-- Footer remains the same -->
    <footer class="footer">
      <a href="https://www.isro.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/ISRO.png" alt="ISRO Logo" class="footer-logo" loading="lazy" />
      </a>
      <a href="https://www.sac.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/sac.png" alt="SAC Logo" class="footer-logo" loading="lazy" />
      </a>
      <a href="https://uol.ac.in/" target="_blank" rel="noopener noreferrer">
        <img src="/univ_ladakh.png" alt="University of Ladakh Logo" class="footer-logo" loading="lazy" />
      </a>
      <span class="footer-text">भारत सरकार | Government of India</span>
      <a href="https://ladakh.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/ut_ladakh.png" alt="Union Territory of Ladakh Logo" class="footer-logo" loading="lazy" />
      </a>
      <a href="https://vedas.sac.gov.in/en/" target="_blank" rel="noopener noreferrer">
        <img src="/vedas_logo.png" alt="VEDAS Logo" class="footer-logo" loading="lazy" />
      </a>
    </footer>
  </div>
</template>
<!-- *****************************************Script Setup********************************************** -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getCards } from "./CarasoleData.jsx"
import { useRouter } from "vue-router"

const router = useRouter()
async function loadCards() {
  try {
    const res = await fetch("http://127.0.0.1:8001/mapconfig/collections/")
    const data = await res.json()

    cards.value = data.map(item => ({
      title: item.name.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      value: item.name,
      description: item.description || "",
      image: item.image ? item.image : `/carousel/${item.name}.jpeg`,
      layers: item.layers_data || []
    }))

  } catch (err) {
    console.error("Failed loading cards:", err)
  }
}

function openMap(card) {

  if (!card) return

  const today = new Date().toISOString().split("T")[0]

  router.push({
    path: `/map/${card.value}`,
    query: {
      layers: card.layers.length ? card.layers.join(",") : "",
      date: today
    }
  })
}

const selectedCategory = ref('')

const cards = ref([])

onMounted(async () => {
  cards.value = await getCards()
})

// Latest updates data (dynamic list – you can fetch from API later)
const updates = ref([
  { text: "New 3D City Model for Leh released with high-res terrain", date: "Feb 28, 2026" },
  { text: "Agriculture dataset updated with latest NDVI satellite imagery", date: "Feb 25, 2026" },
  { text: "Desertification monitoring shows 8% improvement in affected areas", date: "Feb 20, 2026" },
  { text: "Weather Forecast model accuracy improved to 94% for next 72 hrs", date: "Feb 18, 2026" },
  { text: "Live Air Quality dashboard now includes PM2.5 real-time tracking", date: "Feb 15, 2026" },
  { text: "Snow & Glacier retreat analysis 2025–2026 published", date: "Feb 10, 2026" },
  // Add as many as you want – they will loop forever
])

const currentIndex = ref(0)
let autoSlideInterval = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % cards.value.length
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + cards.value.length) % cards.value.length
}

const goToSlide = (index) => {
  currentIndex.value = index
}

const goToPage = (link) => {
  if (link) window.location.href = link
}

const startAutoSlide = () => {
  pauseAutoSlide()
  if (cards.value.length > 1) {
    autoSlideInterval = setInterval(nextSlide, 3000)
  }
}

const pauseAutoSlide = () => {
  if (autoSlideInterval) clearInterval(autoSlideInterval)
}

// ── When dropdown changes → jump to matching card ────────────────────────
const onCategoryChange = () => {
  if (!selectedCategory.value) {
    // Optional: go to first slide if nothing selected
    currentIndex.value = 0
    startAutoSlide()
    return
  }

  // Find index of card whose value matches selected category
  const matchingIndex = cards.value.findIndex(
    card => card.value === selectedCategory.value
  )

  if (matchingIndex !== -1) {
    currentIndex.value = matchingIndex
  }

  // Continue auto-sliding from the new position
  startAutoSlide()
}

// Lifecycle hooks
onMounted(() => startAutoSlide())
onUnmounted(() => pauseAutoSlide())
</script>
<!-- ******************************************Crousel data end*************************************************** -->
<!-- *****************************************Script Setup End**************************************************** -->
<style scoped>
.dashboard {
  width: 100vw;
  min-height: 100vh;          /* change from height: 100vh → allows content to expand */
  position: relative;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 0.rem;
}

.bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 1;
}
/* ***************************************************Stars************************************************** */
/* Shooting stars container */
.shooting-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 2;               /* between stars (0) and bg image (1) */
  overflow: hidden;
}

/* Each shooting star – random position, delay, duration */
.shooting-star {
  position: absolute;
  width: 2px;
  height: 60px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 255, 220, 0.9),
    rgba(255, 255, 220, 0.6),
    transparent
  );
  transform: rotate(-35deg);   /* diagonal fall */
  opacity: 0;
  animation: shoot linear forwards;
  box-shadow: 0 0 15px rgba(255, 255, 220, 0.8);
}

/* Animation keyframes – one shooting star path */
@keyframes shoot {
  0% {
    opacity: 0;
    transform: translateY(-100px) translateX(0) rotate(-35deg);
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(120vh) translateX(80vw) rotate(-35deg);
  }
}

/* Generate 6 shooting stars with random timing & position */
.shooting-star:nth-child(1) {
  top: -10%;
  left: 10%;
  animation-duration: 4s;
  animation-delay: 2s;
}

.shooting-star:nth-child(2) {
  top: -5%;
  left: 40%;
  animation-duration: 3.8s;
  animation-delay: 7s;
}

.shooting-star:nth-child(3) {
  top: -15%;
  left: 70%;
  animation-duration: 4.2s;
  animation-delay: 12s;
}

.shooting-star:nth-child(4) {
  top: -8%;
  left: 25%;
  animation-duration: 3.5s;
  animation-delay: 18s;
}

.shooting-star:nth-child(5) {
  top: -12%;
  left: 55%;
  animation-duration: 4s;
  animation-delay: 24s;
}

.shooting-star:nth-child(6) {
  top: -6%;
  left: 85%;
  animation-duration: 3.7s;
  animation-delay: 29s;
}

/* Repeat cycle every 30 seconds */
.shooting-stars {
  animation: reset-shooting 30s infinite;
}

@keyframes reset-shooting {
  0%, 100% {
    /* nothing – just triggers child animations to restart */
  }
}

/* ***************************************************Stars End*************************************************** */
/* ────────────────────────────────────────
   Title area
───────────────────────────────────────── */
.title-container {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding-top: 3vh;           /* reduced from 8vh */
  padding-bottom: 2vh;        /* add some breathing room below title */
  flex-shrink: 0;             /* prevent squishing */
}

.logo {
  display: block;
  margin: 1px auto 1px auto;
  height: 7rem;
  /* max-height: 220px; */
  width: auto;
  aspect-ratio: 1/1.5;
  filter: drop-shadow(0 .4rem .3rem rgba(255, 255, 255, .75));
}
/* Main animated line container */
/* Main wrapper – allow wrapping and stacking on mobile */
.lama-title-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;           /* desktop: single line */
  gap: 0.8rem;
  width: 92%;
  max-width: 1200px;
  text-align: center;
}

/* Base text – even smaller base + better scaling */
.phrase,
.acronym,
.dash {
  font-size: clamp(1.2rem, 3.6vw, 2.2rem);
  font-weight: 600;
  letter-spacing: 0.3px;
  line-height: 1.28;
  color: white;
  text-shadow: 0 2px 8px rgba(0,0,0,0.7);
}

/* Highlighted letters */
.text-highlight {
  color: #ffd700;
  font-weight: 800;
}

/* Dash – smaller and optional */
.dash {
  font-size: clamp(1.5rem, 4.2vw, 2.6rem);
  color: rgba(255,255,255,0.75);
  font-weight: 300;
  opacity: 0.65;
}

/* Acronym – tighter spacing */
.acronym {
  display: flex;
  gap: 0.12em;
  color: #ffd700;
  font-weight: 900;
  letter-spacing: 0.3em;
  text-shadow: 0 4px 12px rgba(0,0,0,0.8);
}

/* Animations (unchanged) */
.animate-phrase { animation: phraseCycle 10s infinite ease-in-out; }
.animate-acronym { animation: acronymCycle 5s infinite ease-in-out; }

@keyframes phraseCycle {
  0%    { opacity: 1; }
  50%   { opacity: 1; }
  65%   { opacity: 0.3; }
  90%   { opacity: 0.3; }
  100%  { opacity: 1; }
}

@keyframes acronymCycle {
  0%, 30% { opacity: 0; transform: translateX(-180px) scale(0.7); }
  40%     { opacity: 0.2; transform: translateX(-100px) scale(0.85); }
  55%     { opacity: 1; transform: translateX(0) scale(1); }
  80%     { opacity: 1; transform: translateX(0) scale(1); }
  90%, 100% { opacity: 0; transform: translateX(80px) scale(0.9); }
}

/* *********************************************Drop Down css Start********************************************** */
.category-dropdown-container {
  position: relative;
  z-index: 12;
  width: 100%;
  max-width: 520px;
  margin: 1vh auto 2vh auto;   /* reduced top margin */
  padding: 0 1rem;
  text-align: center;
  flex-shrink: 0;
}

.category-label {
  display: block;
  margin-bottom: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.15rem;
  font-weight: 500;
  text-shadow: 0 1px 4px rgba(0,0,0,0.5);
}

.category-select {
  width: 100%;
  padding: 0.5rem .65rem;
  font-size: 1.05rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  background: rgba(30, 40, 60, 0.7);
  backdrop-filter: blur(8px);
  color: white;
  cursor: pointer;
  appearance: none;
  outline: none;
  transition: all 0.25s ease;
  box-shadow: 0 4px 16px rgba(0,0,0,0.35);
}

/* Custom arrow for select */
.category-select {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='white' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 12px;
}

.category-select:focus {
  border-color: #ffd700;
  box-shadow: 0 0 0 4px rgba(255, 215, 0, 0.2);
  background-color: rgba(30, 40, 60, 0.85);
}

.category-select option {
  background: #1e2840;
  color: white;
}


/* **********************************************Dropdown css End************************************************* */
/* **********************************************Crousel Css************************************************ */
/* Carousel Section */
.carousel-section {
  position: relative;
  z-index: 12;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;              /* remove forced top/bottom margin → let flex handle spacing */
  padding: 0 .5rem 1vh .5rem;    /* bottom padding for footer separation */
  /* flex: 1;                     ← key change: grow to fill available space */
  /* display: flex; */
  flex-direction: column;
  justify-content: center;     /* ← centers carousel vertically in its space */
  align-items: center;
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 24px;
  padding: 1;
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}

.carousel-track {
  display: flex;
  transition: transform 0.6s cubic-bezier(0.32, 0.72, 0, 1);
  width: 100%;
}

.carousel-card {
  min-width: 100%;
  position: relative;
  border-radius: 24px;
  overflow: hidden;
}

.card-image {
  width: 100%;
  height: 350px;
  object-fit: cover;
  display: block;
}

.card-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, transparent, rgba(0,0,0,0.85));
  padding: 2.5rem 2rem 2rem;
  color: white;
}

.card-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 0.8rem;
  text-shadow: 0 2px 10px rgba(0,0,0,0.8);
}

.card-desc {
  font-size: 1.15rem;
  line-height: 1.5;
  margin-bottom: 1.8rem;
  opacity: 0.95;
}

.card-btn {
  background: #ffd700;
  color: #1a1a2e;
  font-weight: 700;
  padding: 0.9rem 2rem;
  border-radius: 50px;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-btn:hover {
  background: white;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 215, 0, 0.4);
}

/* Navigation Arrows */
.nav-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.6);
  color: white;
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 15;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.nav-arrow:hover {
  opacity: 1;
  background: #ffd700;
  color: #1a1a2e;
}

.prev { left: 20px; }
.next { right: 20px; }

/* Dots */
/* .dots {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 2rem;
} */

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: #ffd700;
  transform: scale(1.4);
}

/* Mobile */
@media (max-width: 768px) {
  .card-image { height: 20rem; }
  .card-title { font-size: 1.8rem; }
  .nav-arrow { width: 48px; height: 48px; font-size: 1.8rem; }
}
/* Latest Updates Container */
.updates-container {
  position: relative;
  z-index: 1;
  width: 100%;
  margin: 0.5vh 0 2vh 0; /* space above and below */
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(6px);
  border-top: 1px solid rgba(255, 215, 0, 0.15);
  border-bottom: 1px solid rgba(255, 215, 0, 0.15);
}

/* Label on left (static) */
.updates-label {
  position: absolute;
  left: 1.5rem;
  top: 5%;
  transform: translateY(-50%);
  color: #ffd700;
  font-weight: 700;
  font-size: 1.15rem;
  padding: 0.4rem 1rem;
  background: rgba(0,0,0,0.6);
  border-radius: 6px;
  z-index: 10;
  white-space: nowrap;
  box-shadow: 0 2px 10px rgba(0,0,0,0.5);
}

/* Ticker wrapper – moving part */
.updates-ticker {
  overflow: hidden;
  padding: 0.8rem 0;
  padding-left: 1rem; /* space for the static label */
}

/* Scrolling content */
.ticker-wrapper {
  display: flex;
  animation: scroll-left 30s linear infinite; /* 50s = speed, adjust 40-70s */
  white-space: nowrap;
  padding-bottom: 1rem;
}

/* Each set of updates */
.ticker-content {
  display: flex;
  gap: 1.5rem;
  flex-shrink: 0;
}

/* Individual update item */
.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: #e0f7fa;
  font-size: 1.05rem;
  font-weight: 500;
  padding: 0.5rem 1.4rem;
  background: rgba(255,215,0,0.08);
  border-radius: 40px;
  border: 1px solid rgba(255,215,0,0.25);
  box-shadow: 0 2px 8px rgba(0,0,0,0.4);
}

/* Date part */
.ticker-date {
  font-size: 0.9rem;
  color: #b0bec5;
  opacity: 0.9;
}

/* Infinite scroll animation */
@keyframes scroll-left {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* -50% because duplicated content */
}

/* Pause on hover */
.updates-ticker:hover .ticker-wrapper {
  animation-play-state: paused;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .updates-container {
    margin: .5vh 0 1vh 0;
    padding: 0.8rem 0;
  }

  .updates-label {
    font-size: 1rem;
    padding: 0.3rem 0.8rem;
    left: 1rem;
  }

  .updates-ticker {
    padding-left: 140px; /* smaller space for label */
    padding: .8rem 0;
    margin: 3vh 0 5vh;
  }

  .ticker-item {
    font-size: 0.95rem;
    padding: 0.4rem 1.1rem;
    gap: 0.6rem;
  }

  .ticker-date {
    font-size: 0.82rem;
  }

  .ticker-content {
    gap: .5rem;
  }

  @keyframes scroll-left {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
}





/* ************************************************Crousel Css end**************************************************** */
/* ────────────────────────────────────────
   Footer (unchanged)
───────────────────────────────────────── */
.footer {
  position: relative;
  bottom: 0;
  left: 0;
  right: 0;
  padding: .5rem .25rem 1.25rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: .5rem 1rem;
  z-index: 1;
  background: rgba(0, 0, 0, 0.18);
  backdrop-filter: blur(5px);
}

.footer-logo {
  height: 80px;
  width: auto;
  object-fit: contain;
  filter: brightness(1.1) drop-shadow(0 2px 6px rgba(0,0,0,0.65));
}

.footer-text {
  color: #e0e0e0;
  font-size: 1.8rem;
  font-weight: 500;
  white-space: nowrap;
  text-shadow: 0 1px 4px rgba(0,0,0,0.6);
}

/* Responsive */
@media (max-width: 768px) {
  .lama-title-wrapper {
    flex-wrap: wrap;
    flex-direction: column;        /* phrase above LAMA */
    gap: 0.6rem;
    line-height: 1.22;
  }

  .dash {
    display: none;
  }

  .phrase {
    font-size: clamp(1.05rem, 4.4vw, 1.65rem);
    letter-spacing: 0.15px;
    max-width: 98%;
    word-break: break-word;        /* force break long words if needed */
  }

  .acronym {
    font-size: clamp(1.25rem, 5.2vw, 1.95rem);
    letter-spacing: 0.45em;
    margin-top: 0.3rem;
  }

  .title-container {
    padding-top: 1vh;
    padding-bottom: .5vh;
  }
}

/* Extra small phones (320–400px) */
@media (max-width: 420px) {
  .phrase {
    font-size: clamp(0.95rem, 4.8vw, 1.45rem);
  }
  .acronym {
    font-size: clamp(1.15rem, 5.8vw, 1.7rem);
    letter-spacing: 0.35em;
  }

  .footer {
    gap: 1rem 2rem;
    padding: .5rem;
  }

  .footer-logo {
    height: 50px;
  }

  .footer-text {
    font-size: .5rem;
  }
}
@media (max-width: 400px) {
  .phrase {
    font-size: clamp(1rem, 5vw, 1.5rem);
  }
  .acronym {
    font-size: clamp(1.2rem, 6vw, 1.8rem);
    letter-spacing: 0.4em;
  }
}
/* Latest Updates Ticker */
.updates-ticker {
  position: relative;
  z-index: 0;
  width: 100%;
  background: linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(30,40,60,0.85) 50%, rgba(0,0,0,0.7) 100%);
  backdrop-filter: blur(6px);
  overflow: hidden;
  padding: 1rem 0;
  margin: 2vh 0 3vh 0; /* space above & below */
}

.ticker-wrapper {
  display: flex;
  animation: ticker-scroll 60s linear infinite; /* duration = speed, adjust 40–80s */
  white-space: nowrap;
}

.ticker-content {
  display: flex;
  gap: 3rem; /* space between items */
  flex-shrink: 0;
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  color: #e0f7fa;
  font-size: 1.05rem;
  font-weight: 500;
  padding: 0.6rem 1.5rem;
  background: rgba(255,215,0,0.08);
  border-radius: 50px;
  border: 1px solid rgba(255,215,0,0.25);
  box-shadow: 0 2px 10px rgba(0,0,0,0.4);
  white-space: nowrap;
}

.ticker-date {
  font-size: 0.9rem;
  color: #b0bec5;
  opacity: 0.85;
}

/* Infinite loop animation – right to left */
@keyframes ticker-scroll {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); } /* -50% because we duplicated content */
}

/* Pause on hover (optional – nice UX) */
.updates-ticker:hover .ticker-wrapper {
  animation-play-state: paused;
}

/* Mobile – smaller text & tighter spacing */
@media (max-width: 768px) {
  .updates-ticker {
    padding: 0.8rem 0;
    margin: .5vh 0 1vh 0;
  }

  .ticker-item {
    font-size: 0.95rem;
    padding: 1rem 1.2rem;
    gap: 0.8rem;
  }

  .ticker-date {
    font-size: 0.82rem;
  }

  .ticker-content {
    gap: 5rem;
  }

  @keyframes ticker-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
}
</style>
<!-- ********************************************************************************************** -->
@media (max-width: 768px) {
  .category-dropdown-container {
    margin: 2.5vh auto 3.5vh auto;
    padding: 0 1rem;
  }

  .category-label {
    font-size: 1rem;
  }

  .category-select {
    font-size: 0.95rem;
    padding: 0.85rem 1.1rem;
  }
}

<!-- *********************************************01-03-2026*************************************************** -->
 
<!-- MapView/utils/MapHeader.vue -->
<template>
  <header class="map-header">
    <!-- Top row on mobile: SAC + University + UT Ladakh -->
    <div class="top-logos">
      <a href="https://www.sac.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/sac.png" alt="SAC" class="logo-img" />
      </a>
      <a href="https://uol.ac.in/" target="_blank" rel="noopener noreferrer">
        <img src="/univ_ladakh.png" alt="University of Ladakh" class="logo-img" />
      </a>
      <a href="https://ladakh.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/ut_ladakh.png" alt="UT Ladakh" class="logo-img" />
      </a>
    </div>

    <!-- Center LAMA (second row on mobile, center on desktop) -->
    <div class="center-title">
      <h1 class="lama-text">L A M A</h1>
      <div class="phrase animate-phrase">
        <span class="text-highlight">L</span><span class="text-highlight">A</span>dakh 
        <span class="text-normal">s</span>pecific 
        <span class="text-highlight">M</span>odelling 
        and 
        <span class="text-normal">s</span>pace 
        <span class="text-highlight">A</span>pplications
      </div>
    </div>

    <!-- Left logos (desktop only) -->
    <div class="left-logos">
      <a href="https://www.india.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/GovernmentofIndia.png" alt="Government of India" class="logo-img" />
      </a>
      <a href="https://www.isro.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/ISRO.png" alt="ISRO" class="logo-img" />
      </a>
      <a href="https://www.sac.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/sac.png" alt="SAC" class="logo-img" />
      </a>
    </div>

    <!-- Right logos (desktop only) -->
    <div class="right-logos">
      <a href="https://vedas.sac.gov.in/en/" target="_blank" rel="noopener noreferrer">
        <img src="/vedas_logo.png" alt="VEDAS" class="logo-img" />
      </a>
    </div>
  </header>
</template>

<script setup>
// No logic needed
</script>

<style scoped>
.map-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(8, 20, 60, 0.25);
  backdrop-filter: blur(12px);
  color: white;
  z-index: 1200;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  border-bottom: 1px solid rgba(255, 215, 0, 0.12);
  backdrop-filter: blur(5px);
}

/* Desktop layout (large screens) */
@media (min-width: 769px) {
  .map-header {
    height: 90px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
  }

  .top-logos {
    display: none; /* hidden on desktop */
  }

  .left-logos,
  .right-logos {
    display: flex;
    align-items: center;
    gap: 1.4rem;
  }

  .center-title {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    text-align: center;
  }

  .lama-text {
    margin: 0;
    font-size: 2.8rem;
    font-weight: 900;
    letter-spacing: 0.35em;
    color: #ffd700;
    text-shadow: 0 3px 12px rgba(0,0,0,0.7);
    line-height: 1;
  }

  .phrase {
    margin: 4px 0 0;
    font-size: 1.05rem;
    color: rgba(255,255,255,0.88);
    letter-spacing: 0.12em;
    font-weight: 400;
  }
  .logo-img {
  height: 58px;
  width: auto;
  object-fit: contain;
}

}

/* Mobile layout (small screens) */
@media (max-width: 768px) {
  .map-header {
    height: auto;
    padding: 0.8rem 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Top row: only SAC + University + UT Ladakh */
  .top-logos {
    display: flex;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
    margin-bottom: 0.6rem;
  }

  /* Hide all other logos */
  .left-logos,
  .right-logos {
    display: none;
  }

  /* Center LAMA on second row */
  .center-title {
    text-align: center;
    width: 100%;
  }

  .lama-text {
    margin: 0;
    font-size: 2.2rem;
    font-weight: 900;
    letter-spacing: 0.3em;
    color: #ffd700;
    text-shadow: 0 2px 8px rgba(0,0,0,0.7);
    line-height: 1;
  }

  .phrase {
    margin: 4px 0 0;
    font-size: 0.95rem;
    color: rgba(255,255,255,0.88);
    letter-spacing: 0.1em;
    font-weight: 400;
    display: none;
  }

  .logo-img {
    height: 48px;
    width: auto;
    object-fit: contain;
  }
}

.toast {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.85);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 2000;
  font-size: 14px;
  max-width: 90%;
  text-align: center;
  pointer-events: none;
  animation: fadeInOut 4s forwards;
}

@keyframes fadeInOut {
  0%   { opacity: 0; transform: translate(-50%, 20px); }
  10%  { opacity: 1; transform: translate(-50%, 0); }
  90%  { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, 20px); }
}

/* Mobile: make toast smaller & lower */
@media (max-width: 768px) {
  .toast {
    bottom: 80px;
    font-size: 13px;
    padding: 10px 20px;
  }
}
</style>
<!-- MapView/utils/MapHeader.vue -->
<template>
  <header class="map-header">
    <!-- Left logos -->
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

    <!-- Center LAMA -->
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

    <!-- Right logos -->
    <div class="right-logos">
      <a href="https://uol.ac.in/" target="_blank" rel="noopener noreferrer">
        <img src="/univ_ladakh.png" alt="University of Ladakh" class="logo-img" />
      </a>
      <a href="https://ladakh.gov.in/" target="_blank" rel="noopener noreferrer">
        <img src="/ut_ladakh.png" alt="UT Ladakh" class="logo-img" />
      </a>
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
  height: 90px;
  background: linear-gradient(to bottom, rgba(10, 20, 50, 0.98), rgba(10, 20, 50, 0.92));
  backdrop-filter: blur(12px);
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  z-index: 1200;
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  border-bottom: 1px solid rgba(255, 215, 0, 0.12);
}

.left-logos,
.right-logos {
  display: flex;
  align-items: center;
  gap: 1.4rem;
}

.logo-img {
  height: 58px;
  width: auto;
  object-fit: contain;
  transition: transform 0.25s ease;
}

.logo-img:hover {
  transform: scale(1.08);
}

.center-title {
  text-align: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
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

.subtitle {
  margin: 6px 0 0;
  font-size: 1.05rem;
  color: rgba(255,255,255,0.88);
  letter-spacing: 0.12em;
  font-weight: 400;
}
.text-highlight {
  color: #ffd700 !important;       /* gold/yellow - very visible */
  font-weight: 800;
  text-shadow: 0 0 8px rgba(255, 215, 0, 0.7); /* optional glow */
}
/* Mobile / tablet adjustments */
@media (max-width: 1024px) {
  .map-header {
    height: 80px;
    padding: 0 1.2rem;
    flex-wrap: wrap;
    gap: 0.8rem;
  }

  .left-logos,
  .right-logos {
    gap: 1rem;
  }

  .logo-img {
    height: 48px;
  }

  .lama-text {
    font-size: 2.2rem;
    letter-spacing: 0.3em;
  }

  .subtitle {
    font-size: 0.95rem;
    margin-top: 4px;
  }
}

@media (max-width: 768px) {
  .map-header {
    height: 70px;
    padding: 0 1rem;
    justify-content: center;
  }

  .left-logos,
  .right-logos {
    gap: 0.8rem;
  }

  .logo-img {
    height: 40px;
  }

  .lama-text {
    font-size: 1.9rem;
    letter-spacing: 0.25em;
  }

  .subtitle {
    font-size: 0.85rem;
    display: none; /* optional: hide subtitle on very small screens */
  }

  /* Hide right logos if too crowded – optional */
  .right-logos {
    display: none;
  }

  /* Center title takes full width */
  .center-title {
    position: static;
    transform: none;
  }
}
</style>
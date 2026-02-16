<template>
  <header>
    <div class="logo-bar header-logo">
      <img src="../assets/icons/national_emblem2.png" alt="Govt of India" />
    </div>
    <h1>PWA03 – LAMA Dashboard</h1>

    <!-- Search Dropdown -->
    <div class="theme-search">
      <select @change="goTo($event.target.value)">
        <option value="" disabled selected>Search / Select Theme</option>
        <option value="snow_glacier">❄️ Snow & Glacier</option>
        <option value="agriculture">🌾 Agriculture</option>
        <option value="desertification">🏜 Desertification</option>
        <option value="env">🌍 Environment</option>
        <option value="geology">⛰ Geology</option>
        <option value="solar">🔆 Solar Energy</option>
        <option value="urban">🏙 Urban Studies</option>
        <option value="wetland">💧 Wetland</option>
      </select>
    </div>
  </header>

  <main>
    <section class="card-grid">
      <div class="card" @click="goTo('snow_glacier')">
        <img src="../assets/themeimages/glacier.png" alt="Snow & Glacier" />
        <div class="caption">❄️ Snow & Glacier</div>
      </div>

      <div class="card" @click="goTo('agriculture')">
        <img src="../assets/themeimages/agri.jpg" alt="Agriculture" />
        <div class="caption">🌾 Agriculture</div>
      </div>

      <div class="card" @click="goTo('desertification')">
        <img src="../assets/themeimages/desertification.jpg" alt="Desertification" />
        <div class="caption">🏜 Desertification</div>
      </div>

      <div class="card" @click="goTo('env')">
        <img src="../assets/themeimages/env.jpg" alt="Environment" />
        <div class="caption">🌍 Environment</div>
      </div>

      <div class="card" @click="goTo('geology')">
        <img src="../assets/themeimages/geology.jpg" alt="Geology" />
        <div class="caption">⛰ Geology</div>
      </div>

      <div class="card" @click="goTo('solar')">
        <img src="../assets/themeimages/solar.png" alt="Solar Energy" />
        <div class="caption">🔆 Solar Energy</div>
      </div>

      <div class="card" @click="goTo('urban')">
        <img src="../assets/themeimages/urban.jpg" alt="Urban Studies" />
        <div class="caption">🏙 Urban Studies</div>
      </div>

      <div class="card" @click="goTo('wetland')">
        <img src="../assets/themeimages/wetland.jpg" alt="Wetland" />
        <div class="caption">💧 Wetland</div>
      </div>
    </section>
  </main>

  <footer>
    <div class="logo-bar footer-logos">
      <img src="../assets/icons/sac.png" alt="SAC" />
      <img src="../assets/icons/univ_ladakh.png" alt="University of Ladakh" />
      <img src="../assets/icons/ut_ladakh.png" alt="UT Ladakh" />
      <img src="../assets/icons/vedas_logo.png" alt="VEDAS" />
      <img src="../assets/icons/ISRO_logo.png" alt="ISRO" />
    </div>
    <p>© 2026 LAMA Portal</p>
  </footer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goTo = (theme) => {
  router.push(`/map/${theme}`)
}
</script>

<style scoped>
body, html, #app {
  background: transparent !important;
}

main, header, footer {
  background: rgba(255, 255, 255, 0.85) !important; /* Semi-transparent white for readability */
  backdrop-filter: blur(4px);
}
/* Header */
header {
  background: linear-gradient(to bottom, rgba(0, 77, 153, 0.95), rgba(0, 77, 153, 0.85));
  color: white;
  padding: 1rem 0;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.header-logo img {
  height: 55px;
  width: auto;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
}

.logo-bar {
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  padding: 0.6rem 0;
}

h1 {
  margin: 0.4rem 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: 1px;
}

/* Search Dropdown */
.theme-search {
  margin: 1rem auto;
  max-width: 350px;
}

.theme-search select {
  width: 100%;
  padding: 0.8rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 2px solid #004d99;
  background: white;
  color: #004d99;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

/* Card Grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.6rem;
  padding: 2rem 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Card */
.card {
  background: linear-gradient(135deg, white, #f8f9fa);
  border-radius: 16px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.15);
  overflow: hidden;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,77,153,0.1);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 35px rgba(0,0,0,0.25);
  border-color: #004d99;
}

.card img {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-bottom: 3px solid #004d99;
}

.caption {
  padding: 1rem;
  font-size: 1.15rem;
  font-weight: 600;
  color: #004d99;
}

/* Footer */
footer {
  background: linear-gradient(to top, #f0f0f0, white);
  text-align: center;
  padding: 1.5rem 0;
  margin-top: 3rem;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.15);
}

.footer-logos img {
  height: 50px;
  width: auto;
  margin: 0 1.2rem;
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.footer-logos img:hover {
  transform: scale(1.08);
}

/* Responsive */
@media (max-width: 1024px) {
  .card-grid {
    gap: 1.4rem;
  }
  .card img {
    height: 150px;
  }
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .header-logo img {
    height: 48px;
  }
  .footer-logos img {
    height: 42px;
    margin: 0.8rem;
  }
  h1 {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  .card img {
    height: 140px;
  }
  .caption {
    font-size: 1rem;
  }
  h1 {
    font-size: 1.5rem;
  }
}
</style>
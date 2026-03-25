<script setup>
import { ref, watch, onMounted } from "vue"
import { useRoute } from "vue-router"
import MapHeader from "./utils/MapHeader.vue"

const route = useRoute()

const iframeUrl = ref("")
const loading = ref(true)

const loadApp = async () => {
  try {
    loading.value = true
    iframeUrl.value = ""

    const slug = route.params.slug

    const res = await fetch("/carousel/data.json")
    const data = await res.json()

    const item = data.find(i => i.redirected_to === slug)

    if (!item) {
      console.warn("Invalid slug:", slug)
      loading.value = false
      return
    }

    iframeUrl.value = item.iframe_url

  } catch (err) {
    console.error("Error loading app:", err)
  } finally {
    loading.value = false
  }
}

onMounted(loadApp)
watch(() => route.params.slug, loadApp)
</script>

<template>
  <div class="map-container">
    <MapHeader />

    <div class="map-wrapper">
      <div class="iframe-container">
        
        <!-- LOADING -->
        <div v-if="loading">
          Loading application...
        </div>

        <!-- IFRAME -->
        <iframe
          v-else-if="iframeUrl"
          :src="iframeUrl"
          frameborder="0"
        ></iframe>

        <!-- INVALID -->
        <div v-else>
          Application not found
        </div>

      </div>
    </div>

    <footer class="map-footer">
      Copyright © University of Ladakh
    </footer>
  </div>
</template>

<style scoped>
.map-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.map-wrapper {
  flex: 1;
  position: relative;
}

.iframe-container {
  width: 100%;
  height: 100%;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.map-footer {
  background: #0f4c81;
  color: white;
  text-align: center;
  font-size: 13px;
}

@media (max-width: 768px) {
  .map-container {
    height: calc(100vh - 55px);
  }
}
</style>
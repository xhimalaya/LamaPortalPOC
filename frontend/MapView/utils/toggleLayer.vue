<script setup>
import { ref } from "vue"

defineProps({
  layerStates: {
    type: Array,
    required: true
  }
})

const shown = ref(false)

const togglePanel = () => {
  shown.value = !shown.value
}

const toggleLayer = (layerObj) => {
  layerObj.visible = !layerObj.visible
  layerObj.layer.setVisible(layerObj.visible)
}
</script>

<template>
  <div
    class="custom-layer-switcher"
    :class="{ shown: shown }"
  >
    <!-- Toggle Button -->
    <button
      class="layer-switcher-btn"
      @click="togglePanel"
      :title="shown ? 'Collapse legend' : 'Layer Selector'"
      :aria-label="shown ? 'Collapse legend' : 'Layer Selector'"
    >
      <img
        v-if="!shown"
        src="/layer.png"
        alt="Layer Selector"
        class="icon"
      />
      <img
        v-else
        src="/back-arrow.png"
        alt="Collapse"
        class="icon"
      />
    </button>

    <!-- Panel -->
    <div class="panel" v-if="shown">
      <ul>
        <li class="group">
          <label>Overlays</label>
          <ul>
            <li
              v-for="layerObj in layerStates"
              :key="layerObj.id"
              class="layer"
            >
              <input
                type="checkbox"
                :id="layerObj.id"
                :checked="layerObj.visible"
                @change="toggleLayer(layerObj)"
              />
              <label :for="layerObj.id">
                {{ layerObj.id }}
              </label>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.custom-layer-switcher {
  position: absolute;
  top: 105px;
  right: 20px;
  z-index: 10000;
  pointer-events: auto;
  font-family: sans-serif;
}

.layer-switcher-btn {
  background: rgb(2, 1, 1);
  border: 5px solid #05a0b4;
  padding: 6px;
  cursor: pointer;
  border-radius: 4px;
  width: 4vw;
  height: 8vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.layer-switcher-btn:hover {
  background: #e3fc01;
}

.icon {
  width: 4vh;
  height: 6vw;
  object-fit: contain;
}

.panel {
  margin-top: 6px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 10px;
  min-width: 240px;
  max-height: 350px;
  overflow-y: auto;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

ul {
  list-style: none;
  padding-left: 0;
  margin: 0;
}

.group > label {
  font-weight: bold;
  display: block;
  margin-bottom: 6px;
}

.layer {
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.layer input {
  cursor: pointer;
}

.layer label {
  cursor: pointer;
  font-size: 13px;
}
</style>
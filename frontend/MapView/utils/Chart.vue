<script setup>
import { ref, watch, defineProps, defineEmits } from "vue"

const props = defineProps({
  show: Boolean,
  bbox: Array
})

const emit = defineEmits(["close"])

const loading = ref(true)

watch(
  () => props.show,
  (val) => {
    if (val) {
      loading.value = true

      // Simulate loading for now
      setTimeout(() => {
        loading.value = false
      }, 2000)
    }
  }
)

const closeModal = () => {
  emit("close")
}
</script>

<template>
  <div v-if="show" class="chart-overlay">
    <div class="chart-modal">
      
      <!-- Header -->
      <div class="chart-header">
        <h5>Snow Cover Heatmap</h5>
        <button class="close-btn" @click="closeModal">✕</button>
      </div>

      <!-- Body -->
      <div class="chart-body">
        <div v-if="loading" class="spinner"></div>

        <div v-else>
          <p><strong>BBOX:</strong></p>
          <p>{{ bbox }}</p>
        </div>
      </div>

    </div>
  </div>
</template>

<style>
.chart-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20000;
}

.chart-modal {
  width: 450px;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.3);
  overflow: hidden;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.chart-header h5 {
  margin: 0;
  font-size: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
}

.chart-body {
  padding: 30px;
  text-align: center;
}

/* Spinner */
.spinner {
  width: 50px;
  height: 50px;
  border: 5px solid #e5e7eb;
  border-top: 5px solid #05a0b4;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
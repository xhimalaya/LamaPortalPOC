import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'ol/ol.css'
// import Vue3OpenLayers from 'vue3-openlayers'
// import 'vue3-openlayers/dist/vue3-openlayers.css'

const app = createApp(App)
// app.use(Vue3OpenLayers)
app.use(router)
app.mount('#app')

taiwland.css - for rendering 

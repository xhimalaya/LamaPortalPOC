import { createRouter, createWebHistory } from 'vue-router'
import Map from '../../MapView/Map.vue'
import Background from "../components/backgroundLandingPage.vue";

const routes = [
  {
    path: '/',
    name: 'Map',
    component: Background
  },
  {
    path: '/map',
    name: 'Map',
    component: Map
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

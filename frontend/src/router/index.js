import { createRouter, createWebHistory } from 'vue-router'
// import Background from '../components/backgroundLandingPage.vue'
import Background from '../../LandingPage/Landing.vue'
import Map from '../../MapView/Map.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Background
  },
  {
    path: '/map',
    name: 'MapView',
    component: Map
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
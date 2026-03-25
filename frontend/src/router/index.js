import { createRouter, createWebHistory } from 'vue-router'
// import Background from '../components/backgroundLandingPage.vue'
import Background from '../../LandingPage/Landing.vue'
import Map from '../../MapView/Map.vue'
import mapIframe from '../../MapView/mapIframe.vue' 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Background
  },
  {
    path: '/map/:slug/',
    name: 'MapView',
    component: Map
  },
  {
    path: '/maps/:slug/',
    name: 'mapIframe',
    component: mapIframe
  },
]

export default createRouter({
  history: createWebHistory(),
  routes
})
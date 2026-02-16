import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue')  // or '@/views/Dashboard.vue'
  },
  {
    path: '/map/:theme',
    name: 'ThemeMap',
    component: () => import('../views/ThemeMap.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
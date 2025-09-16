import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import FruitsPage from '../pages/FruitsPage.vue'
import FruitDetailsPage from '../pages/FruitDetailsPage.vue'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: LandingPage
  },
  {
    path: '/fruits',
    name: 'fruits',
    component: FruitsPage
  },
  {
    path: '/fruits/:name',
    name: 'fruit-details',
    component: FruitDetailsPage,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
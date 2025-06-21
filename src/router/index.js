import { createRouter, createWebHistory } from 'vue-router'
import AuthView from '../views/AuthView.vue'
import HomeView from '../views/HomeView.vue'
import CategoryDetail from '../views/CategoryDetail.vue'
import WeatherView from '../views/WeatherView.vue'
import CalendarView from '../views/CalendarView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: AuthView,
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/categories/:id',
      name: 'CategoryDetail',
      component: CategoryDetail,
      props: true, // Übergibt die ID als prop
    },
    {
      path: '/weather',
      name: 'Weather',
      component: WeatherView,
    },
    {
      path: '/calendar',
      name: 'Calendar',
      component: CalendarView,
    }
  ],
})

export default router

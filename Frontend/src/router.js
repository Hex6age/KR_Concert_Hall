import { createRouter, createWebHistory } from 'vue-router'
import MainPage from './views/MainPage.vue'
import EventDetails from './views/EventDetails.vue'
import ProfilePage from './views/ProfilePage.vue' 

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: MainPage },
    { path: '/profile', name: 'profile', component: ProfilePage },
    // Маршрут с динамическим параметром :id
    { path: '/event/:id', name: 'event-details', component: EventDetails } 
  ]
})

export default router
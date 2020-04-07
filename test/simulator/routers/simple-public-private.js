import Vue from 'vue'
import Router from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import PublicPage from '../pages/PublicPage.vue'
import PrivatePage from '../pages/PrivatePage.vue'

Vue.use(Router)

export function createRouter() {
  const router = new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),

    routes: [
      {
        path: '/',
        name: 'home',
        component: HomePage,
      },
      {
        path: '/public',
        name: 'public',
        component: PublicPage,
      },
      {
        path: '/private',
        name: 'private',
        component: PrivatePage,
        meta: { requiresAuth: true },
      },
    ],
  })

  return router
}

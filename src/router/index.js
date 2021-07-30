import Vue from 'vue'
import VueRouter from 'vue-router'
import { fb } from '@/plugins/firebaseInit'
import { routes } from '@/router/lstRoute'
import { store } from '@/store/store.js'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const connectedUser = fb.auth.currentUser

  if (connectedUser) console.log(connectedUser.uid)
  if (requiresAuth && !(await fb.auth.getCurrentUser())) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router

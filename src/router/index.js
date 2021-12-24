import Vue from 'vue'
import VueRouter from 'vue-router'

import { fb } from '@/plugins/firebaseInit'
import { routes } from '@/router/lstRoute'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

//
// check if user is connected
const checkUserConnected = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = fb.auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    }, reject)
  })
}

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const currentUser = fb.auth.currentUser

  if (requiresAuth && !(await checkUserConnected()) && !currentUser) {
    next({ name: 'login' })
  } else {
    next()
  }
})

export default router

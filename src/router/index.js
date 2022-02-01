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

// on active la gestion d'action sur la demande d'une route
router.beforeEach(async (to, from, next) => {
  // si on demande la page login on y va directement
  if (to.name === 'login') next()
  else {
    // on regarde si l'utilisateur était connecté
    fb.auth.onAuthStateChanged((user) => {
      // l'utilisateur était connecté on récupére ses infos et on envoie la pasge demandée
      if (user) {
        store.commit('cnx/setUser', user, {
          root: true
        })
        store.dispatch('cnx/loadProfil', { root: true }).then((result) => {
          next()
        })
      } else {
        // on est sur le cas d'une demande de page et un user non identifié
        // la route demandée est-elle sécurisée ?
        const requiresAuth = to.matched.some(
          (record) => record.meta.requiresAuth
        )
        // la page demandée n'est pas sécurisée, on peut l'afficher
        if (!requiresAuth) next()
        else {
          // la page demandée est sécurisée, l'utilsiateur doit s'authentifier
          next({ name: 'login' })
        }
      }
    })
  }
})

export default router

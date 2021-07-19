import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App'
import { fb } from '@/firebaseDef.js'
import { store } from '@/store/store.js'
import 'vuetify/dist/vuetify.min.css'
import fr from 'vuetify/es5/locale/fr'
import Routes from '@/router/lstRoute'
import firebase from 'firebase'
import Vuetify from 'vuetify'
import '@babel/polyfill'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import '@mdi/font/css/materialdesignicons.css'
import L from 'leaflet';

const router = new VueRouter({ mode: 'history', routes: Routes })

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Vuetify)

const opts = {
  icons: {
    iconfont: 'mdi'
  },
  lang: {
    locales: { fr },
    current: 'fr'
  },
  rtl: false,
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#90AB47',
        accent: '#FF4081',
        secondary: '#9ECBB4',
        success: '#74F25A',
        info: '#BCEDAD',
        warning: '#FB8C00',
        error: '#EA4848'
      },
      light: {
        primary: '#1976D2',
        accent: '#e91e63',
        secondary: '#30b1dc',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      }
    }
  }
}

let app = ''

//
// middleware de sécurité
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)
  const currentUser = firebase.auth().currentUser
  // accès au menu
  store.commit('setDisplayMenuOn')

  //
  // gestion de la sécu
  if (requiresAuth && !currentUser) {
    next('login')
  } else if (requiresAuth && currentUser) {
    // la gestion du user est faite dans le store au chargement
    next()
  } else {
    // route without sécurity
    next()
  }
})

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})


const user = fb.auth.onAuthStateChanged((user) => {
  if (!app) {
    let appli = new Vue({
      el: '#app',
      vuetify: new Vuetify(opts),
      store,
      router: router,
      render: (h) => h(App)
    })
  }
})

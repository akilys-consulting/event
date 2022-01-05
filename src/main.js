import Vue from 'vue'

import '@/plugins/fireauth'

import router from '@/router'
import App from './App'
import { store } from '@/store/store.js'

import '@/plugins/editorHtml'

import 'leaflet/dist/leaflet.css'

import '@/plugins/addToCalendar'
import VuetifyConf from '@/plugins/vuetify'

Vue.config.productionTip = false
let vue = null
if (!vue) {
  vue = new Vue({
    el: '#app',
    vuetify: VuetifyConf,
    store,
    router: router,
    render: (h) => h(App)
  })
}

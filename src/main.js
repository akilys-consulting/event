import Vue from 'vue'
import router from '@/router'
import App from './App'
import { store } from '@/store/store.js'

import VuetifyConf from '@/plugins/vuetify'
import '@/plugins/editorHtml'
import '@/plugins/fireauth'
import 'leaflet/dist/leaflet.css'

Vue.config.productionTip = false

let app = ''
if (!app) {
  let appli = new Vue({
    el: '#app',
    vuetify: VuetifyConf,
    store,
    router: router,
    render: h => h(App)
  })
}

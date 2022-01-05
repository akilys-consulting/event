import Vue from 'vue'
import { mapState } from 'vuex'

import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import fr from 'vuetify/lib/locale/fr'
import '@mdi/font/css/materialdesignicons.css'
import { store } from '@/store/store.js'

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
        accent: '#9D00E0',
        secondary: '#9ECBB4',
        success: '#74F25A',
        info: '#BCEDAD',
        warning: '#FB8C00',
        error: '#EA4848'
      },
      light: {
        primary: '#1976D2',
        accent: '#9D00E0',
        secondary: '#30b1dc',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FB8C00',
        error: '#FF5252'
      }
    }
  }
}

export default new Vuetify(opts)

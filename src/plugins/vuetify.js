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
  rtl: false
  /*  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#90AB47',
        accent: '#9FD656',
        secondary: '#9FED6B',
        success: '#74F25A',
        info: '#BCEDAD',
        warning: '#EB6D00',
        error: '#A31435'
      },
      light: {
        primary: '#8D6E63',
        accent: '#FFAB8C',
        secondary: '#ED8D6B',
        success: '#4CAF50',
        info: '#19A1B0',
        warning: '#EB6D00',
        error: '#A31435'
      }
    }
  } */
}

export default new Vuetify(opts)

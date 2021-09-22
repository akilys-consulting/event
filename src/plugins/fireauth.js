import { fb } from '@/plugins/firebaseInit'
import { store } from '@/store/store.js'

fb.auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('user connected')
    store.commit('cnx/setUser', user, {
      root: true
    })
    store.dispatch('cnx/loadProfil', { root: true })
  } else {
    console.log('user disconnected')
    store.dispatch('cnx/disconnect', { root: true })
  }
})

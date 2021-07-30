import { fb } from '@/plugins/firebaseInit'
import { store } from '@/store/store.js'

fb.auth.onAuthStateChanged(user => {
  store.dispatch('cnx/setUser', user)
})

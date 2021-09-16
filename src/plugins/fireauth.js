import { fb } from '@/plugins/firebaseInit'
import { store } from '@/store/store.js'
console.log('load ctrl user')

fb.auth.onAuthStateChanged(user => {
  console.log('user changed')
  store.commit('cnx/setUser', user, {
    root: true
  })
  store.dispatch('cnx/loadProfil', { root: true })
})

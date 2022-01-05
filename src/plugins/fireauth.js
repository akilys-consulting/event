import { fb } from '@/plugins/firebaseInit'
import { store } from '@/store/store.js'
/*
async function getProfil () {
  await store.dispatch('cnx/loadProfil', { root: true })
}
fb.auth.onAuthStateChanged((user) => {
  if (user) {
    store.commit('cnx/setUser', user, {
      root: true
    })
    // store.dispatch('cnx/loadProfil', { root: true })
    console.log('debut profil')
    getProfil()
    console.log('fin profil')
  } else {
    store.dispatch('cnx/disconnect', { root: true })
  }
})
*/

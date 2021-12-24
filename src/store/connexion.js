import { fb } from '@/plugins/firebaseInit'

/*
    Définition des modèles base
*/
// gestion de l'environnement
const imgAvatarPath = 'image_avatar/'
const imgDefaut = 'IMG_DEFAUT.png'

const state = {
  user: null,
  currentProfil: {
    nom: null,
    prenom: null,
    loalisation: { adr: null, latLng: { lat: null, lng: null } }
  },
  profilLoaded: false
}

const actions = {

  //
  // ajout du profil sur création utilisateur
  async createProfil ({ state, dispatch }, data) {
    return fb.profilCollection
      .doc(data.user.uid)
      .set({
        nom: data.account.nom || data.user.email.split('@')[0], // use part of the email as a username
        prenom: data.account.prenom,
        email: data.user.email,
        organisation: data.account.organisation,
        adresse: data.account.adresse,
        cleAdmin: data.account.admin_key,
        photoURL: data.user.uid, // supply a default profile image for all users
        displayName: data.account.nom + ' ' + data.account.prenom
      })
      .catch((error) => {
        dispatch(
          'displayMessage',
          {
            code: 'CEPR',
            param: error.message
          },
          { root: true }
        )
      })
  },

  // maj de l'évent courant en base
  saveProfil ({ state }, dataProfil) {
    return new Promise((resolve, reject) => {
      let profil = JSON.parse(JSON.stringify(dataProfil))
      let execute = fb.profilCollection
        .doc(state.user.uid)
        .set(profil, { merge: true })
      execute.then(function (data) {
        resolve(data)
      })
      execute.catch(function (error) {
        reject(error)
      })
    })
  },

  //
  // procédure de création via service firebase.auth
  async userCreate ({ dispatch, commit }, account) {
    return fb.auth
      .createUserWithEmailAndPassword(account.email, account.password)
      .then(({ user }) => {
        commit('setUser', user.user)
        return dispatch('createProfil', { account, user })
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/email-already-in-use':
            dispatch(
              'displayMessage',
              {
                code: 'CEEM',
                param: ''
              },
              { root: true }
            )
            break
          default:
            dispatch(
              'displayMessage',
              {
                code: 'CEPR',
                param: error.message
              },
              { root: true }
            )
            break
        }
      })
  },

  //
  // procédure de connexion via firebase.auth
  userLogin (context, account) {
    return fb.auth
      .signInWithEmailAndPassword(account.email, account.password)
      .then((data) => {
        context.commit('setUser', data.user)
      })
  },

  disconnect ({ commit }) {
    return fb.auth.signOut().then(() => {
      commit('clearUser')
      commit('clearProfil')
    })
  },

  connexionUserGoogle (context) {
    let provider = new fb.authObj.GoogleAuthProvider()
    return fb.auth
      .signInWithPopup(provider)
      .then((result) => {
        context.commit('setUser', result.user)
      })
      .catch((err) => {
        console.log(err) // This will give you all the information needed to further debug any errors
      })
  },
  /*
     on peut savoir si un user est de type admin
     si cleAdmin de son profil correspond à un Id d'une  organisation
  */
  async isadmin ({ state, dispatch }) {
    await fb.orgaCollection
      .doc(state.currentProfil.cleAdmin)
      .get()
      .then((doc) => {
        if (doc.exists) state.currentProfil.cleAdmin = true
        else state.currentProfil.cleAdmin = false
      })
      .catch((error) => {
        dispatch(
          'displayMessage',
          {
            code: 'ADMIN',
            param: error
          },
          { root: true }
        )
      })
  },

  async loadProfil ({ state, dispatch, commit, getters }) {
    return new Promise((resolve, reject) => {
      if (getters.isAuthenticated && !getters.IsProfilLoaded) {
        console.log('chargement du profil')
        let profil = fb.profilCollection.doc(state.user.uid).get()
        profil
          .then((data) => {
            if (data.exists) {
              commit('setProfil', data.data())
              dispatch('isadmin')
            }
            resolve()
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  },
   async getProfilPhoto(state) {
     return new Promise((resolve, reject) => {
       if (state.currentProfil && state.currentProfil.photoURL) {
         resolve(state.currentProfil.photoURL)
       } else if (state.user && state.user.photoURL) {
         resolve(state.user.photoURL)
       } else {
         let urlRetourned = null
         fb.file
           .ref()
           .child(imgAvatarPath + imgDefaut)
           .getDownloadURL()
           .then(function (url) {
             resolve(url)
           })
           .catch((error) => { reject(error.message) })
       }
     })
  }
}
const mutations = {
  //
  // mémorisation d'un nutilisateur connecté

  clearUser (state) {
    state.user = null
    state.isconnected = false
  },
  setUser (state, connexion) {
    if (connexion) {
      state.user = connexion
      state.isconnected = true
    }
  },
  setProfil (state, profil) {
    state.currentProfil = profil
    state.profilLoaded = true
  },

  clearProfil (state) {
    state.currentProfil = {
      nom: null,
      prenom: null,
      loalisation: {}
    }
    state.profilLoaded = false
  }
}

const getters = {
  isAuthenticated (state) {
    return !!state.user
  },

  getUserUid (state) {
    return state.user.uid
  },

  getProfil (state) {
    return state.currentProfil
  },

  isProfilLoaded (state) {
    return state.profilLoaded
  },
  isAdmin (state) {
    return state.currentProfil.cleAdmin
  },
  getDefaultAvatarImg () {
    return imgAvatarPath + imgDefaut
  },
  geAvatarPath () {
    return imgAvatarPath
  },
  getAvatarImg (state) {
    return imgAvatarPath + state.user.uid
  },

  getDisplayName (state) {
    if (state.user.displayName) return state.user.displayName
    else return null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

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
    loalisation: { adr: null, latLng: { lat: null, lng: null } },
    theme: { name: null, drak: false },
    alerte: { date: null, categorie: null, activate: false }
  },
  profilLoaded: false,
  isconnected: false
}

const actions = {
  //
  // gestion de l'alerting
  alertingEvent ({ rootState, state }) {},
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
      console.log('save profil')
      console.log(dataProfil)
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
    if (state.currentProfil.cleAdmin) {
      await fb.orgaCollection
        .doc(state.currentProfil.cleAdmin)
        .get()
        .then((doc) => {
          if (doc.exists) state.currentProfil.cleAdmin = doc.id
          else state.currentProfil.cleAdmin = null
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
    }
  },

  loadProfil ({ state, dispatch, commit, getters }) {
    console.log(
      'appel loadProfil' +
        getters.isAuthenticated +
        ' ' +
        getters.isProfilLoaded
    )
    return new Promise((resolve, reject) => {
      if (getters.isAuthenticated && !getters.isProfilLoaded) {
        console.log('before await')
        fb.profilCollection
          .doc(state.user.uid)
          .get()
          .then((data) => {
            console.log('after await')
            commit('setProfil', data.data())
            dispatch('getProfilPhoto')
            dispatch('isadmin')
            resolve(true)
          })
      } else {
        resolve(true)
      }
    })
  },
  async getProfilPhoto ({ state }) {
    if (state.currentProfil && state.currentProfil.photoURL) {
    } else if (state.user && state.user.photoURL) {
    } else {
      let urlRetourned = await fb.file
        .ref()
        .child(imgAvatarPath + imgDefaut)
        .getDownloadURL()
      state.currentProfil.photoURL = urlRetourned.url
    }
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
    console.log('connexion user' + connexion)
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
    return state.isconnected
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
  },
  getThemeProfilName (state) {
    return typeof state.currentProfil.theme.name === 'undefined'
      ? null
      : state.currentProfil.theme.name
  },
  getThemeProfilMode (state) {
    return typeof state.currentProfil.theme.dark === 'undefined'
      ? null
      : state.currentProfil.theme.dark
  },
  getAlerteDate (state) {
    return typeof state.currentProfil.alerte.date === 'undefined'
      ? null
      : state.currentProfil.alerte.date
  },
  getAlerteCategorie (state) {
    return typeof state.currentProfil.alerte.categorie === 'undefined'
      ? null
      : state.currentProfil.alerte.categorie
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

import { fb } from '@/plugins/firebaseInit'

/*
    Définition des modèles base
*/
// gestion de l'environnement
const imgAvatarPath = 'image_avatar/'
const imgDefaut = 'IMG_DEFAUT.png'
const defaultProfil = {
  nom: null,
  prenom: null,
  email: null,
  displayName: null,
  cleAdmin: null,
  photoURL: null,
  loalisation: { adr: null, latLng: { lat: null, lng: null } },
  theme: { name: null, drak: false },
  alerte: { date: null, categorie: null, activate: false }
}

const state = {
  user: null,
  currentProfil: {
    nom: null,
    prenom: null,
    email: null,
    displayName: null,
    cleAdmin: null,
    photoURL: null,
    loalisation: { adr: null, latLng: { lat: null, lng: null } },
    theme: { name: null, drak: false },
    alerte: { date: null, categorie: null, activate: false }
  },
  userAlert: [],
  profilLoaded: false,
  isconnected: false
}

const actions = {
  //
  // gestion de l'alerting
  getAlertingUser ({ state }) {
    let userAlert = []
    return new Promise((resolve, reject) => {
      fb.profilCollection
        .where('alerte.activate', '==', true)
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function data (result) {
            let values = {
              alert: result.data().alerte,
              email: result.data().email
            }
            userAlert.push(values)
          })
          resolve(userAlert)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  //
  // ajout du profil sur création utilisateur
  // data.user => récuépration des infos firebase après cration compte
  // data.account => infos du formulaire de création du compte
  async createProfil ({ state, dispatch }, data) {
    return new Promise((resolve, reject) => {
      fb.profilCollection
        .doc(data.user.uid)
        .set({
          nom: data.account.nom,
          prenom: data.account.prenom,
          email: data.account.email,
          organisation: data.account.organisation,
          adresse: data.account.adresse,
          cleAdmin: null,
          photoURL: null,
          displayName: data.account.nom + ' ' + data.account.prenom,
          theme: data.account.theme,
          alerte: data.account.alerte
        })
        .then((data) => {
          resolve(true)
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
          reject(error)
        })
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
    return new Promise((resolve, reject) => {
      fb.auth
        .createUserWithEmailAndPassword(account.email, account.password)
        .then(({ user }) => {
          commit('setUser', user.user)
          dispatch('createProfil', { account, user })
            .then(() => resolve(true))
            .catch((error) => reject(error))
        })
        .catch((error) => {
          // gestion des codes erreurs
          switch (error.code) {
            case 'auth/email-already-in-use':
              dispatch(
                'displayMessage',
                {
                  code: 'CEPR',
                  param: 'cet email est déjà attribué'
                },
                { root: true }
              )
              reject(error)
              break
            case 'auth/weak-password':
              dispatch(
                'displayMessage',
                {
                  code: 'CEPR',
                  param: 'mot de passe inférieur à 6 caractères'
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
              reject(error)
              break
          }
        })
    })
  },

  //
  // procédure de connexion via firebase.auth
  userLogin (context, account) {
    return new Promise((resolve, reject) => {
      fb.auth
        .signInWithEmailAndPassword(account.email, account.password)
        .then((data) => {
          context.commit('setUser', data.user)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  async disconnect ({ commit }) {
    await fb.auth.signOut()
    commit('clearUser')
    commit('clearProfil')
  },

  connexionUserGoogle (context) {
    // appel a provider google
    return new Promise((resolve, reject) => {
      let provider = new fb.authObj.GoogleAuthProvider()
      fb.auth
        .signInWithPopup(provider)
        .then((result) => {
          console.log('cnxGoogle')
          // connexion réussi
          // on regarder si profil initialisé
          console.log(result)
          context.commit('setUser', result.user)
          resolve(true)
        })
        .catch((err) => {
          console.log(err) // This will give you all the information needed to further debug any errors
          reject(err)
        })
    })
  },

  connexionUserFacebook (context) {
    // appel a provider google
    return new Promise((resolve, reject) => {
      let provider = new fb.authObj.FacebookAuthProvider()
      fb.auth
        .signInWithPopup(provider)
        .then((result) => {
          console.log('cnxfacebook')
          // connexion réussi
          // on regarder si profil initialisé
          console.log(result)
          context.commit('setUser', result.user)
          resolve(true)
        })
        .catch((err) => {
          console.log(err) // This will give you all the information needed to further debug any errors
          reject(err)
        })
    })
  },

  /*
     on peut savoir si un user est de type admin
     si cleAdmin de son profil correspond à un Id d'une  organisation
  */
  isadmin ({ state, dispatch }) {
    if (state.currentProfil.cleAdmin) {
      fb.orgaCollection
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
            if (data.exists) {
              console.log('after await' + data.exists)

              commit('setProfil', data.data())
            } else {
              // profil par defaut
              console.log('default profil')
              commit('setProfil', defaultProfil)
            }
            dispatch('getProfilPhoto')
              .then(() => {
                dispatch('isadmin')
                resolve(true)
              })
              // erreur sur chargement de la photo
              .catch((error) => {
                reject(error)
              })
          })
          // erreur sur chargement du profil
          .catch((error) => {
            reject(error)
          })
      } else {
        resolve(true)
      }
    })
  },
  getProfilPhoto ({ state }) {
    console.log(state.currentProfil + state.currentProfil.photoURL)
    return new Promise((resolve, reject) => {
      // sur une connexion google user conitent l'url de la photo
      if (state.user.photoURL) {
        state.currentProfil.photoURL = state.user.photoURL
        resolve()
      }
      if (!state.currentProfil.photoURL) {
        fb.file
          .ref()
          .child(imgAvatarPath + imgDefaut)
          .getDownloadURL()
          .then((url) => {
            state.currentProfil.photoURL = url
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        resolve()
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
    return !!state.currentProfil.cleAdmin
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

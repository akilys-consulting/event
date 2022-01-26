import { fb } from '@/plugins/firebaseInit'

/*
    Définition des modèles base
*/
// gestion de l'environnement
const imgAvatarPath = 'image_avatar/'
const imgDefaut = 'IMG_DEFAUT.png'
const defaultProfil = {
  nom: '',
  prenom: '',
  email: '',
  displayName: '',
  cleAdmin: '',
  photoURL: '',
  localisation: { adr: null, latLng: { lat: null, lng: null } },
  theme: { name: 'defaut', dark: false },
  alerte: { date: null, categorie: '', activate: false }
}

const state = {
  user: null,
  currentProfil: {
    nom: '',
    prenom: '',
    email: '',
    displayName: '',
    cleAdmin: '',
    photoURL: '',
    localisation: { adr: '', latLng: { lat: null, lng: null } },
    theme: { name: '', dark: false },
    alerte: { date: null, categorie: '', activate: false }
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
  createProfil ({ dispatch }, data) {
    return new Promise((resolve, reject) => {
      console.log('createProfil')

      fb.profilCollection
        .doc(data.user.uid)
        .set({
          nom: data.account.nom,
          prenom: data.account.prenom,
          email: data.account.email,
          adresse: data.account.localisation,
          cleAdmin: null,
          photoURL: null,
          displayName: data.account.displayName,
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
    console.log(account)
    return new Promise((resolve, reject) => {
      fb.auth
        .createUserWithEmailAndPassword(account.email, account.password)
        .then(({ user }) => {
          // mémorisation user dans le store
          commit('setUser', user.user)
          // création du profil du nouvel utilisateur
          dispatch('createProfil', { account, user })
            .then(() => {
              // tout est ok on repart sur le SignUp
              resolve(true)
            })
            .catch((error) => {
              // permet de capturer les gorsses erreurs (définition objet incorrect sur profil)
              reject(error)
            })
        })
        .catch((error) => {
          // gestion des codes erreurs
          switch (error.code) {
            case 'auth/invalid-email':
              dispatch(
                'displayMessage',
                {
                  code: 'CEPR',
                  param: "cet email n'est pas reconnue"
                },
                { root: true }
              )
              reject(error)
              break
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
              reject(error)

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
          let message = { code: 'ECNX', param: '' }
          console.log('error.code' + error.code)
          switch (error.code) {
            case 'auth/user-not-found':
              message.param = 'utilisateur inconu'
              break
            case 'auth/invalid-email':
              message.param = 'email non valide'
              break
            case 'auth/invalid-password':
              message.param = 'mote de passe incorrect'
              break
            default:
              message.param = error.code
              message.code = 'ADMIN'
              break
          }
          context.dispatch('displayMessage', message, { root: true })

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
    console.log(state.currentProfil + ' ' + state.currentProfil.photoURL)
    return new Promise((resolve, reject) => {
      // sur une connexion google user conitent l'url de la photo
      if (state.user.photoURL) {
        state.currentProfil.photoURL = state.user.photoURL
        resolve()
      }
      // on a pas de photo venant du compte user donc on regarde dans le profil
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
  },
  // fonction de modification de l'email d'un utilisateur
  updateEmail ({ state, dispatch }, newEmail) {
    let user = fb.auth.currentUser

    user
      .updateEmail(newEmail)
      .then(() => {
        state.currentProfil.email = newEmail
        dispatch
          .saveProfil(state.currentProfil)
          .then(() => {
            dispatch(
              'displayMessage',
              {
                code: 'CNEM',
                param: newEmail
              },
              { root: true }
            )
            dispatch('disconnect')
          })
          .catch((error) => {
            dispatch(
              'displayMessage',
              {
                code: 'ADMIN',
                param: error.message
              },
              { root: true }
            )
          })
      })
      .catch((error) => {
        // gestion des codes erreurs
        switch (error.code) {
          case 'auth/invalid-email':
            dispatch(
              'displayMessage',
              {
                code: 'MEPR',
                param: "cet email n'est pas valide"
              },
              { root: true }
            )
            break
          case 'auth/email-already-in-use':
            dispatch(
              'displayMessage',
              {
                code: 'MEPR',
                param: 'cet email est déjà utilisé'
              },
              { root: true }
            )
            break
          case 'auth/requires-recent-login':
            dispatch(
              'displayMessage',
              {
                code: 'MEPR',
                param: 'cet email était déjà votre ancien email'
              },
              { root: true }
            )
            break
        }
      })
  },
  // fonction de modification de l'email d'un utilisateur
  async updatePassword ({ state, dispatch }, newPassword) {
    let user = fb.auth.currentUser

    await user
      .updatePassword(newPassword)
      .then(() => {
        dispatch(
          'displayMessage',
          {
            code: 'CNPW',
            param: null
          },
          { root: true }
        )
        dispatch('disconnect')
      })
      .catch((error) => {
        // gestion des codes erreurs
        switch (error.code) {
          case 'auth/weak-password':
            dispatch(
              'displayMessage',
              {
                code: 'MEPR',
                param: 'le mot de passe est trop simple'
              },
              { root: true }
            )
            break
          case 'auth/requires-recent-login':
            dispatch(
              'displayMessage',
              {
                code: 'MEPR',
                param: 'vous etes connecté depuis trop longtemps'
              },
              { root: true }
            )
            break
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
    state.currentProfil = JSON.parse(JSON.stringify(defaultProfil))
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

import firebase from 'firebase'

/*
    Définition des modèles base
*/

const state = {
  user: null,
  profil: { nom: '', prenom: '' }
}

const actions = {
  //
  // ajout du profil sur création utilisateur
  async createProfil ({ state, dispatch }, data) {
    return await firebase
      .firestore()
      .collection('profil')
      .doc(data.user.uid)
      .set({
        nom: data.account.nom || data.user.email.split('@')[0], // use part of the email as a username
        prenom: data.account.prenom,
        email: data.user.email,
        organisation: data.account.organisation,
        adresse: data.account.adresse,
        image: '/logo.png' // supply a default profile image for all users
      })
      .catch(error => {
        dispatch(
          'displayMessage',
          {
            code: 'CEPR',
            param: error.message
          },
          { root: true }
        )
        throw 'errProfil'
      })
  },

  //
  // procédure de création via service firebase.auth
  async userCreate ({ dispatch }, account) {
    let self = this
    return await firebase
      .auth()
      .createUserWithEmailAndPassword(account.email, account.password)
      .then(({ user }) => {
        return dispatch('createProfil', { account, user })
      })
      .catch(error => {
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
            throw 'emailExist'

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
  userLogin ({ dispatch }, account) {
    return firebase
      .auth()
      .signInWithEmailAndPassword(account.email, account.password)
      .then(user => {
        return dispatch('setUser', user)
      })
  },
  disconnect ({ commit }) {
    return new Promise((resolve, reject) => {
      firebase
        .auth()
        .signOut()
        .then(() => {
          commit('clearUser')
        })
        .catch(err => {
          reject(err)
        })
    })
  },
  setUser ({ state }, connexion) {
    state.user = connexion
    // return this.dispatch('createProfil', `profil/${state.user.uid}`)
  },
  loadUser ({ state }) {
    return firebase
      .firestore()
      .collection('profil')
      .doc(state.user.uid)
      .get()
  }
}

const mutations = {
  //
  // mémorisation d'un nutilisateur connecté

  clearUser (state) {
    state.user = null
  }
}

const getters = {
  isAuthenticated (state) {
    return !!state.user
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

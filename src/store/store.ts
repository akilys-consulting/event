import Vue from 'vue'
import Vuex from 'vuex'
import { fb } from '@/firebaseDef.js'
import { messages } from '@/messages/messages'
import storeEvent from '@/store/event.ts'

Vue.use(Vuex)

// contrôle de la connexion
const user = fb.auth.onAuthStateChanged(user => {
  if (user) store.commit('setCurrentUser', user)
  else store.commit('initModifUser')
})

// gestion de l'environnement
const imgAvatarPath = 'image_avatar/'
const imgDefaut = 'IMG_DEFAUT.jpg'
const userType = ['client', 'commercial', 'admin']

export const store = new Vuex.Store({
  modules: {
    event: storeEvent
  },
  /*
  définition d'un user */

  state: {
    display: false,
    modifUser: false,
    currentUser: Object,
    waiting: false,
    message: {
      display: false,
      message: 'Oups, je vais disparaitre',
      timeout: 3000,
      type: 'success'
    },
    question: {
      display: false,
      message: 'Oups, je vais disparaitre',
      type: 'question'
    },
    currentProfil: {
      nom: String,
      prenom: String,
      adresse: Object,
      organisation: String,
      user_uid: String
    },
    emailParam: {
      template: 'template_W2ROE7Xi',
      profil: 'gmail',
      account: 'user_ykRUBR3yHvO1VOlIU0z2V',
      adrAdmin: 'akilys.consulting@gmail.com'
    },
    cart: Array,
    currentResa: false,
    currentCmd: { resa: { stand: null } },
    DisplayDetailEmplacement: false, // affichage fenetre détail emplacement
    countStand: 0,
    numCmd: 1,
    remiseMode: false,
    paypalData: {}
  },

  actions: {
    /*
      on efface le user courant
    */
    clearData ({ commit }) {
      commit('setCurrentUser', false)
    },
    /*
      récupération du profil de connexion et mémorisation
    */
    async fetchUserProfile ({ commit, state }) {
      let self = this
      const request = new Promise((resolve, reject) => {
        if (typeof state.currentUser.uid === 'undefined') return false
        fb.clientCollection
          .where('user_uid', '==', state.currentUser.uid)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              // doc.data() is never undefined for query doc snapshots
              state.currentProfil = doc.data()
              resolve(doc.data())
            })
          })
          .catch(err => {
            self.dispatch('displayMessage', { code: 'LUKO' })
            reject(err)
          })
      })
      return await request
    },
    /*
      récupération d'un profil user (à partir du userid
    */
    getUserData (state, userUid) {
      let self = this
      return new Promise((resolve, reject) => {
        const execute = fb.clientCollection
          .where('user_uid', '==', userUid)
          .get()
        execute.then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            // doc.data() is never undefined for query doc snapshots
            resolve(doc.data())
          })
        })
        execute.catch(err => {
          self.dispatch('displayMessage', 'LUKO')
          reject(err)
        })
      })
    },

    // démarrage de la barre d'attente
    startWaiting ({ commit }) {
      commit('setWaiting', true)
    },

    // arrêt de la barre d'attente
    stopWaiting ({ commit }) {
      commit('setWaiting', false)
    },

    // declenche l'affichage d'un message
    displayMessage ({ commit }, param) {
      for (var i = 0; i < messages.length; i++) {
        if (messages[i]['code'] == param.code) {
          let displayedmessage = messages[i]
          console.log('error' + param.param)
          if (typeof param.param !== 'undefined') {
            displayedmessage.message = messages[i].message.replace(
              '[PARAM]',
              param.param
            )
          }
          commit('setMessage', displayedmessage)
          i = messages.length
        }
      }
    },
    // declenche l'affichage d'un message
    displayQuestion ({ commit }, code) {
      for (var i = 0; i < messages.length; i++) {
        if (messages[i]['code'] === code) {
          commit('setQuestion', messages[i])
          i = messages.length
        }
      }
    },
    getEmailUser () {
      var user = fb.auth.currentUser
      if (user) {
        return user.email
      } else return false
    },
    updateEmailUser (state, email) {
      return new Promise((resolve, reject) => {
        var user = fb.auth.currentUser
        user
          .updateEmail(email)
          .then(function () {
            resolve(true)
          })
          .catch(function (error) {
            reject(error)
          })
      })
    },
    getAvatarFile ({ state }, id) {
      let findUser = null
      if (!id) findUser = state.currentUser.uid
      else findUser = id
      return new Promise((resolve, reject) => {
        const execute = fb.file
          .ref()
          .child(imgAvatarPath + findUser)
          .getDownloadURL()
        execute.then(function (url) {
          resolve(url)
        })
        execute.catch(function () {
          fb.file
            .ref()
            .child(imgAvatarPath + imgDefaut)
            .getDownloadURL()
            .then(function (url) {
              resolve(url)
            })
            .catch(error => {
              reject(error)
            })
        })
      })
    },
    saveImg (context, file) {
      return new Promise((resolve, reject) => {
        if (typeof file !== 'undefined') {
          var storageRef = fb.file.ref()
          storageRef.child(file.rep + '/' + file.name).put(file.file)
          storageRef.then(function (snapshot) {
            const data = snapshot.ref.getDownloadURL()
            data.then(path => {
              resolve(path)
            })
            data.catch(error => {
              reject(error)
            })
          })
          storageRef.catch(error => {
            reject(error)
          })
        }
      })
    },
    /*
      ajout d'un profil utilisateur
      nom,prenom,user_uid(auth),organisation,adresse
    */
    async addProfil ({ state }, userData) {
      let request = new Promise((resolve, reject) => {
        const execute = fb.clientCollection.add(state.currentProfil)
        execute.then(() => {
          resolve()
        })
        execute.catch(err => {
          reject(err)
        })
      })
      return await request
    },

    /*
      modification d'un profil utilisateur
    */
    updateUser (context, userData) {
      let id = userData.id
      delete userData.id
      return new Promise((resolve, reject) => {
        const execute = fb.clientCollection.doc(id).update(userData)
        execute.then(() => {
          resolve()
        })
        execute.catch(err => {
          reject(err)
        })
      })
    },
    /*
      modification d'un profil utilisateur
    */
    deleteUser (context, userData) {
      return new Promise((resolve, reject) => {
        const execute = fb.clientCollection.doc(userData.id).delete(userData)
        execute.then(() => {
          resolve()
        })
        execute.catch(err => {
          reject(err)
        })
      })
    },
    disconnect ({ context }) {
      let self = this
      return new Promise((resolve, reject) => {
        let user = fb.auth
          .signOut()
          .then(() => {
            self.dispatch('clearData')
            resolve()
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  },

  mutations: {
    setDisplayMenuOff (state) {
      state.display = false
    },
    setDisplayMenuOn (state) {
      state.display = true
    },
    /* une modification donnée a été faite */
    setModifUser (state) {
      state.modifUser = true
    },

    /* réinitialisation des modif écran */
    initModifUser (state) {
      state.modifUser = false
    },

    /* configuration de l'utilisateur connecté */
    setCurrentUser (state, val) {
      state.currentUser = val
    },

    setInitUser (state) {
      state.currentUser = null
      state.profil = null
    },

    /* configuration du profil courant */
    async setUserProfile (state, val) {
      state.currentProfil = val
    },

    /* etat affichage info de chargement */
    setWaiting (state, val) {
      state.waiting = val
    },

    /* init message à afficher */
    setMessage (state, message) {
      state.message.display = true
      state.message.message = message.message
      state.message.type = message.type
    },
    /* init message à afficher */
    setQuestion (state, message) {
      state.question.display = true
      state.question.message = message.message
      state.question.type = message.type
    },
    setInitQuestion (state) {
      state.question = {}
    }
  },
  getters: {
    getQuestion (state) {
      return state.question
    },

    isconnected (state) {
      if (typeof state.currentUser.uid === 'undefined') return false
      else return true
    },
    getProfil (state) {
      return state.currentProfil
    },
    getOrganisation (state) {
      return state.currentProfil.organisation
    },

    getUserUid (state) {
      return state.currentUser.uid
    },
    isAdmin (state) {
      if (state.currentUser) {
        if (
          typeof state.currentProfil.organisation === 'undefined' ||
          state.currentProfil.organisation === ''
        ) {
          return false
        } else return true
      } else return false
    },
    getUserInfo (state) {
      return state.currentUser
    },
    /* management des modif données */
    getModifUser (state) {
      return state.modifUser
    },
    getCurrentAvatarImg (state) {
      if (state.currentUser.uid) return imgAvatarPath + state.currentUser.uid
      else return imgAvatarPath + imgDefaut
    },
    getDefaultAvatarImg (state) {
      return imgAvatarPath + imgDefaut
    }
  }
})
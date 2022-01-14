import Vue from 'vue'
import Vuex from 'vuex'
import { fb } from '@/plugins/firebaseInit'
import { messages } from '@/messages/messages'
import storeEvent from '@/store/event.js'
import storeConnexion from '@/store/connexion.js'
import storePlan from '@/store/plan.js'

Vue.use(Vuex)

// gestion de l'environnement
const imgAvatarPath = 'image_avatar/'
const imgDefaut = 'IMG_DEFAUT.jpg'

export const store = new Vuex.Store({
  modules: {
    event: storeEvent,
    cnx: storeConnexion,
    plan: storePlan
  },
  /*
  définition d'un user */

  state: {
    display: false,
    waiting: false,
    modificationEnCours: false,
    message: {
      display: false,
      message: 'Oups, je vais disparaitre',
      timeout: 3000,
      type: 'success'
    },
    question: {
      display: false,
      message: 'Oups, je vais disparaitre'
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
    paypalData: {},
    themes: [
      {
        name: 'vert',
        dark: {
          primary: '#90AB47',
          accent: '#9FD656',
          secondary: '#9FED6B',
          success: '#74F25A',
          info: '#BCEDAD',
          warning: '#EB6D00',
          error: '#A31435'
        },
        light: {
          primary: '#1976D2',
          accent: '#9D00E0',
          secondary: '#30b1dc',
          success: '#4CAF50',
          info: '#2196F3',
          warning: '#FB8C00',
          error: '#FF5252'
        }
      },
      {
        name: 'marron',
        dark: {
          primary: '#7F5636',
          accent: '#B6D173',
          secondary: '#D1905E',
          success: '#43A047',
          info: '#78909C',
          warning: '#FB8C00',
          error: '#E65100'
        },
        light: {
          primary: '#ffa450',
          accent: '#9D00E0',
          secondary: '#92de4e',
          success: '#6dff74',
          info: '#7365ff',
          warning: '#2e8ac0',
          error: '#ff5e3c'
        }
      }
    ]
  },

  actions: {
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
          if (param && typeof param.param !== 'undefined') {
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
    displayQuestion ({ commit }, param) {
      for (var i = 0; i < messages.length; i++) {
        if (messages[i]['code'] === param.code) {
          let displayedmessage = messages[i]
          if (param && typeof param.param !== 'undefined') {
            displayedmessage.message = messages[i].message.replace(
              '[PARAM]',
              param.param
            )
          }
          commit('setQuestion', displayedmessage)
          i = messages.length
        }
      }
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
            .catch((error) => {
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
            data.then((path) => {
              resolve(path)
            })
            data.catch((error) => {
              reject(error)
            })
          })
          storageRef.catch((error) => {
            reject(error)
          })
        }
      })
    }
  },

  mutations: {
    setModifUser (state) {
      state.modificationEnCours = true
    },
    initModifUser (state) {
      state.modificationEnCours = false
    },
    setDisplayMenuOff (state) {
      console.log()
      state.display = false
    },
    setDisplayMenuOn (state) {
      state.display = true
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

    getUserUid (state) {
      return state.currentUser.uid
    },

    getUserInfo (state) {
      return state.currentUser
    },
    /* management des modif données */
    getModifUser (state) {
      return state.modificationEnCours
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

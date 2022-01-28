import { fb } from '@/plugins/firebaseInit'
import moment from 'moment'

/*
    Définition des modèles base
*/

const DEFINE_EVENT = {
  id: -1,
  nom: null,
  localisation: { adr: '', latLgn: { lat: 0, long: 0 } },
  plan: null,
  planning: [],
  minisite: null,
  like: 0
}

const state = {
  currentEventId: null,
  // pemret de stocker l'event courant ( event + programmation)
  currentEvent: {
    id: -1,
    nom: null,
    localisation: { adr: '', latLgn: { lat: 0, long: 0 } },
    plan: null,
    planning: [],
    minisite: null,
    prix: null,
    like: [],
    categorie: null,
    organisateur: null,
    organisation: null
  },

  // mémorise la plannifiation à partir de a programmation
  planning: [],
  // utiliser pour définir le type de programmation
  typeProgrammation: [
    { value: 'days', text: 'journalier' },
    { value: 'weeks', text: 'hebdomadaire' },
    { value: 'months', text: 'mensuel' }
  ],

  // critère de recherche des events
  EVT_SRCH_CAT: null,
  EVT_SRCH_CRITERE: '',
  EVT_SRCH_DT: null,
  EVT_ACTIVE_SEARCH: false,
  EVT_SRCH_GRATUIT: false,
  EVT_SRCH_ENFANT: false,

  // permet de charger en mémoire tous les events
  events: [],
  // permet de définir les catégories
  CONST_CATEGORIE: [
    { nom: 'culture', couleur: 'orange darken-1', icon: '', master: 1 },
    { nom: 'loisir', couleur: 'deep-purple lighten-2', icon: '', master: 0 },
    { nom: 'restaurant', couleur: 'brown lighten-1', icon: '', master: 0 },
    { nom: 'sport', couleur: 'pink lighten-3', icon: '', master: 0 },
    { nom: 'theatre', couleur: 'indigo lighten-3', icon: '', master: 1 },
    { nom: 'musique', couleur: 'light-green lighten-3', icon: '', master: 1 },
    { nom: 'expositions', couleur: 'teal lighten-2', icon: '', master: 0 }
  ],
  CONST_RESIZE_HEIGHT: 230,
  CONST_RESIZE_WIDTH: 320,
  currentPlanning: null,
  searchPlanningId: null,
  currentImgUrl: null,
  ActiveEmailWin: false
}

const actions = {
  // sauvegarde de l'évent courant en base
  saveEvent ({ state, dispatch }) {
    return new Promise((resolve, reject) => {
      if (state.currentEvent.id === -1) {
        dispatch('insertEvent')
          .then((data) => {
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      } else {
        dispatch('updateEvent')
          .then((data) => {
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
      }
    })
  },
  // ajout de l'event courant en base
  importEvent ({ rootState }, data) {
    return new Promise((resolve, reject) => {
      let event = JSON.parse(JSON.stringify(data))
      delete event.id
      if (typeof rootState.cnx.currentProfil.cleAdmin !== 'undefined') {
        event.cleAdmin = rootState.cnx.currentProfil.cleAdmin
      }
      let execute = fb.eventCollection.add(event)
      execute.then(function (data) {
        state.currentEvent.id = data.id
        resolve(data)
      })
      execute.catch(function (error) {
        reject(error)
      })
    })
  },

  // ajout de l'event courant en base
  insertEvent ({ rootState }) {
    return new Promise((resolve, reject) => {
      let event = JSON.parse(JSON.stringify(state.currentEvent))
      delete event.id
      if (typeof rootState.cnx.currentProfil.cleAdmin !== 'undefined') {
        event.cleAdmin = rootState.cnx.currentProfil.cleAdmin
      }
      let execute = fb.eventCollection.add(event)
      execute.then(function (data) {
        state.currentEvent.id = data.id
        resolve(data)
      })
      execute.catch(function (error) {
        reject(error)
      })
    })
  },
  // maj de l'évent courant en base
  updateEvent ({ rootState }) {
    return new Promise((resolve, reject) => {
      let event = JSON.parse(JSON.stringify(state.currentEvent))
      let currentID = event.id
      delete event.id
      if (typeof rootState.cnx.currentProfil.organisation !== 'undefined') {
        event.organisation = rootState.cnx.currentProfil.organisation
      }

      let execute = fb.eventCollection.doc(currentID).update(event)
      execute.then(function (data) {
        resolve(data)
      })
      execute.catch(function (error) {
        reject(error)
      })
    })
  },
  // chargement des events et du planning depuis les events en base
  loadOnePlanning ({ state, dispatch, rootState, rootGetters }, eventID) {
    state.events = []
    state.planning = []
    // récupération du profil
    return new Promise((resolve, reject) => {
      let execute = fb.eventCollection
      if (eventID) {
        execute = execute.doc(eventID)
      }
      console.log('event ' + eventID)
      execute
        .get()
        .then((doc) => {
          if (doc.exists) {
            let record = doc.data()
            record.id = doc.id
            state.events.push(record)
            // on décode la programmation pour définir un planning
            dispatch('decodePlanning', record)
            resolve(true)
          } else reject(false)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  // chargement des events en mémoire depuis la base
  loadEvent ({ state }) {
    state.events = []
    state.calendar = []
    return new Promise((resolve, reject) => {
      const execute = fb.eventCollection.get()
      execute.then(function (querySnapshot) {
        querySnapshot.forEach(function data (result) {
          let record = result.data()
          record.id = result.id
          state.events.push(record)
        })

        resolve()
      })
      execute.catch((error) => {
        reject(error)
      })
    })
  },
  // chargement des events et du planning depuis les events en base
  loadPlanning ({ state, dispatch, rootState, rootGetters }) {
    state.events = []
    state.planning = []
    // récupération du profil
    return new Promise((resolve, reject) => {
      let execute = fb.eventCollection
      if (
        rootGetters['cnx/isProfilLoaded'] &&
        rootState.cnx.currentProfil.cleAdmin
      ) {
        execute = execute.where(
          'cleAdmin',
          '==',
          rootState.cnx.currentProfil.cleAdmin
        )
      }
      execute
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function data (result) {
            let record = result.data()
            record.id = result.id
            state.events.push(record)
            // on décode la programmation pour définir un planning
            dispatch('decodePlanning', record)
          })
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // parcours la programmation afin de définir toutes les dates
  // de l'évènement
  // met à jour le state planning
  decodePlanning ({ state, getters }, event) {
    let record = event
    if (event.planning.length > 0) {
      event.planning.forEach((prog) => {
        let currentDate = moment(prog.dtDebut)
        let finDate = moment(prog.dtFin)
        let guard = 0
        while (currentDate <= finDate && guard++ <= 4000) {
          let planningId = record.id + guard
          // creation de l'évènement
          if (currentDate.isAfter()) {
            let newPlanning = {
              id: planningId,
              eventid: record.id,
              color: getters.getColorCategorie(record.categorie),
              category: record.categorie,
              name: record.nom,
              enfant: record.enfant,
              prix: record.prix,
              start: currentDate.format('YYYY-MM-DD') + ' ' + prog.heureDebut,
              end: currentDate.format('YYYY-MM-DD') + ' ' + prog.heureFin
            }
            state.planning.push(newPlanning)
          }
          currentDate = currentDate.add(1, prog.type)
        }
      })
    }
  },

  addLike2Event ({ state, dispatch }, event) {
    console.log('id' + event.id)
    console.log(event.like)
    let eventDoc = fb.eventCollection.doc(event.id)
    eventDoc.update({ like: event.like }).catch((error) => {
      dispatch(
        'displayMessage',
        { code: 'ADMIN', param: error.message },
        { root: true }
      )
    })
  },

  ManageAlerte ({ state, dispatch }) {
    // on analyse l'event qui vient d'être créé
    return new Promise((resolve, reject) => {
      dispatch('decodePlanning', state.currentEvent)
      // les données sont dans state.planning
      // il faut maintenent retrouver les enresitrements qui corrspondent à des alertes
      dispatch('cnx/getAlertingUser', null, { root: true })
        .then((alertes) => {
          // on recherche les alertes qui match
          state.planning.forEach((data) => {
            alertes.forEach((alert) => {
              if (
                alert.alert.date === data.start.substring(0, 10) &&
                alert.alert.categorie === data.category
              ) {
                /* let templateParams = {
                  event_contact: alert.email,
                  event_name: data.name,
                  date_debut: data.start,
                  date_fin: data.end,
                  event_adr: state.currentEvent.localisation.adr,
                  event_description: state.currentEvent.minisite
                }
                 emailjs.init('user_ykRUBR3yHvO1VOlIU0z2V')
                emailjs
                  .send('gmail', 'template_buy6lvg', templateParams)
                  .catch((error) => {
                    reject(error)
                  }) */
              }
            })
          })
          resolve(true)
        })
        .catch((error) => {
          reject(error)
        })
      // les alertes user sont chargées dans state
    })
  }
}
const mutations = {
  // vider l'event courant
  setInitEvent (state) {
    state.currentEvent = JSON.parse(JSON.stringify(DEFINE_EVENT))
  },
  setEvent (state, data) {
    state.currentEvent = JSON.parse(JSON.stringify(data))
  },
  setPlanning (state, data) {
    state.currentEvent.planning = JSON.parse(JSON.stringify(data))
  },

  // definir l'event courant
  setCurrentEventByPlanning (state, planning) {
    state.currentEvent = state.events.find((element) => element.id === planning)
  },

  // ajout d'une image à l'event courant
  setAddEventImg (state, nvlImg) {
    state.currentEvent.images.push(nvlImg.path)
  },

  setActiveEmailWin (state) {
    state.ActiveEmailWin = !state.ActiveEmailWin
  },

  setActiveSearch (state) {
    state.EVT_ACTIVE_SEARCH = true
  },
  clearActiveSearch (state) {
    state.EVT_ACTIVE_SEARCH = false
  },
  setEVT_SRCH_CAT (state, value) {
    state.EVT_SRCH_CAT = value
  },
  setEVT_SRCH_DT (state, value) {
    state.EVT_SRCH_DT = value
  },
  setEVT_SRCH_CRITERE (state, value) {
    state.EVT_SRCH_CRITERE = value
  },
  setEVT_SRCH_GRATUIT (state, value) {
    state.EVT_SRCH_GRATUIT = value
  },
  setEVT_SRCH_ENFANT (state, value) {
    state.EVT_SRCH_ENFANT = value
  }
}

const getters = {
  // retourne les catégories
  getCategories (state) {
    return state.CONST_CATEGORIE
  },
  getCategoriesMaster (state) {
    return state.CONST_CATEGORIE.filter((element) => {
      return element.master === 1
    })
  },
  getCategoriesSecondaries (state) {
    return state.CONST_CATEGORIE.filter((element) => {
      return element.master != 1
    })
  },
  getColorCategorie: (state) => (cat) => {
    return state.CONST_CATEGORIE.find((x) => x.nom === cat).couleur
  },
  getEVT_SRCH_CAT (state) {
    return state.EVT_SRCH_CAT
  },
  getEVT_SRCH_DT (state) {
    return state.EVT_SRCH_DT
  },
  getEVT_SRCH_CRITERE (state) {
    return state.EVT_SRCH_CRITERE
  },
  getEVT_SRCH_GRATUIT (state) {
    return state.EVT_SRCH_GRATUIT
  },
  getEVT_SRCH_ENFANT (state) {
    return state.EVT_SRCH_ENFANT
  },
  // récupérer l'event courant
  getCurrentEvent (state) {
    return state.currentEvent
  },

  // récupérer le planning courant
  getPlanning (state) {
    return state.currentEvent.planning
  },

  getAllPlanning (state) {
    return state.planning
  },

  getAllEevents (state) {
    return state.events
  },

  // récupérer l'id de l'event courant
  getCurrentEventId (state) {
    return state.currentEvent.id
  },

  // récupérer l'image de l'évent courant
  getCurrentEventImg (state) {
    return state.currentEvent.images
  },

  // récupérer l'adr de l'event
  getCurrentAdr (state) {
    return state.currentEvent.localisation.adr
  },

  getNbLike (state) {
    return state.currentEvent.like
  },
  getActiveEmailWin (state) {
    return state.ActiveEmailWin
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

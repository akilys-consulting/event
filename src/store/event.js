import { fb } from '@/plugins/firebaseInit'
import moment from 'moment'
/*
    Définition des modèles base
*/

const PATH_IMAGE = 'image_event'
const DEFINE_EVENT = {
  id: -1,
  nom: null,
  adresse: {},
  plan: null,
  planning: [],
  like: 0
}

const state = {
  currentEventId: null,
  // pemret de stocker l'event courant ( event + programmation)
  currentEvent: null,
  // mémorise la plannifiation à partir de a programmation
  planning: [],
  // utiliser pour définir le type de programmation
  typeProgrammation: [
    { value: 'days', text: 'journalier' },
    { value: 'weeks', text: 'hebdomadaire' },
    { value: 'months', text: 'mensuel' }
  ],
  // permet de charger en mémoire tous les events
  events: [],
  // permet de définir les catégories
  CONST_CATEGORIE: [
    { nom: 'culture', couleur: 'red', icon: '' },
    { nom: 'loisir', couleur: 'red', icon: '' },
    { nom: 'restaurant', couleur: 'red', icon: '' },
    { nom: 'rencontre', couleur: 'red', icon: '' },
    { nom: 'sport', couleur: 'red', icon: '' }
  ],
  currentPlanning: null,
  searchPlanningId: null
}

const actions = {
  // sauvegarde de l'évent courant en base
  saveEvent ({ state, dispatch }) {
    return new Promise((resolve, reject) => {
      if (state.currentEvent.id == -1) {
        let execute = dispatch('insertEvent')
        execute.then(data => {
          resolve(data)
        })
        execute.catch(error => {
          reject(error)
        })
      } else {
        let execute = dispatch('updateEvent')
        execute.then(data => {
          resolve(data)
        })
        execute.catch(error => {
          reject(error)
        })
      }
    })
  },
  // ajout de l'event courant en base
  insertEvent ({ rootState }) {
    return new Promise((resolve, reject) => {
      let event = JSON.parse(JSON.stringify(state.currentEvent))
      delete event.id
      if (typeof rootState.currentProfil.organisation !== 'undefined') {
        event.organisation = rootState.currentProfil.organisation
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
      if (typeof rootState.currentProfil.organisation !== 'undefined') {
        event.organisation = rootState.currentProfil.organisation
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
  // chargement des events en mémoire depuis la base
  loadEvent ({ state, dispatch }) {
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
      execute.catch(error => {
        reject(error)
      })
    })
  },
  // chargement des events et du planning depuis les events en base
  async loadPlanning ({ state, dispatch, rootState }) {
    state.events = []
    state.planning = []
    let query = new Promise((resolve, reject) => {
      let execute = fb.eventCollection
      if (typeof rootState.currentProfil.organisation !== 'function') {
        execute = execute.where(
          'organisation',
          '==',
          rootState.currentProfil.organisation
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
        .catch(error => {
          reject(error)
        })
    })
    return await query
  },

  // parcours la programmation afin de définir toutes les dates
  // de l'évènement
  // met à jour le state calendar
  decodePlanning ({ state }, event) {
    let record = event
    if (event.planning.length > 0) {
      event.planning.forEach(prog => {
        let currentDate = moment(prog.dtDebut)
        let finDate = moment(prog.dtFin)
        let guard = 0
        while (currentDate <= finDate && guard++ <= 4000) {
          let planningId = record.id + guard
          // creation de l'évènement
          let newPlanning = {
            id: planningId,
            eventid: record.id,
            color: 'primary',
            category: record.categorie,
            name: record.nom,
            start: currentDate.format('YYYY-MM-DD') + ' ' + prog.heureDebut,
            end: currentDate.format('YYYY-MM-DD') + ' ' + prog.heureFin
          }
          state.planning.push(newPlanning)
          currentDate = currentDate.add(1, prog.type)
        }
      })
    }
  },

  addLike2Event ({ state, dispatch }) {
    let eventDoc = fb.eventCollection.doc(state.currentEvent.id)
    eventDoc.update({ like: ++state.currentEvent.like }).catch(error => {
      dispatch(
        'displayMessage',
        { code: 'ADMIN', param: error.message },
        { root: true }
      )
    })
  }
}
const mutations = {
  // vider l'event courant
  setInitEvent (state) {
    state.currentEvent = JSON.parse(JSON.stringify(DEFINE_EVENT))
  },

  // definir l'event courant
  setCurrentEventByPlanning (state, planning) {
    state.currentEvent = state.events.find(element => element.id == planning)
  },

  // ajout d'une image à l'event courant
  setAddEventImg (state, nvlImg) {
    state.currentEvent.images.push(nvlImg.path)
  },

  // ajout du planning à l'event courant
  setPlanning (state, value) {
    state.currentEvent.planning = value
  },

  // definir le planning courant
  setCurrentPlanning (state, planning) {
    state.currentPlanning = planning
  }
}

const getters = {
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

  // definir l'event courant
  getPlanningById (state) {
    return state.planning.find(element => element.id == state.searchPlanningId)
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

  // récupérer le chemin d'accès aux images des events
  getEventImgPath () {
    return PATH_IMAGE
  },
  getNbLike (state) {
    return state.currentEvent.like
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

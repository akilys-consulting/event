import { fb } from '@/plugins/firebaseInit'
import moment from 'moment'
/*
    Définition des modèles base
*/

const PATH_IMAGE = 'image_event'

const IMG_DEFAUT = 'IMG_DEFAUT.jpg'

const DEFINE_EVENT = {
  id: -1,
  nom: null,
  localisation: { adr: '', latLgn: { lat: '', long: '' } },
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
    localisation: { adr: '', latLgn: { lat: '', long: '' } },
    plan: null,
    planning: [],
    minisite: null,
    prix: null,
    like: 0,
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

  // permet de charger en mémoire tous les events
  events: [],
  // permet de définir les catégories
  CONST_CATEGORIE: [
    { nom: 'culture', couleur: 'orange darken-1', icon: '' },
    { nom: 'loisir', couleur: 'deep-purple lighten-2', icon: '' },
    { nom: 'restaurant', couleur: 'brown lighten-1', icon: '' },
    { nom: 'rencontre', couleur: 'pink lighten-1', icon: '' },
    { nom: 'sport', couleur: 'teal lighten-2', icon: '' }
  ],
  currentPlanning: null,
  searchPlanningId: null,
  currentImgUrl: null,
  ActiveEmailWin: false
}

const actions = {
  // sauvegarde de l'évent courant en base
  saveEvent ({ state, dispatch }) {
    console.log(
      'current Event ' + state.currentEvent.id + ' ' + state.currentEvent.nom
    )
    return new Promise((resolve, reject) => {
      if (state.currentEvent.id == -1) {
        let execute = dispatch('insertEvent')
        execute.then((data) => {
          resolve(data)
        })
        execute.catch((error) => {
          reject(error)
        })
      } else {
        let execute = dispatch('updateEvent')
        execute.then((data) => {
          resolve(data)
        })
        execute.catch((error) => {
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
      if (typeof rootState.cnx.currentProfil.organisation !== 'undefined') {
        event.organisation = rootState.cnx.currentProfil.organisation
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
      execute.catch((error) => {
        reject(error)
      })
    })
  },
  // chargement des events et du planning depuis les events en base
  async loadPlanning ({ state, dispatch, rootState, rootGetters }) {
    state.events = []
    state.planning = []
    // récupération du profil
    return new Promise((resolve, reject) => {
      let execute = fb.eventCollection
      if (
        rootGetters['cnx/IsProfilLoaded'] &&
        rootState.cnx.currentProfil.organisation
      ) {
        execute = execute.where(
          'organisation',
          '==',
          rootState.cnx.currentProfil.organisation
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
  }
}
const mutations = {
  // vider l'event courant
  setInitEvent (state) {
    state.currentEvent = JSON.parse(JSON.stringify(DEFINE_EVENT))
  },
  setEvent (state, data) {
    state.currentEvent = data
  },

  // definir l'event courant
  setCurrentEventByPlanning (state, planning) {
    state.currentEvent = state.events.find((element) => element.id == planning)
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
  }
}

const getters = {
  // retourne les catégories
  getCategories (state) {
    let nomCategorie = []
    state.CONST_CATEGORIE.forEach((data) => {
      nomCategorie.push(data.nom)
    })
    return nomCategorie
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

  // récupérer le chemin d'accès aux images des events
  getEventImgPath () {
    return PATH_IMAGE
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

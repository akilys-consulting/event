import { fb } from '@/plugins/firebaseInit'

/*
    Définition des modèles base
*/
const CONST_CANVAS = {
  height: 300,
  width: 300
}

const DEFINE_PLAN = {
  id: 0,
  nom: 'nouveau' /* nom du plan */,
  img_plan: null /* image du plan */,
  fond_plan: null /* image du plan sans les emplacements */,
  /* taille du plan */
  size: CONST_CANVAS,
  /* adresse plan + coordonnées latitude et longitude */
  ville: { adr: null, latLng: { lat: null, lng: null } },
  cat_emplacement: {},
  type_emplacement: null,
  count_emplacement: 1,
  actif: false
}

const DEFINE_EMPLACEMENT = {
  id: null,
  type: 'emplacement',
  reference: null,
  couleur: null /* permet de définir un prix */,
  /* coordonnées de l'emplacement */
  left: 5,
  scaleX: 1,
  scaleY: 1,
  angle: 0,
  top: 5,
  modele: null /* mémorise le path permettant de dessiner le'emplacement */
}

const DEFINE_CATEMPLACEMENT = {
  color: { hex: '#339cff' },
  prix: 100
}
/*
    défintion du store PLAN
*/

const state = {
  currentPlan: DEFINE_PLAN,
  /* définition d'un emplacement */
  currentEmplacement: {},
  lstPlan: [],
  banqueImage: [],
  DisplayDetailEmplacement: false
}

const actions = {
  /*
      Permet de sauvegarder un plan */
  savePlan ({ state, dispatch }) {
    //
    // on ré-initilise le status objetcourant modifié
    // cas 1 : si le plan à un id , il existe déjà en base => update
    return new Promise((resolve, reject) => {
      if (state.currentPlan.id) {
        dispatch('updatePlan')
          .then((data) => {
            resolve(data)
          })
          .catch((error) => {
            reject(error)
          })
        // add new plan
      } else {
        dispatch('insertPlan')
          .then((planId) => {
            state.currentPlan.id = planId
            resolve(planId)
          })
          .catch((error) => {
            reject(error)
          })
      }
    })
  },
  //
  // Update de la collection plan
  updatePlan ({ state }) {
    return new Promise((resolve, reject) => {
      let plan2update = JSON.parse(JSON.stringify(state.currentPlan))
      delete plan2update.id
      fb.planCollection
        .doc(state.currentPlan.id)
        .update(plan2update)
        .then(function (data) {
          resolve(data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  //
  // Insert de la collection plan
  insertPlan ({ state }) {
    return new Promise((resolve, reject) => {
      state.currentPlan.validate = false
      fb.planCollection
        .add(state.currentPlan)
        .then(function (docRef) {
          resolve(docRef)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },

  getPlan (context, planId) {
    return new Promise((resolve, reject) => {
      fb.planCollection
        .doc(planId)
        .get()
        .then((doc) => {
          if (doc.exists) {
            resolve(doc.data())
          }
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  getLstPlan () {
    return new Promise((resolve, reject) => {
      let lstPlan = []
      fb.planCollection
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (doc) {
            let current = { value: doc.id, text: doc.data().nom }
            lstPlan.push(current)
          })
          resolve(lstPlan)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  //
  // Add stand in firestore
  addEmplacement ({ state }, newEmplacement) {
    // context.dispatch("startWaiting");
    // return promise to wait the db action
    return new Promise((resolve, reject) => {
      if (newEmplacement.id) delete newEmplacement.id
      fb.planCollection
        // .doc(state.currentPlan.id)
        .doc(state.currentPlan.id)
        .collection('stand')
        .add(newEmplacement)
        .then(function (data) {
          resolve(data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  saveEmplacement (context, emplacement) {
    return new Promise((resolve, reject) => {
      let emplacementId = emplacement.id
      delete emplacement.id
      fb.planCollection
        .doc(context.state.currentPlan.id)
        .collection('stand')
        .doc(emplacementId)
        .set(emplacement)
        .then((data) => {
          resolve(data)
        })
        .catch(function (error) {
          reject(error)
        })
    })
  },
  delEmplacement ({ state }) {
    return new Promise((resolve, reject) => {
      if (state.currentEmplacement.id) {
        fb.planCollection
          .doc(state.currentPlan.id)
          .collection('stand')
          .doc(state.currentEmplacement.id)
          .delete()
          .then(function (data) {
            resolve()
          })
          .catch(function (error) {
            reject(error)
          })
      }
    })
  },
  loadBanqueImage ({ commit, state }) {
    var listRef = fb.file.ref().child('bib_objets')
    listRef.listAll().then((res) => {
      res.items.forEach((itemRef) => {
        let name = itemRef.name
        itemRef.getDownloadURL().then(function (url) {
          state.banqueImage.push({ name: name, url: url })
        })
      })
    })
  }
}

const mutations = {
  // le plan courant change de valeur
  setInitCurrentPlan (state) {
    state.currentPlan = DEFINE_PLAN
  },
  // le plan courant change de valeur
  setCurrentPlan (state, val) {
    state.currentPlan = val
  },

  setTypeEmplacement (state, val) {
    state.currentPlan.type_emplacement = val
  },

  setValidatePlan (state, val) {
    state.currentPlan.validate = val
  },
  /* chargement des objets de fond canvas du plan courant */
  setFondPlan (state, planJSON) {
    state.currentPlan.fond_plan = planJSON
  },
  /* chargement des objets de fond canvas du plan courant */
  setImgPlan (state, image) {
    state.currentPlan.img_plan = image
  },
  /* chargement des objets de fond canvas du plan courant */
  setSizePlan (state, sizeCanvas) {
    state.currentPlan.size = sizeCanvas
  },
  setAdrPlan (state, val) {
    state.currentPlan.ville = val
  },
  setCatEmplacement (state, val) {
    state.currentPlan.cat_emplacement = val
  },

  setNumEmplacement (state, val) {
    state.currentPlan.count_emplacement = val
  },

  setInitCurrentEmplacement (state) {
    state.currentEmplacement = DEFINE_EMPLACEMENT
  },

  setCurrentEmplacement (state, val) {
    state.currentEmplacement = val
  },
  
  setDisplayDetailEmplacement (state) {
    state.DisplayDetailEmplacement = !state.DisplayDetailEmplacement
  }
}
const getters = {
  getTypeEmplacement (state) {
    return state.currentPlan.type_emplacement
  },
  getIsCurrentPlanSet (state) {
    if (state.currentPlan.id === null) {
      return false
    } else {
      return true
    }
  },

  getCurrentPlan (state) {
    return state.currentPlan
  },

  getCurrentPlanId (state) {
    return state.currentPlan.id
  },

  getCurrentPlanNom (state) {
    return state.currentPlan.nom
  },

  getCurrentPlanVille (state) {
    if (typeof state.currentPlan.ville !== 'undefined') {
      let ville = state.currentPlan.ville.adr.split(',')
      let detail = ville[0].split(' ')
      return detail[0]
    } else return []
  },

  getPlanPlanJson (state) {
    return state.currentPlan.fond_plan
  },

  getImgPlan (stae) {
    return state.currentPlan.img_plan
  },

  getSizePlan (state) {
    if (typeof state.currentPlan.size !== 'undefined') {
      return state.currentPlan.size
    } else return CONST_CANVAS
  },

  getPlanValidate (state) {
    return state.currentPlan
  },
  getCurrentCatEmplacement (state) {
    let data = [DEFINE_CATEMPLACEMENT]
    if (
      Object.keys(state.currentPlan.cat_emplacement).length >0  &&
      typeof state.currentPlan.cat_emplacement !== 'undefined'
    ) {
      data = JSON.parse(state.currentPlan.cat_emplacement)
      return data
    } else {
      return data
    }
  },
  getIsEmplacementSelected (state) {
    if (typeof state.currentEmplacement  !== 'undefined' ) {
      return state.currentEmplacement.id != null
    } else return false
  },

  // stand management
  getNumEmplacement (state) {
    return state.currentPlan.count_emplacement == null
      ? 1
      : state.currentPlan.count_emplacement
  },

  getCurrentEmplacement (state) {
    return state.currentEmplacement
  },
  getBanqueImage (state) {
    return state.banqueImage
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}

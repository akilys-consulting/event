<template>
  <v-container>
    <dialogmodal ref="checkModif" :message="codeQuestion">
      <example-slot :key="codeQuestion.display"></example-slot>
    </dialogmodal>
    <detailEmplacement
      @refreshemp="updateDetailEmplacement"
      ref="emplacement"
    ></detailEmplacement>
    <v-row>
      <v-col cols="12">
        <p class="font-weight-light">
          {{ displayVille(plan.ville) }}-{{ plan.nom }}
        </p>
        <v-btn-toggle>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" v-on="on" :to="{ name: 'selectPlan' }">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>retour à la liste</span>
          </v-tooltip>
          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn  v-on="on" @click="sauvegarderPlan">
                <v-icon>mdi-content-save</v-icon>
              </v-btn>
            </template>
            <span>Sauvegarder votre plan</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="loadDetailEmplacement()">
                <v-icon>mdi-information-variant</v-icon>
              </v-btn>
            </template>
            <span>Modifier propriété du stand</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="printPlan()">
                <v-icon>mdi-printer</v-icon>
              </v-btn>
            </template>
            <span>Imprimer le plan</span>
          </v-tooltip>

          <v-menu offset-y v-if="!plan.validate">
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn-toggle background-color="blue-grey lighten-5">
                    <v-btn v-bind="attrs" v-on="tooltip">
                      <v-icon>mdi-map-marker-radius-outline</v-icon>
                      <v-icon
                        icon
                        class="align-left text-subtitle-1"
                        color="blue-grey lighten-3"
                        v-bind="attrs"
                        v-on="{ ...menu }"
                        >mdi-arrow-down</v-icon
                      >
                    </v-btn>
                  </v-btn-toggle>
                </template>
                <span>Ajouter un emplacement</span>
              </v-tooltip>
            </template>
            <banqueEmplacement @setemplacement="addEmplacement" />>
          </v-menu>

          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="duplicateObject()">
                <v-icon>mdi-content-duplicate</v-icon>
              </v-btn>
            </template>
            <span>dupliquer des emplacements</span>
          </v-tooltip>
          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="alignGauche()">
                <v-icon>mdi-align-horizontal-left</v-icon>
              </v-btn>
            </template>
            <span>aligner à gauche</span>
          </v-tooltip>
          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="alignCentre()">
                <v-icon>mdi-align-horizontal-center</v-icon>
              </v-btn>
            </template>
            <span>centrer</span>
          </v-tooltip>
          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="alignDroite()">
                <v-icon>mdi-align-horizontal-right</v-icon>
              </v-btn>
            </template>
            <span>aligner à droite</span>
          </v-tooltip>

          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="ajoutTexte()">
                <v-icon>mdi-format-textbox</v-icon>
              </v-btn>
            </template>
            <span>Ajouter un texte</span>
          </v-tooltip>
          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="ajoutObjet()">
                <v-icon>mdi-shape-rectangle-plus</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une zone objet</span>
          </v-tooltip>

          <v-menu offset-y v-if="!plan.validate">
            <template v-slot:activator="{ on: menu, attrs }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn-toggle background-color="blue-grey lighten-5">
                    <v-btn v-bind="attrs" v-on="tooltip">
                      <v-icon @click="ajoutImage()"
                        >mdi-file-image-outline</v-icon
                      >
                      <v-icon
                        icon
                        class="align-left text-subtitle-1"
                        color="blue-grey lighten-3"
                        v-bind="attrs"
                        v-on="{ ...menu }"
                        >mdi-arrow-down</v-icon
                      >
                    </v-btn>
                  </v-btn-toggle>
                </template>
                <span>Ajouter une image</span>
              </v-tooltip>
            </template>
            <banqueImage @setImage="ajoutImage" />
          </v-menu>

          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="ajoutFenetre()">
                <v-icon>mdi-chart-ppf</v-icon>
              </v-btn>
            </template>
            <span>Ajouter une entrée</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="validatePlan()">
                <v-icon v-if="plan.validate">mdi-lock</v-icon>
                <v-icon v-else>mdi-lock-open-variant-outline</v-icon>
              </v-btn>
            </template>
            <span>Verrouiller plan</span>
          </v-tooltip>
          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="deleteObject">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>Supprimer un objet</span>
          </v-tooltip>

          <v-tooltip bottom v-if="!plan.validate">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="drawPolygone">
                <v-icon>mdi-draw</v-icon>
              </v-btn>
            </template>
            <span>polygone</span>
          </v-tooltip>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <canvasplan ref="canvasplan" resa="false" design="true"></canvasplan>
  </v-container>
</template>

<script>
import mixFunctions from '@/components/commun/Functions'
import detailEmplacement from '@/components/plan/DetailEmplacement'
import canvasplan from '@/components/canvas/CanvasManagement'
import dialogmodal from '@/components/commun/DialogModal'
import banqueImage from '@/components/plan/BanqueImage'
import banqueEmplacement from '@/components/plan/BanqueEmplacement'
// définition d'un emplacement par defaut

export default {
  name: 'designPlan',
  beforeRouteLeave (to, from, next) {
    let self = this
    if (this.$store.getters.getModifUser) {
      this.$refs.checkModif
        .open('sauvegarde', 'voulez-vous sauvegarder ?', {
          color: 'red',
          width: '300'
        })
        .then((data) => {
          if (data) {
            self.sauvegarderPlan().then((data) => {
              next()
            })
          }
          next()
        })
      this.$store.commit('initModifUser')
    } else next()
  },
  mixins: [mixFunctions],
  components: {
    detailEmplacement,
    canvasplan,
    dialogmodal,
    banqueImage,
    banqueEmplacement
  },
  data () {
    return {
      currentModele: { flag: 'mdi-square', path: 'M3,3V21H21V3' },
      modeles: [
        { flag: 'mdi-square', path: 'M3,3V21H21V3' },
        {
          flag: 'mdi-circle',
          path: 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z'
        },
        {
          flag: 'mdi-seat',
          path: 'M4,18V21H7V18H17V21H20V15H4V18M19,10H22V13H19V10M2,10H5V13H2V10M17,13H7V5A2,2 0 0,1 9,3H15A2,2 0 0,1 17,5V13Z'
        }
      ],
      plan: {},
      offsetEmplacement: 5,
      catEmplacement: [],
      numEmplacement: 0,
      codeQuestion: {
        code: 'GMOD',
        display: false
      },
      display: false
    }
  },
  created () {
    this.$store.commit('event/clearActiveSearch')

    if (this.$store.getters['plan/getIsCurrentPlanSet']) {
      this.plan = this.$store.getters['plan/getCurrentPlan']
      this.catEmplacement =
        this.$store.getters['plan/getCurrentCatEmplacement']
      this.numEmplacement = this.$store.getters['plan/getNumEmplacement']
    } else this.$router.push({ name: 'selectPlan' })
  },

  beforeDestroy () {
    // on supprime toute trace de stand sélectionné
    this.$store.commit('plan/setInitCurrentEmplacement')
  },
  computed: {
    getIcon () {
      return (item) => {
        let image = item || this.currentModele.flag
        let iconSrc = null
        Object.keys(this.modeles).forEach((index) => {
          if (this.modeles[index].flag === image) {
            iconSrc = this.modeles[index].flag
          }
        })
        return iconSrc
      }
    }
  },
  methods: {
    setModele (selectedModele) {
      this.currentModele = selectedModele
    },
    // lock plan
    validatePlan () {
      this.plan.validate = !this.plan.validate
      if (this.plan.validate) {
        this.$store.commit('plan/setValidatePlan', this.plan.validate)
        this.$store.commit('initModifUser')
      }
    },

    // generate pdf
    printPlan () {
      this.$refs.canvasplan.imprimerPlan()
    },
    // save background plan
    sauvegarderPlan () {
      // sauvegarde des emplacements positionnés sur le plan
      this.$refs.canvasplan.sauvegarderStands()
      // sauvegarde du fond de carte
      let planJson = this.$refs.canvasplan.getJsonPlan()
      this.$store.commit('plan/setFondPlan', planJson)
      let imgPlan = this.$refs.canvasplan.getImagePlan()
      this.$store.commit('plan/setImgPlan', imgPlan)
      this.$store.commit('plan/setNumEmplacement', this.numEmplacement)

      this.$store.dispatch('startWaiting')
      this.$store
        .dispatch('plan/savePlan')
        .then((data) => {
          this.$store.commit('initModifUser')
          this.$store.dispatch('stopWaiting')
          this.$store.dispatch('displayMessage', {code:'SAOK'})
        })
        .catch((error) => {
          this.$store.dispatch('stopWaiting')
          this.$store.dispatch('displayMessage', {code:'SAKO',param:error.message})
        })
    },
    // delete objet (except emplacement)
    deleteObject () {
      this.$store.dispatch('startWaiting')
      this.$refs.canvasplan.supprimerObject()
      this.$store.dispatch('stopWaiting')
      this.$store.dispatch('displayMessage', {code:'SUPR'})
      this.$store.commit('setModifUser')
    },
    //
    // ajout d'un emplacement su le plan
    addEmplacement (typeEmplacement) {
      let self = this
      let newEmplacement = {}
      // préparation reference emplacementF
      newEmplacement.modele = typeEmplacement
      newEmplacement.reference = 'S-' + this.numEmplacement++
      newEmplacement.couleur = this.catEmplacement[0].color.hex
      newEmplacement.left = this.offsetEmplacement
      newEmplacement.top = 5
      newEmplacement.scaleX = 1
      newEmplacement.scaleY = 1
      newEmplacement.angle = 0
      this.offsetEmplacement = +5
      // dessin et sauvegarde de l'emplacement
      this.$store
        .dispatch('plan/addEmplacement', newEmplacement)
        .then(function (newdata) {
          newEmplacement.id = newdata.id
          self.$refs.canvasplan.dessinerEmplacement(newEmplacement, true)
        })
        .catch(function (error) {
          self.$store.dispatch('displayMessage', {code:'ASKO',param:error.message})
        })
    },

    // permet de charger les infos d'un stand et d'affichage le fomr de modif
    loadDetailEmplacement () {
      if (this.$store.getters['plan/getIsEmplacementSelected']) {
        this.$store.commit('setDisplayDetailEmplacement')
      } else {
        this.$store.dispatch('displayMessage', 'SLIN')
      }
    },
    // appelé après la modif des infos du stand
    updateDetailEmplacement () {
      let newdata = this.$store.getters['plan/getCurrentEmplacement']
      this.$refs.canvasplan.updateEmplacement(newdata)
      this.$store.commit('setModifUser')
    },

    duplicateObject () {
      this.$store.dispatch('startWaiting')
      this.$refs.canvasplan.duplicateObject()
      this.$store.dispatch('stopWaiting')
    },
    // ajout d'une zone dans le plan
    ajoutObjet () {
      this.$refs.canvasplan.ajoutObjet()
      this.$store.commit('setModifUser')
    },
    // ajout d'une zone dans le plan
    ajoutTexte () {
      this.$refs.canvasplan.ajoutTexte()
      this.$store.commit('setModifUser')
    },
    ajoutFenetre () {
      this.$refs.canvasplan.ajouterFenetre()
      this.$store.commit('setModifUser')
    },
    ajoutPorte () {
      this.$refs.canvasplan.ajouterFenetre()
      this.$store.commit('setModifUser')
    },
    alignGauche () {
      this.$refs.canvasplan.alignGauche()
      this.$store.commit('setModifUser')
    },
    alignDroite () {
      this.$refs.canvasplan.alignDroite()
      this.$store.commit('setModifUser')
    },
    alignCentre () {
      this.$refs.canvasplan.alignCentre()
      this.$store.commit('setModifUser')
    },
    ajoutImage (imageUrl) {
      this.$refs.canvasplan.ajoutImage(imageUrl)
    },
    drawPolygone () {
      this.$refs.canvasplan.activeDraw()
    }
  }
}
</script>

<style>
.canvas {
  overflow: auto;
  height: 500;
}
.toolbar {
  width: 100%;
  margin-left: 20px;
  padding-bottom: 10px;
}

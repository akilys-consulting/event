<template>
  <v-container fluid>
    <v-toolbar>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            outlined
            small
            color="primary"
            v-on="on"
            :to="{ name: 'selectPlan' }"
          >
            <v-icon>mdi-arrow-left</v-icon>
            <span class="hidden-md-and-down">retour</span>
          </v-btn>
        </template>
        <span>retour à la liste</span>
      </v-tooltip>

      <v-btn @click="saveplan" color="primary" outlined small>
        <v-icon>mdi-content-save-outline</v-icon>
        <span class="hidden-md-and-down">sauvegarder</span>
      </v-btn>
      <v-btn small outlined color="primary">
        <v-icon>mdi-delete-outline</v-icon>
        <span class="hidden-md-and-down">Supprimer</span>
      </v-btn>
    </v-toolbar>
    <v-row>
      <v-col cols="12">
        <v-card flat>
          <v-card-text>
            <v-row>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  v-model="currentplan.nom"
                  label="Nom du plan"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="12" md="12">
                <v-text-field
                  id="autocomplete"
                  ref="autocomplete"
                  :value="currentplan.ville.adr"
                  placeholder="Search"
                  onfocus="value = ''"
                  type="text"
                />
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col cols="12">
                <v-select
                  prepend-icon="mdi-floor-plan"
                  :items="type_emplacement"
                  label="choix modele d'emplacement"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
        <CatEmplacement />
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import adrmanagement from '@/components/commun/AdrManagement'
import CatEmplacement from '@/components/plan/CatEmplacement'
export default {
  name: 'planform',
  components: {
    adrmanagement,
    CatEmplacement
  },
  data () {
    return {
      editorConfig: {
        // The configuration of the editor.
      },
      menu: false,
      type_emplacement: ['carre', 'rond'],
      dates: ['2018-09-15', '2018-09-20'],
      tab: null,
      currentplan: {},
      plan: null,
      rules: {
        required: (value) => !!value || 'obligatoire.',
        prix: (value) => {
          const pattern = /^[0-9]+([\\,|\\.]{0,1}[0-9]{2}){0,1}$/
          return pattern.test(value) || 'valeur numerique'
        }
      },
      localisation: null
    }
  },

  watch: {
    'currentplan.nom': function (val, oldval) {
      if (typeof oldval !== 'undefined') this.$store.commit('setModifUser')
    }
  },
  beforeRouteLeave (to, from, next) {
    let self = this
    if (this.$store.getters.getModifUser) {
      this.$dialog
        .confirm('Voulez-vous sauver vos modifications', {
          okText: 'Oui',
          cancelText: 'Non'
        })
        .then(function (dialog) {
          self.$store.dispatch('savePlan')
          next()
        })
        .catch(() => {
          next()
        })
    } else next()
  },
  created () {
    if (this.$store.getters['plan/getIsCurrentPlanSet']) {
      this.currentplan = this.$store.getters['plan/getCurrentPlan']
    } else this.$router.push({ name: 'selectPlan' })

    // chargement des données
  },

  mounted () {
    let self = this
    let currentField = document.getElementById('autocomplete')

    this.autocomplete = new window.google.maps.places.Autocomplete(currentField)

    this.autocomplete.addListener('place_changed', () => {
      let place = this.autocomplete.getPlace()

      console.log(' adr' + place['formatted_address'])
      console.log(' adr' + self.currentplan.ville.adr)

      self.currentplan.ville.latLng.lat = place.geometry.location.lat()
      self.currentplan.ville.latLng.lng = place.geometry.location.lng()
      self.currentplan.ville.adr = place['formatted_address']
    })
  },

  methods: {
    getAddressData (addressData, placeResultData, id) {
      this.localisation = addressData
    },

    changePlan: function () {
      this.$store.commit('setModifUser')
    },
    updateadresse (localisation) {
      this.localisation = localisation
      this.currentplan.ville = localisation
      this.$store.commit('setModifUser')
    },
    // manage save all options
    saveplan () {
      this.$store.dispatch('startWaiting')
      // this.$store.commit('initModifUser')
      this.$store
        .dispatch('plan/savePlan')
        .then(() => {
          this.$store.dispatch('stopWaiting')
          this.$store.dispatch('displayMessage', { code: 'SAOK' })
        })
        .catch((error) => {
          this.$store.dispatch('stopWaiting')
          this.$store.dispatch('displayMessage', {
            code: 'SAKO',
            param: error.message
          })
        })
    }
  }
}
</script>

<style></style>

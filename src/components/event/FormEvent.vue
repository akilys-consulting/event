<template>
  <div>
    <dialogmodal ref="checkModif"> </dialogmodal>
    <v-toolbar>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            fab
            small
            color="primary"
            v-on="on"
            :to="{ name: 'calendrier' }"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>retour au calendrier</span>
      </v-tooltip>

      <v-spacer></v-spacer>
      <v-btn
        fab
        color="accent"
        :disabled="!valid"
        @click="saveEvent"
        large
        icon
      >
        <v-icon>mdi-content-save-outline</v-icon>
      </v-btn>
      <v-btn color="accent" large icon>
        <v-icon>mdi-delete-outline</v-icon>
      </v-btn>
    </v-toolbar>
    <v-tabs color="lime darken-4" v-model="tab">
      <v-tab>Général</v-tab>
      <v-tab v-if="plan">gestion des prix</v-tab>
      <v-tab v-if="plan">options évènement</v-tab>
      <v-tab v-if="plan">options emplacement</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item
        ><v-card>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <programmation ref="programmation" />
              </v-col>
            </v-row>
            <v-row>
              <imageUpload
                v-if="currentEvent"
                :fileName="getImage"
                rep="image_event"
                @uploadfile="saveEvent"
              />
              <p v-else>
                Sauvegarder votre évènement et vous pourrez ajouter une image
              </p>
            </v-row>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="currentEvent.nom"
                    label="Nom évènement"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-select
                    v-model="currentEvent.categorie"
                    :rules="[rules.required]"
                    required
                    :items="getCategorie"
                    label="Catégorie"
                  ></v-select
                ></v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="currentEvent.organisateur"
                    label="Organisateur"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="currentEvent.urlsite"
                    label="Site vers spectacle"
                  ></v-text-field
                ></v-col>
                <v-col cols="6">
                  <v-select
                    v-model="currentEvent.plan"
                    :items="lstPlans"
                    clearable
                    label="plan"
                    item-text="text"
                    item-value="value"
                    @change="loadAdr"
                    @click:clear="localisation = null"
                  ></v-select></v-col
                ><v-col cols="6">
                  <adrmanagement
                    @uptadr="updateadresse"
                    :adresse="currentEvent.localisation"/></v-col
                ><v-col cols="12">
                  <editor
                    v-model="currentEvent.minisite"
                    :options="editorOption"
                  ></editor></v-col></v-row></v-form
          ></v-card-text>
        </v-card>
      </v-tab-item>
      <v-tab-item>
        <prixevent />
      </v-tab-item>
      <v-tab-item>
        <optionsalon />
      </v-tab-item>
      <v-tab-item>
        <optionstand />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import adrmanagement from '@/components/commun/AdrManagement'
import optionevent from '@/components/event/OptionEvent'
import optionemplacement from '@/components/event/OptionEmplacement'
import imageUpload from '@/components/commun/ImageUpload'
import prixevent from '@/components/event/OptionPrix'
import dialogmodal from '@/components/commun/DialogModal'
import programmation from '@/components/event/Programmation'

import { mapState } from 'vuex'
export default {
  name: 'formEvent',
  components: {
    adrmanagement,
    optionevent,
    optionemplacement,
    prixevent,
    imageUpload,
    dialogmodal,
    programmation
  },
  data () {
    return {
      currentEvent: null,
      check: true,
      plan: false,
      EventImage: [],
      lstPlans: [],
      codeQuestion: {
        code: 'GMOD',
        display: false
      },
      localisation: null,
      tab: null,
      ImageFileName: false,

      rules: {
        required: value => !!value || 'obligatoire.'
      },
      valid: true,
      editorOption: {
        theme: 'bubble',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            [{ font: [] }],
            [{ align: [] }],
            ['link'],
            ['clean']
          ]
        }
      }
    }
  },

  watch: {
    'currentEvent.nom': function (val, oldval) {
      if (typeof oldval !== 'undefined') this.$store.commit('setModifUser')
    }
  },
  computed: {
    ...mapState('event', ['CONST_CATEGORIE']),
    ...mapState['currentProfil'],
    getImage () {
      return this.currentEvent !== null ? this.currentEvent.id : null
    },
    getCategorie () {
      let nomCategorie = []
      this.CONST_CATEGORIE.forEach(data => {
        nomCategorie.push(data.nom)
      })
      return nomCategorie
    }
  },
  beforeRouteLeave (to, from, next) {
    /*
    let self = this;
    if (this.$store.getters.getModifUser) {
      this.$refs.checkModif
        .open("sauvegarde", "voulez-vous sauvegarder ?", {
          color: "red",
          width: "300",
        })
        .then((data) => {
          if (data)
            self.sauvegarderPlan().then((data) => {
              next();
            });
          next();
        });
      this.$store.commit("initModifUser");
    } else */
    next()
  },
  updated () {
    if (this.currentEvent == null) {
      this.$router.push({ name: 'calendrier' })
    }
  },
  created () {
    this.$store.commit('initModifUser')
    this.currentEvent = this.$store.getters['event/getCurrentEvent']

    if (this.currentEvent) {
      this.EventImage = []
    } else this.$router.push({ name: 'calendrier' })
  },

  methods: {
    loadAdr (planId) {
      if (planId) {
        let execute = this.$store.dispatch('plan/getPlan', planId)
        execute.then(plan => {
          this.localisation = plan.ville.adr
        })
        execute.catch(() => {
          this.$store.dispatch('displayMessage', 'EVAD')
        })
      }
    },
    updateadresse (localisation) {
      this.localisation = localisation
      this.currentEvent.localisation = localisation
      this.$store.commit('setModifUser')
    },

    // manage save all options
    saveEvent () {
      if (this.$refs.form.validate() && this.currentEvent.planning.length > 0) {
        /* this.$store.commit("setModifUser"); */
        this.$store.dispatch('startWaiting')
        // appel a la fonction de génération des évents

        let execute = this.$store.dispatch('event/saveEvent')
        execute.then(data => {
          this.$store.dispatch('stopWaiting')
          this.$store.dispatch('displayMessage', { code: 'SAOK' })
        })
        execute.catch(() => {
          this.$store.dispatch('stopWaiting')
          this.$store.dispatch('displayMessage', { code: 'SAKO' })
        })
      } else this.$store.dispatch('displayMessage', { code: 'EADC' })
    }
  }
}
</script>

<style>
.ql-bubble .ql-editor:focus {
  background-color: black;
}
</style>

<template>
  <div>
    <dialogmodal ref="checkModif"> </dialogmodal>
    <v-toolbar>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn plain v-on="on" :to="{ name: 'calendrier' }">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>retour au calendrier</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn plain v-on="on" :disabled="!valid" @click="saveEvent">
            <v-icon>mdi-content-save-outline</v-icon>
          </v-btn>
        </template>
        <span>sauvegarder évènement</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" plain>
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </template>
        <span>supprimer évènement</span>
      </v-tooltip>
    </v-toolbar>
    <v-card>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <programmation ref="programmation" />
          </v-col>

          <v-col cols="12" lg="6">
            <imageUpload
              v-if="currentEvent"
              :fileName="getImage"
              rep="image_event"
              @uploadfile="saveEvent"
            />
          </v-col>
          <v-col cols="12" lg="6">
            <editor
              class="subtitle-1"
              v-model="currentEvent.minisite"
              :options="editorOption"
              placeholder="merci de saisir une description à votre évènement"
            ></editor>
          </v-col>
        </v-row>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12" lg="6" md="6">
              <v-text-field
                v-model="currentEvent.nom"
                label="Nom évènement"
                required
                :rules="[rules.required]"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <v-select
                v-model="currentEvent.categorie"
                :rules="[rules.required]"
                required
                multiple
                :items="getCategorie"
                label="Catégorie"
              ></v-select
            ></v-col>

            <v-col cols="12" lg="6" md="6">
              <v-text-field
                v-model="currentEvent.organisateur"
                label="Organisateur"
              ></v-text-field>
            </v-col>
            <v-col cols="12" lg="6" md="6">
              <v-text-field
                :rules="[rules.url]"
                v-model="currentEvent.urlsite"
                label="lien vers spectacle"
              ></v-text-field
            ></v-col>
            <v-col cols="12">
              <adrmanagement
                @uptadr="updateadresse"
                :adresse="currentEvent.localisation"
            /></v-col>
            <v-col cols="4">
              <v-switch
                v-model="payant"
                value="isPayant"
                label="payant ?"
              ></v-switch>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="currentEvent.prix"
                label="Prix"
                :rules="[rules.digits]"
                v-if="payant"
              ></v-text-field
            ></v-col>
            <v-col cols="4">
              <v-switch
                dense
                flat
                hide-details
                v-model="currentEvent.enfant"
                label="spetacle Enfants"
              ></v-switch>
            </v-col>
          </v-row> </v-form
      ></v-card-text>
    </v-card>
  </div>
</template>
<script>
import adrmanagement from '@/components/commun/AdrManagement'
import imageUpload from '@/components/commun/ImageUpload'
import dialogmodal from '@/components/commun/DialogModal'
import programmation from '@/components/event/Programmation'

import { mapState } from 'vuex'
export default {
  name: 'formEvent',
  components: {
    adrmanagement,
    imageUpload,
    dialogmodal,
    programmation
  },
  data () {
    return {
      currentEvent: null,
      payant: false,
      public: ['Tous', 'adultes', 'Enfants'],
      check: true,
      tab: null,
      rules: {
        required: (value) => !!value || 'obligatoire.',
        digits: (v) => /^[0-9]+(,[0-9]+)?$/.test(v) || 'un nombre',
        url: (v) =>
          !v ||
          /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/.test(
            v
          ) ||
          'une URL'
      },
      valid: true,
      editorOption: {
        theme: 'bubble',
        placeholder: 'saisir votre texte...',
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
    getImage () {
      return this.currentEvent !== null ? this.currentEvent.id : null
    },
    getCategorie () {
      let nomCategorie = []
      this.CONST_CATEGORIE.forEach((data) => {
        nomCategorie.push(data.nom)
      })
      return nomCategorie
    },
    isPayant () {
      return !!this.currentEvent.prix
    }
  },
  //
  // gestion des modifications non sauvegardées
  beforeRouteLeave (to, from, next) {
    if (this.$store.getters.getModifUser) {
      this.$store.dispatch('displayQuestion', { code: 'QMOD' })

      this.$refs.checkModif.open().then((reponse) => {
        if (reponse) {
          this.saveEvent()
            .then(() => {
              next()
            })
            .catch(() => {
              // done
            })
        } else next()
      })
      this.$store.commit('initModifUser')
    } else next()
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
    } else this.$router.push({ name: 'calendrier' })
  },

  mounted () {
    this.$store.commit('setDisplayMenuOn')
    this.$store.commit('event/clearActiveSearch')
  },

  methods: {
    updateadresse (localisation) {
      this.currentEvent.localisation = localisation
      this.$store.commit('setModifUser')
    },
    // manage save all options
    saveEvent () {
      return new Promise((resolve, reject) => {
        if (
          this.$refs.form.validate() &&
          this.currentEvent.planning.length > 0
        ) {
          this.$store.dispatch('startWaiting')
          // appel a la fonction de génération des évents

          this.$store
            .dispatch('event/saveEvent')
            .then((data) => {
              this.$store.dispatch('stopWaiting')
              this.$store.dispatch('displayMessage', { code: 'SAOK' })
              /* gestion de l 'alerting
          on recherche dans tous les profils des alertes qui correspondent a l'event
          si cela correspond => envoi du mail via email du profil */

              this.$store.dispatch('event/ManageAlerte')
              resolve()
            })
            .catch((error) => {
              this.$store.dispatch('stopWaiting')
              this.$store.dispatch('displayMessage', { code: 'SAKO' })
              reject(error)
            })
        } else {
          this.$store.commit('setModifUser')
          this.$store.dispatch('displayMessage', { code: 'EADC' })
          reject(new Error('champs vides'))
        }
      })
    }
  }
}
</script>

<style>
.ql-bubble .ql-editor:focus {
  background-color: transparent;
}
#quill-container {
  height: auto;
  min-height: 100%;
  padding: 50px;
}

/* Specify our own scrolling container */
#scrolling-container {
  height: 100%;
  min-height: 200;
  overflow-y: auto;
}
.ql-editor {
  max-height: 325px;
  height: 325px;
  overflow-y: auto;
}

.ql-editor.ql-blank:before {
  color: rgb(161, 158, 158) !important;
  font-size: small;
  height: 250px !important;
}
</style>

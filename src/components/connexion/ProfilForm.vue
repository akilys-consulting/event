<template>
  <div>
    <v-btn icon v-if="!isAuthenticated" to="/login"
      ><v-icon>mdi-account-arrow-right-outline </v-icon></v-btn
    >

    <v-menu
      v-else
      v-model="menuProfil"
      :close-on-content-click="false"
      :nudge-width="400"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="hidden-md-and-down" icon v-bind="attrs" v-on="on">
          <AvatarDisplay sizeAvatar="41" />
        </v-btn>
        <v-btn class="hidden-lg-and-up" small icon v-bind="attrs" v-on="on">
          <AvatarDisplay sizeAvatar="36" />
        </v-btn>
      </template>
      <v-card>
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-btn text @click="deconnexion()">déconnexion</v-btn>

          <v-tooltip bottom>
            <template v-slot:activator="{ open }">
              <v-btn
                v-on="open"
                fab
                color="primary"
                @click="saveProfil"
                large
                icon
              >
                <v-icon>mdi-content-save-outline</v-icon>
              </v-btn>
            </template>
            <span>Sauvegarder le profil</span>
          </v-tooltip>
          <v-btn icon color="accent" text @click="menuProfil = false">
            <v-icon> mdi-close-box </v-icon>
          </v-btn>
          <themeManagement />
        </v-toolbar>

        <v-card-text>
          <v-row>
            <AvatarDisplay uploadMode="true" @uploadfile="saveImg" />
          </v-row>
          <v-form ref="form" lazy-validation>
            <v-row>
              <v-col cols="6">
                <v-text-field
                  v-model="currentProfil.nom"
                  label="Nom"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="currentProfil.prenom"
                  label="Prénom"
                  required
                  :rules="[rules.required]"
                ></v-text-field>
              </v-col>
            </v-row>
            <adrmanagement
              @uptadr="updateadresse"
              :adresse="currentProfil.localisation"
              libelleAdr="Adresse de livraison"
            /> </v-form
        ></v-card-text> </v-card
    ></v-menu>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import adrmanagement from '@/components/commun/AdrManagement'
import AvatarDisplay from '../commun/AvatarDisplay.vue'
import themeManagement from '@/components/commun/ThemeManagement'

export default {
  name: 'profil',
  components: { adrmanagement, AvatarDisplay, themeManagement },
  data () {
    return {
      menuProfil: false,
      viewTheme: false,

      profil: { nom: '', prenom: '', date: null, localisation: null },
      rules: { required: (value) => !!value || 'obligatoire.' },
      menu1: false,
      localisation: null
    }
  },

  computed: {
    ...mapGetters('cnx', [
      'getDisplayName',
      'isAuthenticated',
      'isProfilLoaded'
    ]),
    ...mapState('cnx', ['currentProfil'])
  },

  async created () {
    // on charge le profil
    if (!this.IsProfilLoaded) {
      await this.$store.dispatch('cnx/loadProfil', { root: true }).then(() => {
        if (!this.currentProfil) this.currentProfil = this.profil
        console.log('profil' + this.currentProfil.localisation)
        console.log('user identified ' + this.isAuthenticated)
      })
    }
  },
  methods: {
    saveImg (url) {
      this.currentProfil.photoURL = url
      this.saveProfil()
    },

    closeProfil () {
      this.$emit('closeProfil')
    },
    saveProfil () {
      this.$store.dispatch('cnx/saveProfil', this.currentProfil).then(() => {
        this.$store.dispatch('displayMessage', { code: 'SAOK', param: null })
      })
    },

    displayDtFr (dt) {
      return moment(dt).format('DD/MM/YYYY')
    },

    formatedDate (date) {
      return date ? moment(date).format('DD/MM/YYYY') : null
    },

    deconnexion () {
      console.log('demande de deconnexion')
      this.$store.dispatch('cnx/disconnect').then(() => {
        this.$store.dispatch('displayMessage', { code: 'DCNX', param: null })
      })

      this.$router.push('/')
    },
    closeForm () {
      console.log('fermeture detail')
      this.$emit('closeProfilDetail')
    },
    updateadresse (localisation) {
      console.log('localisation ' + localisation)
      this.localisation = localisation
      this.currentProfil.localisation = localisation
    }
  }
}
</script>

<style></style>

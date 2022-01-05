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
          <AvatarDisplay urlsizeAvatar="41" />
        </v-btn>
        <v-btn class="hidden-lg-and-up" small icon v-bind="attrs" v-on="on">
          <AvatarDisplay sizeAvatar="36" />
        </v-btn>
      </template>
      <v-card>
        <v-toolbar>
          <v-spacer></v-spacer>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="deconnexion()"
                ><v-icon>mdi-account-remove-outline</v-icon></v-btn
              >
            </template>
            <span>déconnexion</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" @click="saveProfil" icon>
                <v-icon>mdi-content-save-outline</v-icon>
              </v-btn>
            </template>
            <span>Sauvegarder le profil</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on" @click="menuProfil = false">
                <v-icon> mdi-close-box </v-icon>
              </v-btn>
            </template>
            <span>fermer</span>
          </v-tooltip>
        </v-toolbar>

        <v-tabs v-model="tab">
          <v-tab>votre profil</v-tab>
          <v-tab>theme</v-tab>
          <v-tab>alertes</v-tab>
        </v-tabs>
        <v-tabs-items v-model="tab">
          <v-tab-item>
            <v-card-text>
              <AvatarDisplay uploadMode="true" @uploadfile="saveImg" />
              <br />
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
                </v-row> </v-form
            ></v-card-text>
          </v-tab-item>
          <themeManagement />
          <alerteManagement />
        </v-tabs-items> </v-card
    ></v-menu>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import AvatarDisplay from '../commun/AvatarDisplay.vue'
import themeManagement from '@/components/connexion/ThemeManagement'
import alerteManagement from '@/components/connexion/AlerteManagement'

export default {
  name: 'profil',
  inject: ['theme'],
  components: {
    AvatarDisplay,
    alerteManagement,
    themeManagement
  },
  data () {
    return {
      tab: null,
      menuProfil: false,
      viewTheme: false,
      urlAvatar: null,

      profil: { nom: '', prenom: '', date: null, localisation: null },
      rules: { required: (value) => !!value || 'obligatoire.' },
      menu1: false,
      localisation: null
    }
  },

  computed: {
    ...mapGetters('cnx', [
      'isAuthenticated',
      'getThemeProfilName',
      'getThemeProfilMode'
    ]),
    ...mapState(['themes']),
    ...mapState('cnx', ['currentProfil'])
  },
  mounted () {
    console.log('before mounted from profil')
    console.log('profil' + this.isAuthenticated)
    this.setTheme()
  },
  methods: {
    setTheme () {
      if (this.isAuthenticated) {
        let theme = this.themes.find(
          (value) => value.name == this.getThemeProfilName
        )
        const name = theme.name
        const dark = theme.dark
        const light = theme.light // set themes
        Object.keys(dark).forEach((i) => {
          console.log('set' + dark[i])
          this.$vuetify.theme.themes.dark[i] = dark[i]
        })
        Object.keys(light).forEach((i) => {
          this.$vuetify.theme.themes.light[i] = light[i]
        }) // also save theme name to disable selection
        this.$vuetify.theme.themes.name = name
        this.$vuetify.theme.dark = this.getThemeProfilMode
      }
    },

    saveImg (url) {
      this.currentProfil.photoURL = url
      this.saveProfil()
    },

    closeProfil () {
      this.$emit('closeProfil')
    },
    saveProfil () {
      let currentTheme = {
        name: this.$vuetify.theme.themes.name,
        dark: this.$vuetify.theme.dark
      }
      this.currentProfil.theme = currentTheme
      console.log(this.currentProfil.theme)

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

      this.$router.push('/').catch(() => {})
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

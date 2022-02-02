<template>
  <v-card
    class="mx-auto login"
    hover
    flat
    max-height="400"
    max-width="500"
    outlined
  >
    <v-card-text>
      <v-row>
        <v-col md="8" offset-md="2">
          <v-form>
            <v-text-field
              label="Votre email"
              v-model="email"
              :placeholder="autofillLogin ? ` Email` : null"
              name="login"
              class="input-group--focused"
              prepend-icon="mdi-account"
              type="text"
            />

            <v-text-field
              prepend-icon="mdi-lock"
              label="Votre mot de passe"
              :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show3 ? 'text' : 'password'"
              name="password"
              :placeholder="autofill ? ` Mot de passe` : null"
              v-model="password"
              @click:append="show3 = !show3"
            />
            <v-spacer />
            <v-alert
              v-model="displayalert"
              dismissible
              outlined
              type="error"
              color="error"
              elevation="2"
              v-if="errorMsg !== ''"
              >{{ errorMsg }}</v-alert
            ><v-row>
              <v-col cols="6"
                ><v-btn plain @click="login" color="primary" block
                  >connexion</v-btn
                >
              </v-col>
              <v-col cols="6"
                ><v-btn tabindex="8" plain :to="{ name: 'listEvent' }"
                  >Annuler</v-btn
                >
              </v-col></v-row
            >
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text>
      <v-row align="center" justify="center">
        <v-col cols="auto" class="font-weight-thin">
          Autre moyen de connexion
        </v-col>
        <v-col cols="4">
          <v-btn icon color="red" outlined @click="cnxgoogle"
            ><v-icon>mdi-google-plus</v-icon>
          </v-btn>
          <v-btn icon outlined color="light-blue darken-2" @click="cnxFacebook">
            <v-icon>mdi-facebook</v-icon></v-btn
          >
        </v-col>
      </v-row>

      <p class="text-right font-weight-thin mt-3">
        <router-link :to="{ name: 'creation' }"
          >créér un nouveau compte</router-link
        >
      </p>
    </v-card-text>
    <!--</v-parallax>-->
  </v-card>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      show3: false,
      dialog: true,
      email: '',
      password: '',
      autofill: false,
      autofillLogin: false,
      intervalDetectAutofill: null,
      errorMsg: '',
      displayalert: false,
      url_img: '@/static/img/fond_app.jpg'
    }
  },

  mounted () {
    this.$store.commit('setDisplayMenuOff')
    console.log('login:Mounted')
  },
  watch: {
    password () {
      this.autofill = false
    },
    autofill () {
      // clean interval if autofill detected or user input
      if (this.intervalDetectAutofill) {
        clearInterval(this.intervalDetectAutofill)
        this.intervalDetectAutofill = null
      }
    }
  },
  methods: {
    cnxFacebook () {
      this.$store.dispatch('cnx/connexionUserFacebook').then(() => {
        // le user est connecté , on regarde s'il a un profil
        this.$store
          .dispatch('cnx/loadProfil')
          .then(() => {
            this.$store.dispatch('displayMessage', {
              code: 'CNXU',
              param: null
            })
            this.$store.commit('setDisplayMenuOn')
            this.$router.push('/')
          })
          .catch((err) => {
            // le chargement du login a échoué
            // on déconnecte console.log('profil-erreur' + err.message)
            this.$router.push('/')
            this.$store.dispatch('displayMessage', {
              code: 'ECNX',
              param: err.message
            })
          })
      })
    },
    login () {
      this.errorMsg = ''
      let self = this
      this.displayalert = false
      this.formError = ''
      // appel a la connexion firebase
      this.$store
        .dispatch('cnx/userLogin', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          // le user est connecté on peut récupérer son profil

          this.$store
            .dispatch('cnx/loadProfil')
            .then(() => {
              // utilisateur connecté et profil chargé
              self.$store.dispatch('displayMessage', {
                code: 'CNXU',
                param: null
              })
              this.$router.go(-1)
            })
            .catch((err) => {
              // le chargement du login a échoué
              // on appel la page des evenst en version non connecté
              this.$router.push({ name: 'listEvent' })
              // on indique à l'utilisateur que sa connexion a échouée
              self.$store.dispatch('displayMessage', {
                code: 'ECNX',
                param: err.message
              })
            })
        })
        .catch((error) => {
          console.log('login-error' + error.message)
          self.$store.dispatch('displayMessage', {
            code: 'ECNX',
            param: error.message
          })
        })
    },
    cnxgoogle () {
      this.$store
        .dispatch('cnx/connexionUserGoogle')
        .then(() => {
          // le user est connecté , on regarde s'il a un profil
          this.$store
            .dispatch('cnx/loadProfil')
            .then(() => {
              this.$store.dispatch('displayMessage', {
                code: 'CNXU',
                param: null
              })
              this.$store.commit('setDisplayMenuOn')
              this.$router.push('/')
            })
            .catch((err) => {
              // le chargement du login a échoué
              // on déconnecte
              this.$router.push('/')
              this.$store.dispatch('displayMessage', {
                code: 'ECNX',
                param: err.message
              })
            })
        })
        .catch((error) => {
          this.$store.dispatch('displayMessage', {
            code: 'ECNX',
            param: error.message
          })
        })
    }
  }
}
</script>

<style>
.login {
  margin-top: 15%;
  opacity: 0.8;
}
.icon_image {
  width: auto;
  height: auto;
  max-height: 2em;
  max-width: 2em;
  margin-top: -2px;
  margin-right: 10px;
}

#app {
  background-image: url('~@/assets/fond.jpg');
}
</style>

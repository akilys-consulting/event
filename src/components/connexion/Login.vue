<template>
  <div id="ex1">
    <v-card
      class="mx-auto login "
      hover
      flat
      max-height="400"
      max-width="500"
      outlined
    >
      <v-container>
        <v-row>
          <v-col md="8" offset-md="2">
            <v-form>
              <v-text-field
                label="Votre email"
                v-model="email"
                :placeholder="autofillLogin ? ` Email` : null"
                name="login"
                prepend-icon="mdi-account"
                type="text"
              />

              <v-text-field
                prepend-icon="mdi-lock"
                filled
                label="Votre mot de passe"
                :append-icon="show3 ? 'mdi-eye' : 'mdi-eye-off'"
                :type="show3 ? 'text' : 'password'"
                name="password"
                :placeholder="autofill ? ` Mot de passe` : null"
                v-model="password"
                class="input-group--focused"
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
                >{{ errorMsg }}</v-alert>
              <v-btn
                @click="login"
                block
                color="primary"
                class="text--lighten-1 text-body-2 mt-3"
                >connexion</v-btn>
            </v-form>
            <v-spacer></v-spacer>

            <v-row align="center" justify="center">
              <v-col cols="8" class="subtitle-2 font-weight-thin">
                Autre moyen de connexion
              </v-col>
              <v-col cols="4">
                <v-btn icon @click="cnxgoogle" class="mt-3"
                  ><img
                    class="icon_image"
                    src="require('@/assets/google_logo.svg')"
                  />
                </v-btn>

                <v-btn icon @click="cnxgoogle" class="mt-3"
                  ><img
                    class="icon_image"
                    src="require('@/assets/facebook_logo.svg')"
                  /></v-btn>
              <v-btn @click="login" block color="primary" class="mt-3"
                >Login</v-btn>
              </v-col>
            </v-row>

            <p class="overline font-weight-light text-right mt-3">
              <router-link to="/creation">créér un nouveau compte</router-link>
            </p>
          </v-col>
        </v-row>
        <!--</v-parallax>-->
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { fb } from '@/plugins/firebaseInit'
export default {
  name: 'login',
  data () {
    return {
      show3: false,
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
  /*
  created () {
    this.$store.dispatch('clearData')
  }, */

  mounted () {
    this.$store.commit('setDisplayMenuOff')
    console.log('login:Mounted')
  },
  destroyed () {
    var test = document.getElementById('app')
    test.style.backgroundImage = 'none'
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
    async login () {
      let self = this
      this.errorMsg = ''
      this.displayalert = false
      this.formError = ''
      await this.$store
        .dispatch('cnx/userLogin', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          // le user est connecté on peut récupérer son profil
          console.log('login-ok')

          self.$store
            .dispatch('cnx/loadProfil')
            .then(() => {
              console.log('profil-ok')
              self.$store.dispatch('displayMessage', {
                code: 'CNXU',
                param: null
              })
              this.$router.push('/')
            })
            .catch(err => {
              // le chargement du login a échoué
              // on déconnecte
              console.log('profil-erreur' + err.message)
              this.$router.push('/')

              self.$store.dispatch('displayMessage', {
                code: 'ECNX',
                param: err.message
              })
            })
        })
        .catch(error => {
          console.log('login-error')
          self.$store.dispatch('displayMessage', {
            code: 'ECNX',
            param: error.message
          })
        })
    },
    async cnxgoogle () {
      await this.$store.dispatch('cnx/connexionUserGoogle').then(() => {
        this.$store
          .dispatch('cnx/loadProfil')
          .then(() => {
            console.log('profil-ok')
            this.$store.dispatch('displayMessage', {
              code: 'CNXU',
              param: null
            })
            console.log('load default page')
            this.$store.commit('setDisplayMenuOn')
            this.$router.push('/')
          })
          .catch(err => {
            // le chargement du login a échoué
            // on déconnecte
            console.log('profil-erreur' + err.message)
            this.$router.push('/')
            this.$store.dispatch('displayMessage', {
              code: 'ECNX',
              param: err.message
            })
          })
      })
    }
  }
}
</script>

<style>
#app {
  background-image: url('~@/assets/fond.jpg');
}
.v-btn:not(.v-btn--round).v-size--default {
  min-width: 50%;
}
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
</style>

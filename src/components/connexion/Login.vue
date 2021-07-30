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
                >{{ errorMsg }}</v-alert
              >
              <v-btn @click="login" block color="primary" class="mt-3"
                >Login</v-btn
              >
            </v-form>
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
    login () {
      let self = this
      this.errorMsg = ''
      this.displayalert = false
      this.formError = ''
      this.$store
        .dispatch('cnx/userLogin', {
          email: this.email,
          password: this.password
        })
        .then(() => {
          self.$store.dispatch('displayMessage', { code: 'CNXU', param: null })
          this.$router.push('/')
        })
        .catch(error => {
          self.$store.dispatch('displayMessage', {
            code: 'CECNX',
            param: error.message
          })
          console.log(error)
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
</style>

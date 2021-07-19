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
              <v-btn
                @click="login"
                block
                color="light-green lighten-3"
                class="mt-3"
                >Login</v-btn
              >
            </v-form>
            <p class="overline font-weight-light text-right mt-3">
              <router-link to="/sign-up">créér un nouveau compte</router-link>
            </p>
          </v-col>
        </v-row>
        <!--</v-parallax>-->
      </v-container>
    </v-card>
  </div>
</template>

<script>
import { fb } from '@/firebaseDef.js'
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
  created () {
    this.$store.dispatch('clearData')
  },

  mounted () {
    this.$store.commit('setDisplayMenuOff')
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
    login: function () {
      let self = this
      this.errorMsg = ''
      this.displayalert = false
      const user = fb.auth.signInWithEmailAndPassword(this.email, this.password)
      user.then((user) => {
        this.$store.commit('setCurrentUser', user.user)
        this.$store.dispatch('fetchUserProfile')
        this.$store.commit('setDisplayMenuOn')
        self.$router.push({ name: 'listEvent' })
      })
      user.catch((err) => {
        this.displayalert = true
        console.log('connexion ko')
        this.errorMsg = err.message
        console.log(err)
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

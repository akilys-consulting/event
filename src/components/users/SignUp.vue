<template>
  <v-card>
    <v-container fluid>
      <!--<v-parallax dark src="https://cdn.vuetifyjs.com/images/backgrounds/vbanner.jpg">-->
      <v-row>
        <v-col md="8" offset-md="2">
          <v-form>
            <v-text-field
              label="votre email"
              v-model="email"
              prepend-icon="mdi-account"
              type="text"
            />

            <v-text-field
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              label="mot de passe"
              v-model="password"
              class="input-group--focused"
              @click:append="showPassword = !showPassword"
            />
            <v-spacer />
            <v-text-field
              prepend-icon="mdi-lock"
              :append-icon="showPasswordRedo ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPasswordRedo ? 'text' : 'password'"
              name="input-10-2"
              label="confirmation mot de passe"
              v-model="passwordRedo"
              class="input-group--focused"
              @click:append="showPasswordRedo = !showPasswordRedo"
            />
            <v-spacer />
            <v-alert
              dismissible
              outlined
              type="error"
              color="error"
              elevation="2"
              v-if="errorMsg !== ''"
              >{{ errorMsg }}</v-alert
            >
            <v-btn
              @click="signUp"
              block
              :loading="waiting"
              outlined
              color="teal"
              >Création compte</v-btn
            >
          </v-form>
        </v-col>
      </v-row>
      <!--</v-parallax>-->
    </v-container>
  </v-card>
</template>

<script>
import { fb } from '@/firebaseDef'
import { mapState } from 'vuex'
export default {
  name: 'signup',
  data () {
    return {
      email: '',
      password: '',
      passwordRedo: '',
      errorMsg: '',
      showPassword: false,
      showPasswordRedo: false,
      displayalert: false,
      loading: false
    }
  },

  computed: {
    ...mapState(['waiting'])
  },
  methods: {
    signUp: function () {
      this.$store.commit('setWaiting', true)
      let self = this
      if (this.password !== this.passwordRedo) {
        this.errorMsg = 'les mot de passe sont différents'
        self.$store.commit('setWaiting', false)
      } else {
        const user = fb.auth.createUserWithEmailAndPassword(
          this.email,
          this.password
        )
        user.then((data) => {
          let userData = data.user
          userData.profil = 'client'
          self.$store.commit('setCurrentUser', userData)
          self.$store.commit('setWaiting', false)
          self.$router.push({ name: 'profil' })
        })
        user.catch((err) => {
          self.$store.commit('setWaiting', false)
          self.errorMsg = err.message
          console.log(err)
        })
      }
    }
  }
}
</script>

<style></style>

<template>
  <v-card
    ><v-card-text>
      <v-form>
        <v-text-field
          label="votre email"
          v-model="profil.email"
          prepend-icon="mdi-account"
        />
        <v-text-field
          prepend-icon="mdi-lock"
          :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          label="mot de passe"
          v-model="profil.password"
          @click:append="showPassword = !showPassword"
        />
        <v-spacer />
        <v-text-field
          prepend-icon="mdi-lock"
          :append-icon="showPasswordRedo ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPasswordRedo ? 'text' : 'password'"
          name="input-10-2"
          label="confirmation mot de passe"
          v-model="profil.passwordRedo"
          class="input-group--focused"
          @click:append="showPasswordRedo = !showPasswordRedo"
        />
        <v-text-field v-model="profil.nom" label="Nom"></v-text-field>
        <v-text-field v-model="profil.prenom" label="Prénom"></v-text-field>
        <v-text-field
          v-model="profil.organisation"
          label="votre organisation"
        ></v-text-field>
        <v-spacer />
        <v-alert
          dismissible
          outlined
          type="error"
          color="error"
          elevation="2"
          v-if="errorMsg !== ''"
          >{{ errorMsg }}</v-alert
        ><v-row>
          <v-col cols="6"
            ><v-btn @click="signUp" block :loading="waiting" color="primary"
              >Création compte</v-btn
            >
          </v-col>
          <v-col cols="6"
            ><v-btn to="/" color="primary">Annuler</v-btn>
          </v-col></v-row
        ></v-form
      >
    </v-card-text>
  </v-card>
</template>

<script>
import { fb } from '@/plugins/firebaseInit'
import { mapState } from 'vuex'
export default {
  name: 'signup',
  data () {
    return {
      profil: {
        email: '',
        password: null,
        passwordRedo: null,
        nom: '',
        prenom: '',
        organisation: '',
        adresse: {}
      },
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
    async signUp () {
      this.$store.commit('setWaiting', true)
      let self = this
      if (this.profil.password !== this.profil.passwordRedo) {
        this.errorMsg = 'les mots de passe sont différents'
        self.$store.commit('setWaiting', false)
      } else {
        await this.$store
          .dispatch('cnx/userCreate', this.profil)
          .then(() => {
            self.$store.commit('setWaiting', false)
            self.$store.dispatch('displayMessage', {
              code: 'CNXU',
              param: null
            })
            self.$router.replace({ name: 'listEvent' }).catch(() => {})
          })
          .catch(error => {
            self.$store.commit('setWaiting', false)
          })
      }
    }
  }
}
</script>

<style></style>

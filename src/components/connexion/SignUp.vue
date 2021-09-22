<template>
  <v-card class="mx-auto login" max-width="500"
    ><v-card-title> Création d'un compte</v-card-title
    ><v-card-text>
      <v-row>
        <v-col md="8" offset-md="2">
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
            <!--<v-row>
              <v-col cols="6">
                <v-switch
                  hide-details
                  inset
                  color="red"
                  value="red"
                  v-model="active_admin"
                  label="cle admin ?"
                >
                  <template v-slot:label>
                    <v-tooltip color="pink" bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <span v-bind="attrs" v-on="on">cle admin ? </span>
                      </template>
                      la cle admin est fournie par le responsable du site pour
                      les gestionnaires. <br />contacter admin@resaplus.com si
                      besoin
                    </v-tooltip>
                  </template>
                </v-switch>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-if="active_admin"
                  label="Votre clef admin"
                  v-model="profil.admin_key"
                  prepend-icon="mdi-badge-account"
                  type="text"
                />
              </v-col>
            </v-row>-->

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
                ><v-btn @click="signUp" block :loading="waiting"
                  >Création compte</v-btn
                >
              </v-col>
              <v-col cols="6"><v-btn to="/">Annuler</v-btn> </v-col></v-row
            ></v-form
          ></v-col
        ></v-row
      >
    </v-card-text>
  </v-card>
</template>

<script>
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
        admin_key: null,
        adresse: {}
      },
      errorMsg: '',
      showPassword: false,
      showPasswordRedo: false,
      displayalert: false,
      loading: false,
      active_admin: false
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
          .catch(() => {
            self.$store.commit('setWaiting', false)
          })
      }
    }
  }
}
</script>

<style>
#app {
  background-image: url('~@/assets/fond.jpg') !important;
}
.login {
  margin-top: 15%;
  opacity: 0.8;
}
</style>

<template>
  <v-card class="mx-auto login" max-width="500"
    ><v-card-title> Création d'un compte</v-card-title
    ><v-card-text>
      <v-row>
        <v-col md="8" offset-md="2">
          <v-form>
            <v-text-field
              label="votre email"
              tabindex="1"
              v-model="dataForm.email"
              prepend-icon="mdi-account"
            />

            <v-text-field
              prepend-icon="mdi-lock"
              :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPassword ? 'text' : 'password'"
              label="mot de passe"
              tabindex="2"
              v-model="dataForm.password"
              @click:append="showPassword = !showPassword"
            />
            <v-spacer />
            <v-text-field
              prepend-icon="mdi-lock"
              :append-icon="showPasswordRedo ? 'mdi-eye' : 'mdi-eye-off'"
              :type="showPasswordRedo ? 'text' : 'password'"
              tabindex="3"
              label="confirmation mot de passe"
              v-model="dataForm.passwordRedo"
              @click:append="showPasswordRedo = !showPasswordRedo"
            />
            <v-text-field
              tabindex="4"
              v-model="dataForm.nom"
              label="Nom"
            ></v-text-field>
            <v-text-field
              v-model="dataForm.prenom"
              label="Prénom"
              tabindex="5"
            ></v-text-field>
            <v-text-field
              label="nom affiché"
              tabindex="6"
              v-model="dataForm.displayName"
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
            ><v-row>
              <v-col cols="6"
                ><v-btn tabindex="7" @click="signUp" plain
                  >Création compte</v-btn
                >
              </v-col>
              <v-col cols="6"
                ><v-btn tabindex="8" plain to="/">Annuler</v-btn>
              </v-col></v-row
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
      dataForm: {},
      infoLogin: {
        email: '',
        password: null,
        passwordRedo: null
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
    ...mapState(['waiting']),
    ...mapState('cnx', ['currentProfil'])
  },
  created () {
    this.dataForm = Object.assign({}, this.infoLogin, this.currentProfil)
    console.log('mix data')
    console.log(this.dataForm)
  },
  methods: {
    async signUp () {
      this.$store.commit('setWaiting', true)

      if (this.dataForm.password !== this.dataForm.passwordRedo) {
        this.errorMsg = 'les mots de passe sont différents'
      } else {
        try {
          // creation du user
          if (!this.dataForm.displayName) {
            this.dataForm.displayName =
              this.dataForm.nom + ' ' + this.dataForm.prenom
          }
          await this.$store.dispatch('cnx/userCreate', this.dataForm)
          // creation du profil OK, on part sur la page principale de l'application
          this.$router.push('/')
        } catch (error) {
          // on est sur des erreur
          this.$store.dispatch('displayMessage', {
            code: 'CEPR',
            param: error.message
          })
          this.$store.commit('setWaiting', false)
        }
      }
      this.$store.commit('setWaiting', false)
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

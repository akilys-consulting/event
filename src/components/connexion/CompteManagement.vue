<template>
  <v-tab-item>
    <v-card-text>
      <v-row v-if="!displayFrmEmail && !displayFrmPassword">
        <v-col cols="12">votre email {{ currentProfil.email }} </v-col>

        <v-col cols="6">
          <v-btn text x-small plain @click="displayFrmEmail = true">
            changer mon email
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn text x-small plain @click="activeFrmPassword">
            changer mot de passe
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="displayFrmEmail">
        <v-col cls="12">votre email : {{ currentProfil.email }}</v-col>
        <v-col cols="12">
          <v-text-field v-model="newEmail" label="Nouveau email"></v-text-field>
        </v-col>
        <v-col cols="6"
          ><v-btn text x-small plain @click="updateEmail()">
            valider
          </v-btn> </v-col
        ><v-col cols="6"
          ><v-btn
            text
            x-small
            plain
            @click="displayFrmEmail = !displayFrmEmail"
          >
            annuler
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-if="displayFrmPassword">
        <v-col cols="12">
          <v-text-field
            disabled
            filled
            dense
            flat
            :label="currentProfil.email"
          ></v-text-field>
          <span v-if="errorMsg" class="orange--text"
            >Attention : {{ errorMsg }}</span
          >
        </v-col>

        <v-col cols="6">
          <v-text-field
            prepend-icon="mdi-lock"
            :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPassword ? 'text' : 'password'"
            label="mot de passe"
            v-model="password"
            @click:append="showPassword = !showPassword"
          /> </v-col
        ><v-col cols="6">
          <v-text-field
            prepend-icon="mdi-lock"
            :append-icon="showPasswordRedo ? 'mdi-eye' : 'mdi-eye-off'"
            :type="showPasswordRedo ? 'text' : 'password'"
            name="input-10-2"
            label="confirmation mot de passe"
            v-model="passwordRedo"
            @click:append="showPasswordRedo = !showPasswordRedo"
          />
        </v-col>
        <v-col cols="6"
          ><v-btn text x-small plain @click="updatMotDePasse()">
            valider
          </v-btn>
        </v-col>
        <v-col cols="6"
          ><v-btn text x-small plain @click="DesactiveFrmPassword">
            annuler
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-tab-item>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      displayFrmEmail: false,
      displayFrmPassword: false,
      newEmail: null,
      password: null,
      passwordRedo: null,
      showPassword: false,
      showPasswordRedo: false,
      memoSearch: false,
      errorMsg: null
    }
  },
  name: 'compteManagement',
  computed: {
    ...mapState('cnx', ['currentProfil']),
    ...mapState('event', ['EVT_ACTIVE_SEARCH'])
  },
  methods: {
    updateEmail () {
      // appel
      try {
        this.$store.dispatch('cnx/updateEmail', this.newEmail)
      } catch (error) {
        this.$store.dispatch('displayMessage', {
          code: 'ADMIN',
          param: error.message
        })
      }
    },
    activeFrmPassword () {
      this.memoSearch = this.EVT_ACTIVE_SEARCH
      this.$store.commit('event/clearActiveSearch')
      this.displayFrmPassword = true
    },
    DesactiveFrmPassword () {
      if (this.memoSearch) this.$store.commit('event/setActiveSearch')
      this.displayFrmPassword = false
    },

    async updatMotDePasse () {
      if (this.password !== this.passwordRedo) {
        this.errorMsg = 'les mots de passe sont différents'
      } else {
        try {
          await this.$store.dispatch('cnx/updatePassword', this.password)
          this.DesactiveFrmPassword()
        } catch (error) {
          this.$store.dispatch('displayMessage', {
            code: 'ADMIN',
            param: error.message
          })
        }
      }
    }
  }
}
</script>

<style></style>

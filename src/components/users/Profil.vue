<template>
  <v-card>
    <v-container fluid>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="profil.nom"
            label="Nom"
            single-line
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="profil.prenom"
            label="Prénom"
            single-line
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="profil.organisation"
            label="votre organisation"
            single-line
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <adrmanagement :adresse="profil.adresse" @uptadr="updateadresse" />
        </v-col>
        <v-col cols="12">
          <v-spacer />
          <v-btn @click="signup" block outlined color="primary">Valider</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { mapState } from 'vuex'
import adrmanagement from '@/components/commun/AdrManagement'
export default {
  data: () => ({
    rules: {
      requiered: value => !!value || 'Obligatoire.'
    }
  }),
  components: { adrmanagement },
  computed: {
    ...mapState({ profil: 'currentUser.profil' })
  },
  created () {
    if (this.$store.getters.getUserUid === null) {
      this.$router.push({ name: 'login' })
    }
  },
  methods: {
    updateadresse: function (adr) {
      this.profil.adresse = adr
    },

    signup: function () {
      let self = this
      // creation du user
      let execute = this.$store.dispatch('addProfil')
      // ok => affichage fentre de login
      execute.then(function () {
        self.$store.dispatch('displayMessage', { code: 'UADD' })
        self.$router.push({ name: 'login' })
      })
      // KO => affiche erreur
      execute.catch(function (error) {
        self.$store.dispatch('displayMessage', {
          code: 'ADMIN',
          param: error.message
        })
      })
    }
  }
}
</script>

<style></style>

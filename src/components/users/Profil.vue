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
            v-model="profil.societe"
            suffix="(*)"
            :rules="[rules.requiered]"
            label="Nom société"
            single-line
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <adrmanagement :adresse="this.profil.ville" @uptadr="updateadresse" />
        </v-col>
        <v-col cols="12">
          <v-spacer />
          <v-btn @click="signup" block outlined color="primary">Valider</v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'
import adrmanagement from '@/components/commun/AdrManagement'
export default {
  data: () => ({
    rules: {
      requiered: (value) => !!value || 'Obligatoire.'
    }
  }),
  components: { adrmanagement },
  computed: {
    ...mapState(['profil'])
  },
  created () {
    if (this.profil.user_uid === null) this.$router.push({ name: 'login' })
  },
  methods: {
    updateadresse: function (adr) {
      this.profil.ville = adr
    },
    signup: function () {
      let self = this
      // creation du user
      let execute = this.$store.dispatch('addUser', this.profil)
      execute.then(function (data) {
        self.$store.dispatch('displayMessage', 'UADD')
        self.$router.push({ name: 'login' })
      })
      execute.catch(function () {
        self.$store.dispatch('displayMessage', 'UAKO')
      })
    }
  }
}
</script>

<style></style>

<template>
  <v-tab-item>
    <v-card-text>
      <v-row>
        <v-col cols="12">votre email {{ currentProfil.email }} </v-col>

        <v-col cols="6">
          <v-btn text x-small plain> changer mon email </v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn text x-small plain> changer mot de passe </v-btn>
        </v-col>
      </v-row></v-card-text
    >
  </v-tab-item>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {}
  },
  name: 'compteManagement',
  computed: { ...mapState('cnx', ['currentProfil']) }
}
</script>

<style></style>

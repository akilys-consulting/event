<template>
  <div>
    <v-app-bar v-if="display" app color="primary">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>quefaire.fr</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-divider class="mx-4" vertical></v-divider>
      <v-btn v-if="isAuthenticated" text to="/calendrier">
        gestion events</v-btn
      >
      <v-btn v-if="connected && !admin" text to="/preference">
        mes events</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn v-if="!isAuthenticated" text to="/login">Se connecter</v-btn>
      <profil v-else></profil>
    </v-app-bar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import profil from '@/components/connexion/Profil'

// @ is an alias to /src
export default {
  name: 'navbar',
  data () {
    return {
      drawer: false,
      displayProfil: false,
      connected: false,
      menuItem: [],
      admin: false
    }
  },

  components: { profil },
  computed: {
    ...mapState(['display']),
    ...mapGetters('cnx', ['isAuthenticated'])
  }
}
</script>

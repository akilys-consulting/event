<template>
  <div>
    <v-app-bar fixed flat v-if="display" app>
      <v-btn text small plain to="/">
        <img :src="require('@/assets/icon-site.png')" alt="Sortie-Toulouse" />
      </v-btn>

      <v-btn v-if="isAuthenticated && isAdmin" text to="/importEvent">
        <v-icon>mdi-import</v-icon>
        <span class="hidden-md-and-down">Importer</span>
      </v-btn>

      <v-btn v-if="isAuthenticated && isAdmin" text to="/calendrier">
        <v-icon>mdi-calendar-edit</v-icon>
        <span class="hidden-md-and-down">Calendrier</span>
      </v-btn>

      <v-btn class="hidden-md-and-up" text @click.stop="drawer = !drawer">
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <profil />

      <template v-slot:extension v-if="EVT_ACTIVE_SEARCH">
        <eventsearch class="hidden-sm-and-down"></eventsearch>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app absolute temporary>
      <v-card>
        <v-card-title>Rechercher... </v-card-title>
        <eventsearch></eventsearch>
      </v-card>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import profil from '@/components/connexion/ProfilForm'
import eventsearch from '@/components/client/SearchEvent'

// @ is an alias to /src
export default {
  name: 'navbar',
  data () {
    return {
      drawer: false,
      menuProfil: false,
      connected: false,
      menuItem: [],
      connexion: false
    }
  },

  components: { profil, eventsearch },
  computed: {
    ...mapState(['display']),
    ...mapState('cnx', ['isconnected']),
    ...mapState('event', ['EVT_ACTIVE_SEARCH']),
    ...mapGetters('cnx', ['isAuthenticated', 'isAdmin'])
  }
}
</script>
<style scoped></style>

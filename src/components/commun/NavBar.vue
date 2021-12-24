<template>
  <div>
    <v-app-bar
      fixed
      v-if="display"
      app
      color="primary"
      :src="require('@/assets/fond-menu.jpg')"
    >
      <template v-slot:img="{ props }">
        <v-img
          v-bind="props"
          gradient="to top right, rgba(103,131,94,.5), rgba(152,230,129,.8)"
        ></v-img>
      </template>
      <v-app-bar-nav-icon
        class="hidden-md-and-up"
        @click="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <v-app-bar-title class="hidden-md-and-down">Que Faire</v-app-bar-title>
      <v-spacer></v-spacer>

      <v-btn-toggle tile group>
        <v-btn
        text
         align="center"
          justify="center"
          to="/">
          <v-icon>mdi-view-list</v-icon>
          <span class="hidden-md-and-down">Sorties</span>
        </v-btn>
<v-btn v-if="isAuthenticated && isAdmin"
text align="center" justify="center" to="/importEvent">
          <v-icon>mdi-import</v-icon>
          <span class="hidden-md-and-down">import</span>
        </v-btn>

        <v-btn
          align="center"
          text
          justify="center"
          v-if="isAuthenticated && isAdmin"
          to="/calendrier">
          <v-icon>mdi-calendar-edit</v-icon>
          <span class="hidden-md-and-down">Calendrier</span>
        </v-btn>
        <v-btn
        text
          align="center"
          justify="center"
          v-if="isAuthenticated && isAdmin"
          to="/selectplan">
        <v-icon>mdi-floor-plan</v-icon>
          <span class="hidden-md-and-down">plan</span>
        </v-btn>
        <v-btn text align="center" justify="center"
class="hidden-md-and-up"  @click.stop="drawer = !drawer">
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
      <v-divider vertical align="right"></v-divider>
      <profil @closeProfil="menuProfil = false" />

      <template v-slot:extension v-if="EVT_ACTIVE_SEARCH">
        <eventsearch class="hidden-sm-and-down"></eventsearch>
      </template>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list nav dense>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            rechercher...
          </v-list-item-title>
          <eventsearch></eventsearch>
        </v-list-item-content>
      </v-list>
    </v-navigation-drawer>
    <!-- affichage de la barre de recherche d'event -->
  </div>
  </v-card>
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
<style scoped>
menu {
  text-align: center;
}
</style>

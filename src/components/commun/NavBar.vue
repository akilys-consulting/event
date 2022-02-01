<template>
  <div>
    <v-app-bar fixed flat v-if="display" :extensionHeight="extensionHeight" app>
      <v-btn text small plain to="/">
        <img :src="require('@/assets/icon-site.png')" alt="Sortie-Toulouse" />
      </v-btn>

      <v-menu class="mt-2" offset-y min-width="200">
        <template v-slot:activator="{ on, attrs }">
          <v-chip outlined class="hidden-lg-and-up" v-bind="attrs" v-on="on"
            ><v-icon>mdi-magnify</v-icon>Rechercher...
          </v-chip>
        </template>
        <v-card>
          <v-card-subtitle class="text-center"
            >Vos critères des recherches</v-card-subtitle
          >
          <v-card-text> <eventsearch></eventsearch></v-card-text>
        </v-card>
      </v-menu>
      <v-spacer></v-spacer>

      <eventsearch
        class="hidden-md-and-down"
        v-if="EVT_ACTIVE_SEARCH"
      ></eventsearch>
      <v-spacer></v-spacer>

      <v-chip
        class="mx-2"
        outlined
        v-if="isAuthenticated && isAdmin"
        to="/importEvent"
      >
        <v-icon>mdi-import</v-icon>
        <span class="hidden-md-and-down">Importer</span>
      </v-chip>

      <v-chip outlined v-if="isAuthenticated && isAdmin" to="/calendrier">
        <v-icon>mdi-calendar-edit</v-icon>

        <span class="hidden-md-and-down">Calendrier</span>
      </v-chip>
      <v-spacer></v-spacer>

      <profil />
    </v-app-bar>
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
    ...mapState(['display', 'displayMenuSearch']),
    ...mapState('cnx', ['isconnected']),
    ...mapState('event', ['EVT_ACTIVE_SEARCH']),
    ...mapGetters('cnx', ['isAuthenticated', 'isAdmin']),

    extensionHeight () {
      return this.$vuetify.breakpoint.name === 'sm' ||
        this.$vuetify.breakpoint.name === 'xs'
        ? 1
        : 50
    }
  }
}
</script>
<style scoped></style>

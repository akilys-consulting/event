<template>
  <div>
    <v-dialog v-model="DisplaySend2email">
      <email />
    </v-dialog>
    <v-skeleton-loader v-if="firstLoad" type="table"></v-skeleton-loader>
    <v-data-iterator
      hide-default-footer
      :page.sync="page"
      :items="filteredItems"
      :items-per-page="getItemsPerPage"
      :sort-by="['start']"
      no-results-text="Pas d'évènement trouvé"
    >
      <template v-slot:default="{ items }">
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.start + item.end + item.name"
            cols="12"
            xs="12"
            sm="6"
            lg="3"
            md="4"
            class="d-flex child-flex"
          >
            <displayEvent
              :key="item.start + item.end + item.nom"
              :itemPlanning="item"
          /></v-col>
        </v-row>
      </template>
      <template v-slot:no-data>
        <v-img :src="require('@/assets/rechercheko.jpg')"> </v-img>
      </template>
      <template v-slot:footer>
        <v-row align="center" justify="center">
          <v-btn
            x-small
            fab
            class="mr-4"
            outlined
            color="white"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="white--text"
            >Page {{ page }} of {{ numberOfPages }}</span
          >

          <v-btn
            x-small
            fab
            class="ml-4"
            outlined
            color="white"
            @click="nextPage"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn></v-row
        >
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
import displayEvent from '@/components/client/DisplayEvent'
import email from '@/components/commun/EmailManagement'
import mixFunctions from '@/components/commun/Functions'
import moment from 'moment'
import { mapState, mapGetters } from 'vuex'

export default {
  name: 'listEvent',
  mixins: [mixFunctions],
  components: { displayEvent, email },
  data () {
    return {
      page: 1,
      pageCount: 0,

      firstLoad: true,
      items_per_page: [5, 15, 20],
      sortDesc: false,
      itemsPerPage: 5,
      // planning: [],
      key: 1,
      DisplaySend2email: false
    }
  },
  computed: {
    ...mapState('event', ['events', 'planning']), // assuming you are using namespaced modules
    ...mapGetters('event', [
      'getEVT_SRCH_DT',
      'getEVT_SRCH_CAT',
      'getEVT_SRCH_CRITERE',
      'getEVT_SRCH_GRATUIT',
      'getEVT_SRCH_ENFANT'
    ]),

    numberOfPages () {
      return Math.ceil(this.filteredItems.length / this.getItemsPerPage)
    },

    filteredItems () {
      // on récupère les enregistrements correspondant aux critères
      let allElements = []
      allElements = this.planning.filter((row) => {
        return this.searchByCritere(row)
      })

      /* allElements = allElements.sort((eventa, eventb) => {
        let dateEventa = moment(eventa.start, 'YYYY-MM-DD')
        let dateEventb = moment(eventb.start, 'YYYY-MM-DD')

        return moment(dateEventa).diff(dateEventb)
      }) */

      // on dédoublonne au niveau du nom pour n'afficher qu'un évènement
      allElements = allElements.filter(
        (event, index, self) =>
          index === self.findIndex((t) => t.name === event.name)
      )
      return allElements
    },

    computedville: function (item) {
      let ville = item.adr.split(',')
      return ville[ville.length - 3]
    },
    getItemsPerPage () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs':
          return 6
        case 'sm':
          return 8
        case 'md':
          return 6
        case 'lg':
          return 12
        case 'xl':
          return 8
      }
    }
  },
  async created () {
    let self = this
    this.$store.commit('setDisplayMenuOn')
    this.$store.commit('event/setActiveSearch')

    // charger les events via la liste des events et leurs planning
    this.$store.dispatch('startWaiting')
    this.$store
      .dispatch('event/loadPlanning')
      .then(() => {
        // les events sont chargés
        // self.planning = self.$store.getters['event/getAllPlanning']
        this.$store.dispatch('stopWaiting')
        this.firstLoad = false
      })
      .catch((error) => {
        self.$store.dispatch('stopWaiting')
        self.$store.dispatch('displayMessage', {
          code: 'LEVT',
          param: error.message
        })
      })
  },

  methods: {
    displayDate (date) {
      return moment(date, 'YYYY-MM-DD HH:mm').format('DD/MM/YYYY HH:mm')
    },

    searchByCritere (row) {
      let dateDebut = moment(row.start, 'YYYY-MM-DD')
      let dateSearch = moment(this.getEVT_SRCH_DT, 'YYYY-MM-DD').subtract(
        1,
        'days'
      )

      let critereMatch = true

      if (this.getEVT_SRCH_DT) critereMatch = dateSearch.isBefore(dateDebut)

      if (this.getEVT_SRCH_CAT) {
        critereMatch =
          critereMatch && row.category.includes(this.getEVT_SRCH_CAT)
      }

      if (this.getEVT_SRCH_CRITERE) {
        critereMatch =
          critereMatch &&
          row.name
            .toUpperCase()
            .includes(this.getEVT_SRCH_CRITERE.toUpperCase())
      }

      if (this.getEVT_SRCH_GRATUIT) {
        critereMatch = critereMatch && !row.prix
      }
      if (this.getEVT_SRCH_ENFANT) {
        critereMatch = critereMatch && row.enfant
      }

      return critereMatch
    },

    getAdresseEvent (row) {
      let event = this.events.find((element) => {
        if (typeof element.localisation === 'undefined') return false
        else {
          return element.localisation.adr
            .toUpperCase()
            .includes(this.getEVT_SRCH_CRITERE.toUpperCase())
        }
      })
      return !!event
    },

    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },

    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },

    updateItemsPerPage (number) {
      this.itemsPerPage = number
    }
  }
}
</script>

<style></style>

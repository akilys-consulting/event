<template>
  <div>
    <v-dialog v-model="DisplaySend2email">
      <email />
    </v-dialog>
    <v-skeleton-loader v-if="firstLoad" type="table"></v-skeleton-loader>
    <v-data-table
      class="elevation-1"
      :items="filteredItems"
      :sort-by="['category', 'start']"
      group-by="start"
      item-key="name+start"
      :show="!firstLoad"
      :items-per-page="5"
      no-results-text="Pas d'évènement trouvé"
      show-group-by
    >
      <template v-slot:header>
        <v-toolbar class="mb-1">
          <v-menu
            v-model="picker_date"
            :close-on-content-click="false"
            max-width="290"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                flat
                solo-inverted
                append-icon="mdi-clock-outline"
                :value="search"
                clearable
                label="début après le"
                hide-details
                readonly
                v-on="on"
                @click:clear="search = null"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="search"
              @change="picker_date = false"
            ></v-date-picker> </v-menu
          ><v-spacer></v-spacer>
          <v-select
            v-model="category"
            hide-details
            flat
            append-icon="mdi-filter-variant"
            clearable
            :items="getCategorie"
            label="Catégorie"
          ></v-select
          ><v-spacer></v-spacer>
          <v-text-field
            flat
            solo-inverted
            v-model="critere"
            append-icon="mdi-magnify"
            label="rechercher..."
            clearable
            single-line
            hide-details
          ></v-text-field>
        </v-toolbar>
      </template>
      <template v-slot:group.header="{ items, isOpen, toggle }">
        <th colspan="2">
          <v-icon @click="toggle"
            >{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>

          {{ displayDate(items[0].start) }}
        </th>
      </template>
      <template v-slot:item="{ item }">
        <displayEvent
          :key="item.start + item.end + item.nom"
          :itemPlanning="item"
          @send2EMail="send2email()"
        />
      </template>
    </v-data-table>
  </div>
</template>

<script>
import displayEvent from '@/components/client/DisplayEvent'
import email from '@/components/commun/EmailManagement'
import mixFunctions from '@/components/commun/Functions'
import moment from 'moment'
import { mapState } from 'vuex'

export default {
  name: 'listEvent',
  mixins: [mixFunctions],
  components: { displayEvent, email },
  data () {
    return {
      critere: '',
      firstLoad: true,
      category: '',
      picker_date: false,
      itemsPerPageArray: [4, 8, 12],
      search: '',
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      // planning: [],
      key: 1,
      DisplaySend2email: false
    }
  },
  computed: {
    ...mapState('event', ['events', 'planning', 'CONST_CATEGORIE']), // assuming you are using namespaced modules

    numberOfPages () {
      return Math.ceil(this.filteredItems.length / this.itemsPerPage)
    },

    filteredItems () {
      return this.planning.filter(row => {
        this.firstLoad = false
        return this.searchByCritere(row)
      })
    },

    computedville: function (item) {
      let ville = item.adr.split(',')
      return ville[ville.length - 3]
    },
    getCategorie () {
      let nomCategorie = []
      this.CONST_CATEGORIE.forEach(data => {
        nomCategorie.push(data.nom)
      })
      return nomCategorie
    }
  },
  async created () {
    let self = this
    this.$store.commit('setDisplayMenuOn')
    console.log('listEvent : created')

    // charger les events via la liste des events et leurs planning
    this.$store.dispatch('startWaiting')
    let execute = this.$store
      .dispatch('event/loadPlanning')
      .then(() => {
        // les events sont chargés
        // self.planning = self.$store.getters['event/getAllPlanning']
        self.$store.dispatch('stopWaiting')
      })
      .catch(error => {
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
      let dateSearch = moment(this.search, 'YYYY-MM-DD')
      let critereMatch = true

      if (this.search) critereMatch = dateSearch.isBefore(dateDebut)

      if (this.category) {
        critereMatch = critereMatch && row.category.includes(this.category)
      }

      if (this.critere) {
        critereMatch =
          critereMatch &&
          (row.name.toUpperCase().includes(this.critere.toUpperCase()) ||
            this.getAdresseEvent(row.id))
      }

      return critereMatch
    },

    getAdresseEvent (eventId) {
      let search = this.critere
      let event = null
      event = this.events.find(element => {
        if (typeof element.localisation === 'undefined') return false
        else {
          return (
            element.localisation.adr
              .toUpperCase()
              .includes(search.toUpperCase()) && element.id == eventId
          )
        }
      })
      if (event) return true
      else return false
    },

    nextPage () {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },

    formerPage () {
      if (this.page - 1 >= 1) this.page -= 1
    },

    updateItemsPerPage (number) {
      this.itemsPerPage = number
    },
    send2email () {
      console.log('send2email')
      this.DisplaySend2email = true
    }
  }
}
</script>
<style></style>

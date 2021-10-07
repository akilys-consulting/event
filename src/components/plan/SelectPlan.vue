<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn color="pink" v-on="on" @click="addPlan()" dark small>
              <v-icon>mdi-plus</v-icon>Ajouter un plan
            </v-btn>
          </template>
          <span>Ajouter un plan</span>
        </v-tooltip>
      </v-col>
    </v-row>
    <v-row v-if="plans.length > 1">
      <v-col cols="12">
        <v-data-iterator
          :items="filteredItems"
          :items-per-page.sync="itemsPerPage"
          :page="page"
          :sort-by="sortBy.toLowerCase()"
          :sort-desc="sortDesc"
          hide-default-footer
          no-results-text="Pas de plan trouvé"
        >
          <template v-slot:header>
            <v-toolbar>
              <v-text-field
                v-model="search"
                clearable
                flat
                solo-inverted
                hide-details
                @click:clear="clearSearch"
                prepend-inner-icon="mdi-magnify"
                label="chercher..."
              ></v-text-field>
            </v-toolbar>
          </template>

          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="item in props.items"
                :key="item.nom"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <displayPlan :itemPlan="item" />
              </v-col>
            </v-row>
          </template>

          <template v-slot:footer>
            <v-row>
              <v-col cols="8">
                <span class="grey--text">plan par page</span>
                <v-menu offset-y>
                  <template v-slot:activator="{ on }">
                    <v-btn dark text color="primary" v-on="on">
                      {{ itemsPerPage }}
                      <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-for="(number, index) in itemsPerPageArray"
                      :key="index"
                      @click="updateItemsPerPage(number)"
                    >
                      <v-list-item-title>{{ number }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
              <v-col cols="4" style="margin-left: auto">
                <span grey--text>Page {{ page }} of {{ numberOfPages }}</span>
                <v-btn x-small dark color="blue darken-3" @click="formerPage">
                  <v-icon>mdi-chevron-left</v-icon>
                </v-btn>
                <v-btn x-small dark color="blue darken-3" @click="nextPage">
                  <v-icon>mdi-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-col>
    </v-row>
    <v-row v-if="plans.length == 1">
      <v-col cols="12">
        <displayPlan :itemPlan="plans[0]" :taille="plans.length" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import displayPlan from '@/components/plan/DisplayPlan'
import mixFunctions from '@/components/commun/Functions'
import { fb } from '@/plugins/firebaseInit'

export default {
  name: 'selectplan',
  mixins: [mixFunctions],
  components: { displayPlan },
  data () {
    return {
      nouveauPlan: {
        date: [],
        nom: '',
        personelImage: false,
        ville: { adr: '', latLng: { lat: 0, lng: 0 } }
      },
      test: true,
      itemsPerPageArray: [4, 8, 12],
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      itemsPerPage: 4,
      sortBy: 'nom',
      performingRequest: false,
      errorMsg: '',
      plans: []
    }
  },
  mounted () {
    var self = this
    this.$store.dispatch('startWaiting')
    console.log('arrivé sur select plan')
    fb.planCollection
      .get()
      // ajouter condition actif
      .then(function (querySnapshot) {
        if (querySnapshot.empty) {
          self.$store.dispatch('displayMessage', 'SSNS')
        } else {
          console.log('querySnapshot')
          querySnapshot.forEach(function data (plan) {
            var currentPlan = plan.data()
            currentPlan.id = plan.id
            self.plans.push(currentPlan)
          })
        }
        self.$store.dispatch('stopWaiting')
      })
      .catch(() => {
        self.$store.dispatch('stopWaiting')
        self.$store.dispatch('displayMessage', 'SSNS')
      })
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.plans.length / this.itemsPerPage)
    },
        filteredItems () {
      return this.plans.filter((row) => {
        return row.nom.toUpperCase().includes(this.search.toUpperCase())
      })
    },
  },
  methods: {
    clearSearch() {
      this.search = ''
    },
    computedville: function (item) {
      let ville = item.adr.split(',')
      return ville[ville.length - 3]
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
    addPlan () {
      this.$store.commit('plan/setInitCurrentPlan')
      this.$router.push({ name: 'planForm' })
    }
  }
}
</script>
<style>
#app {
  background-image: none !important;
}
</style>

<template>
  <v-row align="center" justify="center">
    <v-col cols="12" lg="auto">
      <v-menu
        ref="menu_date"
        v-model="menu_date"
        :close-on-content-click="false"
        :nudge-right="40"
        :return-value.sync="date"
        transition="scale-transition"
        offset-y
        max-width="290px"
        min-width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-chip
            v-bind="attrs"
            v-on="on"
            outlined
            close
            @click:close="date = null"
            :color="date ? 'green' : 'none'"
          >
            après le : {{ formatedDate(date) }} </v-chip
          ><span class="pl-2 hidden-lg-and-up"> Filter sur une date</span>
        </template>
        <v-date-picker
          v-if="menu_date"
          v-model="date"
          :min="today"
          @change="$refs.menu_date.save(date)"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-divider></v-divider>

    <v-col cols="12" lg="auto">
      <v-menu :offset-y="true" :close-on-content-click="false" offset-x rounded>
        <template v-slot:activator="{ on }">
          <v-chip
            :color="nbCatSelected > 0 ? 'green' : 'none'"
            v-on="on"
            outlined
            @click:close="close"
            close
            >Categories
            {{ nbCatSelected > 0 ? '(' + nbCatSelected + ')' : '' }}</v-chip
          ><span class="pl-2 hidden-lg-and-up"> Filter sur des thèmes</span>
        </template>
        <v-card
          color="blue-grey lighten-4"
          outlined
          max-width="400"
          class="px-4 pb-2 cardColor"
        >
          <v-card-subtitle>Les catégories</v-card-subtitle>

          <v-chip-group column multiple v-model="categorie">
            <v-row>
              <v-col cols="6" v-for="cat in getCategories" :key="cat.nom">
                <v-chip filter :color="cat.couleur">
                  {{ cat.nom }}
                </v-chip></v-col
              ></v-row
            >
          </v-chip-group>
        </v-card>
      </v-menu>
    </v-col>
    <v-divider></v-divider>

    <v-col cols="12" lg="auto">
      <v-menu :close-on-content-click="false" offset-x rounded>
        <template v-slot:activator="{ on }">
          <v-chip v-on="on" close @click:close="clearOptions" outlined
            >options </v-chip
          ><span class="pl-2 hidden-lg-and-up"> (enfants, tarifs, etc)</span>
        </template>
        <v-card
          color="blue-grey lighten-4"
          outlined
          max-width="350"
          class="px-4 pb-2 cardColor"
        >
          <v-switch
            dense
            flat
            v-model="evtGratuit"
            class="mt-4"
            label="Gratuit"
          ></v-switch>
          <v-switch
            dense
            class="mt-4"
            flat
            v-model="evtEnfant"
            label="Enfants"
          ></v-switch></v-card></v-menu
    ></v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return { menu_date: false, nbCatSelected: 0 }
  },

  computed: {
    ...mapGetters('event', [
      'getCategories',
      'getCategoriesSecondaries',
      'getEVT_SRCH_CAT',
      'getEVT_SRCH_DT',
      'getEVT_SRCH_CRITERE',
      'getEVT_SRCH_ENFANT',
      'getEVT_SRCH_GRATUIT'
    ]),

    today () {
      return moment().format('YYYY-MM-DD')
    },
    critere: {
      get () {
        return this.getEVT_SRCH_CRITERE
      },
      set (value) {
        this.$store.commit('event/setEVT_SRCH_CRITERE', value)
      }
    },
    categorie: {
      get () {
        return ''
      },
      set (value) {
        let lstValue = []

        value.forEach((data) => {
          lstValue.push(this.getCategories[data].nom)
        })

        this.$store.commit('event/setEVT_SRCH_CAT', lstValue)
        this.nbCatSelected = lstValue.length
      }
    },
    date: {
      get () {
        return this.getEVT_SRCH_DT
      },
      set (value) {
        this.$store.commit('event/setEVT_SRCH_DT', value)
      }
    },
    evtGratuit: {
      get () {
        return this.getEVT_SRCH_GRATUIT
      },
      set (value) {
        this.$store.commit('event/setEVT_SRCH_GRATUIT', value)
      }
    },
    evtEnfant: {
      get () {
        return this.getEVT_SRCH_ENFANT
      },
      set (value) {
        this.$store.commit('event/setEVT_SRCH_ENFANT', value)
      }
    }
  },
  methods: {
    formatedDate (date) {
      return date ? moment(date).format('DD/MM/YYYY') : null
    },
    close () {
      this.$store.commit('event/setEVT_SRCH_CAT', '')
      this.nbCatSelected = 0
    },
    clearOptions () {
      this.$store.commit('event/setEVT_SRCH_GRATUIT', false)
      this.$store.commit('event/setEVT_SRCH_ENFANT', false)

      this.nbCatSelected = 0
    }
  }
}
</script>

<style scoped>
.cardColor {
  opacity: 0.9;
}
</style>

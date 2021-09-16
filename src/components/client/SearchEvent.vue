<template>
  <v-row>
    <v-col cols="12" md="3">
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
          <v-text-field
            :value="formatedDate(date)"
            label="début après le"
            prepend-icon="mdi-calendar-month"
            readonly
            clearable
            v-bind="attrs"
            v-on="on"
          ></v-text-field>
        </template>
        <v-date-picker
          v-if="menu_date"
          v-model="date"
          @change="$refs.menu_date.save(date)"
        ></v-date-picker>
      </v-menu>
    </v-col>
    <v-col cols="12" md="3">
      <v-select
        v-model="categorie"
        hide-details
        flat
        append-icon="mdi-filter-variant"
        clearable
        color="white"
        :items="getCategories"
        label="Catégorie"
      ></v-select> </v-col
    ><v-col cols="12" md="3">
      <v-text-field
        flat
        v-model="critere"
        append-icon="mdi-magnify"
        label="rechercher..."
        clearable
        color="white"
      ></v-text-field>
    </v-col>
    <v-col cols="12" md="3">
      <v-switch
        dense
        flat
        hide-details
        color="pink"
        v-model="evtGratuit"
        label="Gratuit"
      ></v-switch>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return { menu_date: false }
  },

  computed: {
    ...mapState('event', [
      'CONST_CATEGORIE',
      'EVT_SRCH_CAT',
      'EVT_SRCH_CRITERE',
      'EVT_SRCH_DT'
    ]),
    ...mapGetters('event', [
      'getCategories',
      'getEVT_SRCH_CAT',
      'getEVT_SRCH_DT',
      'getEVT_SRCH_CRITERE'
    ]),

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
        return this.getEVT_SRCH_CAT
      },
      set (value) {
        this.$store.commit('event/setEVT_SRCH_CAT', value)
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
    }
  },
  methods: {
    formatedDate (date) {
      console.log('date' + date)
      return date ? moment(date).format('DD/MM/YYYY') : null
    }
  }
}
</script>

<style scoped></style>

<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="auto">
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
            @click:clear="date = null"
            :value="formatedDate(date)"
            placeholder="début après le"
            prepend-icon="mdi-calendar-month"
            readonly
            clearable
            flat
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
    <v-col cols="12" sm="auto">
      <v-chip-group v-model="categorie">
        <v-chip
          v-for="cat in categorie"
          :key="cat.nom"
          filter
          :color="cat.couleur"
          class="pa-2"
        >
          {{ cat.nom }}
        </v-chip>
        <v-menu offset-y rounded>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              class="pa-2"
              x-small
              v-on="on"
              color="primary"
              elevation="0"
              v-bind="attrs"
              fab
              >+
            </v-btn>
          </template>
          <v-card class="px-4 pb-2 cardColor">
            <v-chip
              class="mr-2 mt-2"
              v-for="cat in getCategoriesSecondaries"
              :key="cat.nom"
              filter
              :color="cat.couleur"
              >{{ cat.nom }}</v-chip
            >
          </v-card>
        </v-menu>
      </v-chip-group>
    </v-col>

    <v-col cols="12" sm="auto">
      <v-text-field
        flat
        v-model="critere"
        prepend-icon="mdi-magnify"
        label="rechercher..."
        clearable
        @click:clear="critere = null"
      ></v-text-field>
    </v-col>
    <v-col cols="12" sm="auto">
      <v-switch
        dense
        flat
        hide-details
        v-model="evtGratuit"
        label="Gratuit"
      ></v-switch>
      <v-switch
        dense
        flat
        hide-details
        v-model="evtEnfant"
        label="spectacle Enfants"
      ></v-switch
    ></v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'

export default {
  data () {
    return { menu_date: false }
  },

  computed: {
    ...mapGetters('event', [
      'getCategoriesMaster',
      'getCategoriesSecondaries',
      'getEVT_SRCH_CAT',
      'getEVT_SRCH_DT',
      'getEVT_SRCH_CRITERE',
      'getEVT_SRCH_ENFANT',
      'getEVT_SRCH_GRATUIT'
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
        return this.getCategoriesMaster
      },
      set (value) {
        let allValues = this.getCategoriesMaster.concat(
          this.getCategoriesSecondaries
        )

        this.$store.commit(
          'event/setEVT_SRCH_CAT',
          typeof value === 'undefined' ? value : allValues[value].nom
        )
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
    }
  }
}
</script>

<style scoped>
.cardColor {
  opacity: 0.8;
}
</style>

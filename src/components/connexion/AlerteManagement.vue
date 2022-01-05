<template>
  <v-tab-item>
    <v-card-text>
      <v-row>
        <v-col cols="12">
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
                @click:clear="checkValidateDate"
                :value="formatedDate(currentProfil.alerte.date)"
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
              v-model="currentProfil.alerte.date"
              @change="$refs.menu_date.save(currentProfil.alerte.date)"
            ></v-date-picker>
          </v-menu>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="currentProfil.alerte.categorie"
            hide-details
            flat
            prepend-icon="mdi-list-status"
            clearable
            color="white"
            :items="getCategories"
            label="Catégorie"
            @change="checkValidate"
          ></v-select> </v-col
        ><v-col cols="12">
          <span
            class="orange--text"
            v-if="
              !currentProfil.alerte.date || !this.currentProfil.alerte.categorie
            "
            >date et catégorie sont obligatoires pour activer une alerte</span
          >
          <v-switch
            v-model="currentProfil.alerte.activate"
            :disabled="
              !currentProfil.alerte.date || !currentProfil.alerte.categorie
            "
            inset
            @change="validateAlerte"
            label="activation"
          ></v-switch> </v-col></v-row
    ></v-card-text>
  </v-tab-item>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import moment from 'moment'

export default {
  name: 'alerteManagement',
  data () {
    return {
      categorie: null,
      date: null,
      menu_date: false
    }
  },
  computed: {
    ...mapGetters('event', ['getCategories']),
    ...mapState('cnx', ['currentProfil'])
  },
  mounted () {
    this.date = this.getAlerteDate
    this.categorie = this.getAlerteCategorie
    console.log('activate' + this.currentProfil.alerte.activate)
  },
  methods: {
    formatedDate (date) {
      return date ? moment(date).format('DD/MM/YYYY') : null
    },
    checkValidate () {
      if (
        !this.currentProfil.alerte.date ||
        !this.currentProfil.alerte.categorie
      ) {
        this.currentProfil.alerte.activate = false
      }
      return true
    },
    checkValidateDate () {
      this.currentProfil.alerte.date = null
      this.currentProfil.alerte.activate = false
    },
    validateAlerte () {
      this.$store.dispatch('cnx/saveProfil', this.currentProfil).then(() => {
        this.$store.dispatch('displayMessage', {
          code: this.currentProfil.alerte.activate ? 'AACT' : 'ADIS',
          param: null
        })
      })
    }
  }
}
</script>

<style></style>

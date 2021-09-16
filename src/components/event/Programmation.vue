<template>
  <div>
    <dialogmodal ref="questionDelete" @responseOK="confirmedelete(item)">
    </dialogmodal>

    <v-dialog overlay-opacity="0.4" overlay-color="white" v-model="dialog">
      <v-card elevation="3">
        <v-card-subtitle>
          <span class="subtitle-2">{{ formTitle }}</span>
        </v-card-subtitle>
        <v-form ref="form" lazy-validation>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-select
                  :items="typeProgrammation"
                  item-text="text"
                  item-value="value"
                  v-model="editedItem.type"
                >
                </v-select>
              </v-col>
              <v-col cols="12" md="4">
                <v-col cols="12">
                  <v-menu
                    ref="menu_DD"
                    v-model="menu_DD"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="editedItem.dtDebut"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatedDate(editedItem.dtDebut)"
                        label="date début"
                        prepend-icon="mdi-calendar-month"
                        readonly-
                        v-bind="attrs"
                        v-on="on"
                        :rules="[v => !!v || 'champ obligatoire']"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-if="menu_DD"
                      v-model="editedItem.dtDebut"
                      @change="propagationDate()"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="menu_DF"
                    v-model="menu_DF"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="editedItem.dtFin"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formatedDate(editedItem.dtFin)"
                        label="date de fin"
                        prepend-icon="mdi-calendar-month"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        :rules="[v => !!v || 'champ obligatoire']"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-if="menu_DF"
                      v-model="editedItem.dtFin"
                      @change="$refs.menu_DF.save(editedItem.dtFin)"
                    ></v-date-picker>
                  </v-menu> </v-col
              ></v-col>
              <v-col cols="12" md="4">
                <v-col cols="12">
                  <v-menu
                    ref="menu_HD"
                    v-model="menu_HD"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="editedItem.heureDebut"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedItem.heureDebut"
                        label="heure début"
                        prepend-icon="mdi-clock-outline"
                        readonly
                        v-bind="attrs"
                        :rules="[v => !!v || 'champ obligatoire']"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu_HD"
                      v-model="editedItem.heureDebut"
                      format="24hr"
                      :max="editedItem.heureFin"
                      @click:minute="$refs.menu_HD.save(editedItem.heureDebut)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12">
                  <v-menu
                    ref="menu_HF"
                    v-model="menu_HF"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="editedItem.heureFin"
                    transition="scale-transition"
                    offset-y
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="editedItem.heureFin"
                        label="heure fin"
                        prepend-icon="mdi-clock-outline"
                        readonly
                        v-bind="attrs"
                        :rules="[v => !!v || 'champ obligatoire']"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-time-picker
                      v-if="menu_HF"
                      v-model="editedItem.heureFin"
                      format="24hr"
                      :min="editedItem.heureDebut"
                      @click:minute="$refs.menu_HF.save(editedItem.heureFin)"
                    ></v-time-picker>
                  </v-menu>
                </v-col>
              </v-col>
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="close">Annuler</v-btn>
            <v-btn color="primary" outlined text @click="saveItem"
              >Valider</v-btn
            >
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <v-card hover evevation="15">
      <v-card-subtitle
        >Programmation
        <v-btn color="primary" fab x-small @click.stop="dialog = true">
          <v-icon x-small dark>mdi-plus</v-icon>
        </v-btn>
      </v-card-subtitle>
      <v-card-text>
        <v-data-table
          :headers="headers"
          no-data-text="pas encore de programmation"
          :items="planning"
          class="elevation-1"
        >
          <template v-slot:[`item.dtDebut`]="{ item }">
            {{ displayDtFr(item.dtDebut) }}
          </template>
          <template v-slot:[`item.dtFin`]="{ item }">
            {{ displayDtFr(item.dtFin) }}
          </template>
          <template v-slot:[`item.type`]="{ item }">
            <v-select
              :items="typeProgrammation"
              item-text="text"
              item-value="value"
              v-model="item.type"
              disabled
            >
            </v-select>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon small class="mr-2" @click="editItem(item)">
              mdi-pencil
            </v-icon>
            <v-icon small @click="deleteItem(item)">
              mdi-delete
            </v-icon>
          </template>
        </v-data-table></v-card-text
      ></v-card
    >
  </div>
</template>

<script>
import { mapState } from 'vuex'
import dialogmodal from '@/components/commun/DialogModal'
import moment from 'moment'
export default {
  name: 'specifiqueEvent',
  components: { dialogmodal },
  data: () => ({
    dialog: false,
    currentIndex: null,
    planning: [],
    headers: [
      { text: 'type', value: 'type' },
      { text: 'date début', value: 'dtDebut' },
      { text: 'date fin', value: 'dtFin' },
      { text: 'heure début', value: 'heureDebut' },
      { text: 'heure fin', value: 'heureFin' },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    lstRecurence: ['journalier', 'hebdomadaire', 'mensuel', 'specifique'],
    editedIndex: -1,
    editedItem: {
      type: null,
      dtDebut: null,
      dtFin: null,
      heureDebut: null,
      heureFin: null
    },
    defaultItem: {
      type: null,
      dtDebut: null,
      dtFin: null,
      heureDebut: null,
      heureFin: null
    },
    codeQuestion: {
      code: '',
      display: false
    },
    specifiqueEvent: [],
    menu_HD: false,
    menu_HF: false,
    menu_DD: false,
    menu_DF: false
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1
        ? 'nouvelle programation'
        : 'modifier une programmation'
    },
    ...mapState('event', ['eventTab', 'typeProgrammation'])
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  mounted () {
    this.initialize()
  },

  methods: {
    displayDtFr (dt) {
      return moment(dt).format('DD/MM/YYYY')
    },
    getType (type) {
      return this.typeProgrammation.find(value => value.value === type).text
    },
    initialize () {
      this.planning = this.$store.getters['event/getPlanning']
    },
    propagationDate () {
      this.$refs.menu_DD.save(this.editedItem.dtDebut)
      if (this.editedItem.type === 'days') {
        this.editedItem.dtFin = this.editedItem.dtDebut
        this.$refs.menu_DF.save(this.editedItem.dtDebut)
      }
    },

    editItem (item) {
      this.editedIndex = this.planning.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    formatedDate (date) {
      return date ? moment(date).format('DD/MM/YYYY') : null
    },
    deleteItem (item) {
      this.currentIndex = this.planning.indexOf(item)
      this.$store.dispatch('displayQuestion', 'QSOS')
      let execute = this.$refs.questionDelete.open()
      execute.then(response => {
        if (response) this.confirmedelete()
      })
    },

    confirmedelete (item) {
      let index = this.planning.indexOf(item)
      this.planning.splice(index, 1)
      this.modifyItem()
    },

    modifyItem () {
      this.$store.commit('event/setPlanning', this.planning)
      this.$store.commit('setModifUser')
    },

    close () {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.dialog = false
    },

    saveItem () {
      // on reformatte les dates
      this.$refs.form.validate()
      if (typeof this.planning === 'undefined') this.v = []
      if (this.editedIndex > -1) {
        Object.assign(this.planning[this.editedIndex], this.editedItem)
        this.modifyItem()
      } else {
        this.planning.push(this.editedItem)
        this.modifyItem()
      }
      this.close()
      this.$store.commit('setModifUser')
    }
  }
}
</script>

<style></style>

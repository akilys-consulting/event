<template>
  <v-card>
    <v-data-table
      :headers="headers"
      :items-per-page="5"
      :items="catEmplacement"
      sort-by="prix"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title
            >Gestion des prix/couleur des emplacements</v-toolbar-title
          >

          <v-spacer></v-spacer>
          <v-dialog
            overlay-color="blue-grey lighten-4"
            v-model="dialog"
            max-width="500px"
          >
            <template v-slot:activator="{ on }">
              <v-btn outlined fab small v-on="on">
                <v-icon dark>mdi-plus</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="headline">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.prix"
                        :rules="[rules.required, rules.number]"
                        label="Prix par defaut"
                        suffix="Eur"
                      ></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="12" md="12">
                      <v-color-picker
                        v-model="editedItem.color"
                        hide-inputs
                      ></v-color-picker>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined text @click="close"
                  >Annuler</v-btn
                >
                <v-btn color="primary" outlined text @click="saveItem"
                  >sauver</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:item.prix="{ item }">
        <p>{{ item.prix }} Eur</p>
      </template>
      <template v-slot:item.color="{ item }">
        <v-chip :color="item.color.hex"></v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn color="primary" fab x-small dark @click="editItem(item)">
          <v-icon>mdi-pencil-outline</v-icon>
        </v-btn>
        <v-btn color="error" fab x-small dark @click="deleteItem(item)">
          <v-icon>mdi-delete-outline</v-icon>
        </v-btn>
        <dialogmodal @responseOK="confirmedelete(item)" v-model="codeQuestion">
          <example-slot :key="codeQuestion.display"></example-slot>
        </dialogmodal>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
import dialogmodal from '@/components/commun/DialogModal'
export default {
  name: 'CatEmplacement',
  components: { dialogmodal },
  data: () => ({
    dialog: false,
    currentIndex: null,
    headers: [
      { text: 'Prix par defaut', value: 'prix', sortable: false },
      { text: 'couleur', value: 'color', sortable: false },
      { text: 'Actions', value: 'action', sortable: false }
    ],
    rules: {
      required: (value) => !!value || 'champ obligatoire.',
      number: (value) => !isNaN(value) || 'nombre attendu'
    },
    editedIndex: -1,
    editedItem: {
      color: null,
      prix: 0
    },
    defaultItem: {
      color: null,
      prix: 0
    },
    codeQuestion: {
      code: '',
      display: false
    },
    catEmplacement: []
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'Ajouter un prix' : 'modifier un prix'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.catEmplacement = this.$store.getters['plan/getCurrentCatEmplacement']
    },

    editItem (item) {
      this.editedIndex = this.catEmplacement.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.currentIndex = this.catEmplacement.indexOf(item)
      this.codeQuestion.code = 'QSOS'
      this.codeQuestion.display = true
    },

    confirmedelete (item) {
      let index = this.catEmplacement.indexOf(item)
      this.catEmplacement.splice(index, 1)
      this.modifyItem()
    },

    modifyItem () {
      this.$store.commit(
        'plan/setCatEmplacement',
        JSON.stringify(this.catEmplacement)
      )
      this.$store.commit('setModifUser')
    },

    close () {
      this.editedItem = Object.assign({}, this.defaultItem)
      this.editedIndex = -1
      this.dialog = false
    },

    saveItem () {
      if (this.editedIndex > -1) {
        Object.assign(this.catEmplacement[this.editedIndex], this.editedItem)
        this.modifyItem()
      } else {
        this.catEmplacement.push(this.editedItem)
        this.modifyItem()
      }
      this.close()
    }
  }
}
</script>

<style></style>

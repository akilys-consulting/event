<template>
  <div>
    <v-data-table
      :headers="headers"
      :items-per-page="5"
      :items="option_salon"
      sort-by="reference"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>Options proposées par l'établissement</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn color="success" fab small v-on="on">
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
                        v-model="editedItem.option"
                        :rules="[rules.required]"
                        label="Référence"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="editedItem.prix"
                        suffix="Eur"
                        :rules="[rules.required, rules.number]"
                        label="Prix"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">Annuler</v-btn>
                <v-btn color="blue darken-1" text @click="saveItem">sauver</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
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
  </div>
</template>

<script>
import dialogmodal from "@/components/commun/DialogModal";
export default {
  name: "optionsalon",
  props: { options: null, salonid: null },
  components: { dialogmodal },
  data: () => ({
    dialog: false,
    currentIndex: null,
    headers: [
      { text: "Référence", value: "option" },
      { text: "Description", value: "description" },
      { text: "Prix", value: "prix" },
      { text: "Actions", value: "action", sortable: false }
    ],
    rules: {
      required: value => !!value || "champ obligatoire.",
      number: value => !isNaN(value) || "nombre attendu"
    },
    editedIndex: -1,
    editedItem: {
      reference: "",
      description: "",
      prix: 0
    },
    defaultItem: {
      reference: "Ref",
      description: "description",
      prix: 0
    },
    codeQuestion: {
      code: "",
      display: false
    },
    option_salon: []
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1
        ? "nouvelle option"
        : "modifier une option";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.initialize();
  },

  methods: {
    initialize() {
      this.option_salon = this.$store.getters.getCurrentSalonOption;
    },

    editItem(item) {
      this.editedIndex = this.option_salon.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.currentIndex = this.option_salon.indexOf(item);
      this.codeQuestion.code = "QSOS";
      this.codeQuestion.display = true;
    },

    confirmedelete(item) {
      let index = this.option_salon.indexOf(item);
      this.option_salon.splice(index, 1);
      this.modifyItem();
    },

    modifyItem() {
      // formatage des options pour les enregistrer
      let updatedOptions = { options: null };
      updatedOptions.options = this.option_salon;
      let listOptions = JSON.stringify(updatedOptions);
      // save temporaire des options salons
      this.$store.commit("setSalonOptionSalon", listOptions);
      this.$store.commit("setModifUser");
    },

    close() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.editedIndex = -1;
      this.dialog = false;
    },

    saveItem() {
      if (this.editedIndex > -1) {
        Object.assign(this.option_salon[this.editedIndex], this.editedItem);
        this.modifyItem();
      } else {
        this.option_salon.push(this.editedItem);
        this.modifyItem();
      }
      this.close()
      this.$store.commit("setModifUser");
    }
  }
};
</script>

<style>
</style>

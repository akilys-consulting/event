<template>
  <v-card>
    <v-card-text>
      <v-row>
        <imageUpload
          v-if="currentEvent"
          :fileName="getImage"
          rep="image_event"
          @uploadfile="saveEvent"
        />
        <p v-else>
          Sauvegarder votre évènement et vous pourrez ajouter une image
        </p>
      </v-row>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="profil.nom"
              label="Nom"
              required
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
<v-col cols="6">
            <v-text-field
              v-model="profil.prenom"
              label="Prénom"
              required
              :rules="[rules.required]"
            ></v-text-field>
          </v-col>
<v-col cols="6">
>
<v-menu
  ref="menu1"
  v-model="menu1"
  :close-on-content-click="false"
  transition="scale-transition"
  offset-y
  max-width="290px"
  min-width="auto"
>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="profil.date_naissance"
              label="Date"
              hint="MM/DD/YYYY format"
              persistent-hint
              prepend-icon="mdi-calendar"
              v-bind="attrs"
              @blur="date = parseDate(dateFormatted)"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            no-title
            @input="menu1 = false"
          ></v-date-picker>
        </v-menu>

          </v-col>

            <adrmanagement
              @uptadr="updateadresse"
              :adresse="currentEvent.localisation"/></v-col
          ><v-col cols="12">
            <editor
              v-model="currentEvent.minisite"
              :options="editorOption"
            ></editor></v-col></v-row></v-form
    ></v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'profil',
  data () {
    return {
      profil: { nom: '', prenom: '' }
    }
  },

  created () {
    let self = this

  },
  methods: {
    deconnexion () {
      console.log('demande de deconnexion')
      this.$store.dispatch('cnx/disconnect')
    },
    voirProfil () {
      this.$router.push({ name: 'voirProfil' })
    }
  }
}
</script>

<style></style>

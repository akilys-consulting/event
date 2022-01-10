<template>
  <v-card class="mx-auto">
    <v-card-title> Chargement d'évènements</v-card-title>

    <v-card-text>
      <v-stepper alt-labels v-model="stepCpt">
        <v-stepper-header>
          <v-stepper-step :complete="stepCpt > 1" step="1">
            choix archive
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step
            :rules="[() => check]"
            :complete="stepCpt > 2"
            step="2"
          >
            analyse
          </v-stepper-step>

          <v-divider></v-divider>

          <v-stepper-step step="3"> chargement </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card-text>
              <v-file-input
                @change="analyse"
                prepend-icon="mdi-zip-box-outline"
                accept=".zip"
                v-model="file"
                label="fichier archive (.zip)"
                placeholder="Sélectionner votre fichier archive .zip"
              ></v-file-input>
            </v-card-text>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="readedEvent"
                :items-per-page="5"
                class="elevation-1"
                ><template v-slot:item.message="{ item }">
                  <v-chip :color="item.message ? 'red' : 'green'" dark>
                    {{ item.message ? item.message : 'OK' }}
                  </v-chip>
                </template>
                <template v-slot:item.image="{ item }">
                  <v-img
                    max-height="100"
                    max-width="150"
                    :src="'data:image/jpeg;base64,' + item.image"
                  />
                </template>
              </v-data-table>
            </v-card-text>

            <v-btn color="primary" @click="saveAnalysedEvents">
              Continue
            </v-btn>

            <v-btn text @click="stepCpt = 1"> Cancel </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card-title>Evènements insérés avec succès </v-card-title>
            <v-card-text class="mb-12" color="grey lighten-1" height="200px">
              <v-data-table
                :headers="headersResults"
                :items="insertedEvent"
                :items-per-page="5"
                class="elevation-1"
              >
                <template v-slot:item.image="{ item }">
                  <v-img
                    max-height="100"
                    max-width="150"
                    :src="'data:image/jpeg;base64,' + item.image"
                  />
                </template>
              </v-data-table>
            </v-card-text>

            <v-btn color="primary" @click="stepCpt = 1"> Continue </v-btn>

            <v-btn text> Cancel </v-btn>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card-text>
  </v-card>
</template>

<script>
import JSZip from 'JSZip'
import Papa from 'papaparse'
import moment from 'moment'
import axios from 'axios'

import { mapState } from 'vuex'
import { fb } from '@/plugins/firebaseInit'

export default {
  name: 'ImportEvent',

  data () {
    return {
      stepCpt: 1,
      headers: [
        { text: 'Image', value: 'image' },
        { text: 'Nom', value: 'nom' },
        { text: 'date debut', value: 'dateDebut' },
        { text: 'heure début', value: 'heureDebut' },
        { text: 'date fin', value: 'dateFin' },
        { text: 'heure fin', value: 'heureFin' },
        {
          text: 'Message',
          value: 'message'
        }
      ],
      headersResults: [
        { text: 'Image', value: 'image' },
        { text: 'Nom', value: 'nom' },
        {
          text: 'date debut',
          value: 'dateDebut'
        },
        { text: 'heure début', value: 'heureDebut' },
        { text: 'date fin', value: 'dateFin' },
        { text: 'heure fin', value: 'heureFin' }
      ],

      file: null,
      config: { header: true, encoding: 'UTF-8-BOM', skipEmptyLines: true },
      contentZip: [],
      contentCsv: {},
      readedEvent: [],
      check: true,
      localisation: {}
    }
  },
  computed: {
    ...mapState('event', ['currentEvent', 'typeProgrammation']),
    insertedEvent: function () {
      return this.readedEvent.filter((ligne) => {
        console.log('ligne ok' + ligne.message)
        return ligne.message === true
      })
    }
  },
  mounted () {
    this.$store.commit('setDisplayMenuOn')
    this.$store.commit('event/clearActiveSearch')
  },
  methods: {
    analyse (data) {
      if (data) {
        this.$store.commit('setWaiting', true)
        console.log('debut analyse')
        // analyse des fichiers csv
        this.getCsvFile()
      }
    },
    getCsvFile () {
      let self = this
      JSZip.loadAsync(this.file).then(function (content) {
        Object.keys(content.files).forEach(function (filename) {
          console.log('fichier ' + filename)
          switch (filename.split('.').pop()) {
            case 'csv': // lecture d'un fichier event
              content.files[filename].async('string').then(function (fileData) {
                self.readCsvFile(fileData)
              })
              break
            default: // afficher erreur lecture fichier
          }
        })
      })
    },
    async getImgFile (imgName) {
      return new Promise((resolve, reject) => {
        JSZip.loadAsync(this.file).then(function (content) {
          Object.keys(content.files).forEach(function (filename) {
            if (filename === imgName) {
              switch (filename.split('.').pop()) {
                case 'png':
                case 'jpg':
                  content.files[filename]
                    .async('base64')
                    .then(function (fileData) {
                      resolve(fileData)
                    })
                  break
                default: // afficher erreur lecture fichier
              }
            }
          })
        })
      })
    },

    async readCsvFile (file) {
      // bug papaparse , un caractère est ajouté sur le nom de la première colonne
      file = file.replace(/^\ufeff/, '')

      let contentCsv = Papa.parse(file, this.config)
      // on récupère le nb d'éléments pour pouvoir clore l'analyse quand c'est fini
      let nbevent = contentCsv.data.length

      contentCsv.data.forEach((ligne) => {
        // chargement de l'event
        let eventCheck = { localisation: { adr: null }, planning: [] }
        // check event
        this.analyseCheck(ligne).then((message) => {
          console.log('ess' + message)
          eventCheck.message = message
          this.check = !eventCheck.message

          // load data
          eventCheck.nom = ligne.nom
          eventCheck.categorie = ligne.categorie
          eventCheck.organisateur = ligne.organisateur
          // adr management
          eventCheck.localisation.adr = ligne.adresse
          // chargement de la programmation

          eventCheck.dateDebut = ligne.datedebut
          eventCheck.dateFin = ligne.datefin
          eventCheck.heureDebut = ligne.heuredebut
          eventCheck.heureFin = ligne.heurefin

          eventCheck.urlsite = ligne.lien
          eventCheck.prix = ligne.prix.replace(/€/, '')
          eventCheck.payant = eventCheck.prix > 0
          eventCheck.minisite = ligne.description
          eventCheck.type = ligne.type

          // this.check = !eventCheck.message

          // chargement de l'image
          console.log('image ' + ligne.image)
          if (ligne.image) {
            this.getImgFile(ligne.image).then((data) => {
              eventCheck.image = data
              this.readedEvent.push(eventCheck)
              if (nbevent >= contentCsv.data.length) {
                this.$store.commit('setWaiting', false)
              }

              this.stepCpt = 2
            })
          } else {
            this.readedEvent.push(eventCheck)
            this.stepCpt = 2
            if (nbevent >= contentCsv.data.length) {
              this.$store.commit('setWaiting', false)
            }
          }
          nbevent++
        })
        //
        console.log(JSON.stringify(this.currentEvent))
      })
    },
    async saveAnalysedEvents () {
      let Event2insert = { nom: null }
      //  tri du tabeleau suivant le nom de l'event
      this.readedEvent.sort(function compare (a, b) {
        if (a.nom < b.nom) return -1
        if (a.nom > b.nom) return 1
        return 0
      })

      this.readedEvent.forEach(async (data, index) => {
        // sauvegarde des events validés
        if (!data.message) {
          // sauvegarde de l'event
          console.log('sauvegarde de ' + data.nom)
          // gestion des doublons
          if (Event2insert.nom != data.nom) {
            Event2insert = JSON.parse(JSON.stringify(data))
            Event2insert.id = -1
            let imgBase64 = data.image

            // gestion du planning
          }
          Event2insert.planning.push({
            dtDebut: data.dateDebut,
            dtFin: data.dateFin,
            heureDebut: data.heureDebut,
            heureFin: data.heureFin,
            type: data.type
          })
          delete Event2insert.dateDebut
          delete Event2insert.dateFin
          delete Event2insert.heureDebut
          delete Event2insert.heureFin
          delete Event2insert.type
          delete Event2insert.image

          this.$store.commit('event/setEvent', Event2insert)
          await this.saveEVent(imgBase64)
            .then(() => {
              console.log('index' + index)
              data.message = true
              this.stepCpt = 3
            })
            .catch(() => {
              data.message = false
            })
        }
      })
    },

    async saveEVent (image) {
      return new Promise((resolve, reject) => {
        this.$store
          .dispatch('event/saveEvent')
          .then((data) => {
            let EventId = data.id
            console.log('id event ' + EventId)
            // on sauvegarde l'image
            fb.file
              .ref()
              .child('image_event' + '/' + EventId)
              .putString(image, 'base64', { contentType: 'image/jpg' })
              .then(function () {
                console.log('save ok' + EventId)
                resolve(true)
              })
              .catch(() => {
                this.$store.dispatch('stopWaiting')
                this.$store.dispatch('displayMessage', 'IMKO')
                reject(false)
              })
          })
          .catch(() => {
            this.$store.dispatch('stopWaiting')
            this.$store.dispatch('displayMessage', {
              code: 'SAKO'
            })
            reject(false)
          })
      })
    },

    async analyseCheck (ligne) {
      let message = ''
      let dtDebut = moment(
        ligne.datedebut + ' ' + ligne.heuredebut,
        'DD/MM/YYYY HH:mm'
      )
      let dtFin = moment(
        ligne.datefin + ' ' + ligne.heurefin,
        'DD/MM/YYYY HH:mm'
      )

      if (!dtDebut.isValid()) {
        // check diff entre debut et fin
        message = 'format date debut'
      }
      if (!dtFin.isValid()) {
        // check diff entre debut et fin
        message = 'format date fin'
      }

      // contrôle valeur date de fin
      if (dtFin.diff(dtDebut) < 0) {
        message += ' date/heure fin < date/heure debut'
      }
      if (!ligne.nom) message += ' nom vide'

      // contrôle du type
      if (
        !this.typeProgrammation.find((element) => element.text === ligne.type)
      ) {
        message += ' le type est inconnu'
      }

      // contrôle adresse
      let ctrlAdr = ligne.adresse.replace(' ', '+')
      await axios
        .get(
          'https://api-adresse.data.gouv.fr/search/?q=' + ctrlAdr + '&limit=1'
        )
        .then((response) => {
          // recherche des coordonnées
          let adr = response.data.features[0].properties
          let coord = response.data.features[0].geometry.coordinates

          if (Number(adr.score) > 0.9) {
            this.localisation = {
              adr: adr.label,
              latLgn: { lat: coord[0], long: coord[1] }
            }
          } else {
            message += ' adresse non contrôlée'
            console.log(Number(adr.score) > 0.9)
            return message
          }
        })

      return message
    }
  }
}
</script>
<style></style>

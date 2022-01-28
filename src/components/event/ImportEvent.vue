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
            :rules="[() => checkImport]"
            :complete="stepCpt > 2"
            step="2"
          >
            <small v-if="!checkImport">analyse avec erreur</small>
            <small v-if="checkImport">analyse sans erreur</small>
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
              >
                <template v-slot:item.message="{ item }">
                  <v-chip
                    outlined
                    color="success"
                    v-if="item.message.length == 0"
                  >
                    validé
                  </v-chip>

                  <v-menu open-on-hover>
                    <template v-slot:activator="{ on }">
                      <v-badge
                        overlap
                        v-if="item.message.length > 0"
                        color="red"
                        :content="item.message.length"
                      >
                        <v-chip
                          outlined
                          v-on="on"
                          v-if="item.message.length > 0"
                        >
                          rejeté
                        </v-chip>
                      </v-badge>
                    </template>
                    <v-card color="red accent-2" dark>
                      <v-col cols="12" v-for="item in item.message" :key="item">
                        {{ item }}
                      </v-col>
                    </v-card>
                  </v-menu>
                </template>
                <template v-slot:item.image="{ item }">
                  <v-img
                    max-height="100"
                    max-width="150"
                    :src="item.image.img"
                  />
                </template>
              </v-data-table>
            </v-card-text>

            <v-btn color="primary" @click="saveAnalysedEvents">
              Importer
            </v-btn>

            <v-btn text @click="initImport"> rejouer import </v-btn>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card-title>Evènements insérés avec succès </v-card-title>
            <v-card-text class="mb-12" color="grey lighten-1" height="200px">
              <v-progress-linear
                v-model="nbInserted"
                color="blue-grey"
                height="25"
              >
                <template v-slot:default="{ value }">
                  <strong>{{ Math.ceil(value) }}%</strong>
                </template>
              </v-progress-linear>

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
                    :src="item.image.img"
                  />
                </template>
              </v-data-table>
            </v-card-text>
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
import mixFunctions from '@/components/commun/Functions'

import { mapState } from 'vuex'
import { fb } from '@/plugins/firebaseInit'

export default {
  name: 'ImportEvent',
  mixins: [mixFunctions],

  data () {
    return {
      stepCpt: 1,
      checkImport: true,
      nbInserted: 0,
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
      Event2insert: { nom: null, planning: [] },
      contentZip: [],
      contentCsv: {},
      readedEvent: [],
      check: true,
      localisation: {}
    }
  },
  computed: {
    ...mapState('event', [
      'currentEvent',
      'typeProgrammation',
      'CONST_RESIZE_HEIGHT',
      'CONST_RESIZE_WIDTH'
    ]),
    insertedEvent: function () {
      return this.readedEvent.filter((ligne) => {
        return ligne.message.length === 0
      })
    },
    displayShipError (message) {
      return message.length > 0 ? 'ERROR' : 'SUCESS'
    }
  },
  mounted () {
    this.$store.commit('setDisplayMenuOn')
    this.$store.commit('event/clearActiveSearch')
  },
  methods: {
    initImport () {
      this.stepCpt = 1
      this.checkImport = true
      this.file = null
    },
    analyse (data) {
      if (data) {
        this.$store.commit('setWaiting', true)
        // analyse des fichiers csv
        this.getCsvFile()
      }
    },

    async dataUrlToFile (dataUrl, fileName) {
      const res = await fetch(dataUrl)
      const blob = await res.blob()
      return new File([blob], fileName, { type: 'image/png' })
    },
    getCsvFile () {
      let self = this
      JSZip.loadAsync(this.file).then(function (content) {
        Object.keys(content.files).forEach(function (filename) {
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
      let self = this
      return new Promise((resolve, reject) => {
        JSZip.loadAsync(this.file).then(function (content) {
          Object.keys(content.files).forEach(function (filename) {
            if (filename === imgName) {
              switch (filename.split('.').pop()) {
                case 'png':
                case 'jpg':
                case 'jpeg':
                  content.files[filename]
                    .async('base64')
                    .then(function (fileData) {
                      // on récupère l'image en base64, on ajoute l'encodage
                      let image64 =
                        'data:image/' +
                        filename.split('.').pop() +
                        ';base64,' +
                        fileData
                      // on convertit l'image base64 en objet file
                      self
                        .dataUrlToFile(image64, filename.split('.').pop())
                        .then((reponse) => {
                          // on resize l'image

                          self
                            .resizeImage({
                              file: image64,
                              width: self.CONST_RESIZE_WIDTH,
                              height: self.CONST_RESIZE_HEIGHT,
                              type: filename.split('.').pop()
                            })
                            .then((resp) => {
                              resolve({ type: resp.type, img: resp.data })
                            })
                        })
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
        this.analyseCheck(ligne).then((response) => {
          eventCheck.message = response.message
          this.check = !eventCheck.message.length > 0

          // load data
          eventCheck.nom = ligne.nom
          eventCheck.categorie = ligne.categorie
          eventCheck.organisateur = ligne.organisateur
          eventCheck.urlsite = ligne.lien
          eventCheck.prix = ligne.prix.replace(/€/, '')
          eventCheck.minisite = ligne.description
          eventCheck.type = ligne.type
          eventCheck.like = []

          // adr management
          console.log('localisation' + response.localisation.adr)
          eventCheck.localisation = response.localisation

          // chargement de la programmation
          eventCheck.dateDebut = ligne.datedebut
          eventCheck.dateFin = ligne.datefin
          eventCheck.heureDebut = ligne.heuredebut
          eventCheck.heureFin = ligne.heurefin

          // chargement de l'image si elle existe
          if (ligne.image) {
            this.getImgFile(ligne.image).then((data) => {
              eventCheck.image = data
              this.readedEvent.push(eventCheck)
              if (nbevent >= contentCsv.data.length) {
                this.$store.commit('setWaiting', false)
                this.stepCpt = 2
              }
            })
          } else {
            this.readedEvent.push(eventCheck)
            if (nbevent >= contentCsv.data.length) {
              this.$store.commit('setWaiting', false)
              this.stepCpt = 2
            }
          }
          nbevent++
        })
      })
    },
    //
    // function en charge de sauvegarder les events validés
    //
    async saveAnalysedEvents () {
      this.nbInserted = 0
      let nbreaded = 0
      let firstEnreg = true

      //  tri du tabeleau suivant le nom de l'event
      this.readedEvent.sort(function compare (a, b) {
        if (a.nom < b.nom) return -1
        if (a.nom > b.nom) return 1
        return 0
      })

      this.readedEvent.forEach(async (data, index) => {
        // insertion que pour les enregistrement sans erreur message.length==0
        if (data.message.length === 0) {
          // si on a un event avec le même nom on considère que c'est le même event mais avec des dates différentes
          // ne doit mettre a jour que le planning
          if (this.Event2insert.nom !== data.nom) {
            // la mise à jour ce fait qaund tous les enreg d'un même event sont lus
            // c'est pas le premier enregistrement, donc on met à jour
            if (!firstEnreg) {
              this.saveEVent().then((data) => {})
            }
            this.Event2insert = JSON.parse(JSON.stringify(data))
            this.Event2insert.planning = []
          }
          let typeProg = this.typeProgrammation.find(
            (element) => element.text === data.type
          )
          // insertion de la planification de l'event
          this.Event2insert.planning.push({
            dtDebut: moment(data.dateDebut, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            dtFin: moment(data.dateFin, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            heureDebut: data.heureDebut,
            heureFin: data.heureFin,
            type: typeProg.value
          })
          firstEnreg = false
          nbreaded++
          this.nbInserted = (nbreaded / this.readedEvent.length) * 100
        }
      })
      // sauvegarde du dernier enregistrement
      this.saveEVent().then((data) => {
        this.nbInserted = (nbreaded / this.readedEvent.length) * 100
        this.stepCpt = 3
      })
    },

    // gestion de la sauvegarde de l'event data + image
    // on récupérer les info de la variable this.Event2insert initialisée par saveAnalysedEvents

    saveEVent () {
      return new Promise((resolve, reject) => {
        let imgBase64 = this.Event2insert.image.img.replace(
          /data:image\/.*;base64,/,
          ''
        )
        let imgType = this.Event2insert.image.type

        this.Event2insert.id = -1
        delete this.Event2insert.dateDebut
        delete this.Event2insert.dateFin
        delete this.Event2insert.heureDebut
        delete this.Event2insert.heureFin
        delete this.Event2insert.type
        delete this.Event2insert.image
        delete this.Event2insert.message

        this.$store
          .dispatch('event/importEvent', this.Event2insert)
          .then((data) => {
            let EventId = data.id
            console.log('id event ' + EventId)
            // on sauvegarde l'image
            fb.file
              .ref()
              .child('image_event' + '/' + EventId)
              .putString(imgBase64, 'base64', {
                contentType: 'image/' + imgType
              })
              .then(function () {
                resolve(true)
              })
              .catch((error) => {
                this.$store.dispatch('stopWaiting')
                this.$store.dispatch('displayMessage', {
                  code: 'IMKO',
                  param: error.message
                })
                reject(new Error('erreurImg'))
              })
          })
          .catch((error) => {
            this.$store.dispatch('stopWaiting')
            this.$store.dispatch('displayMessage', {
              code: 'SAKO',
              param: error.message
            })
            reject(new Error('erreurSaveEvt'))
          })
      })
    },

    async analyseCheck (ligne) {
      let response = {
        localisation: { adr: null, LatLgn: { lat: 0, long: 0 } },
        message: []
      }
      this.checkImport = true
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
        response.message.push('format date debut')
      }
      if (!dtFin.isValid()) {
        // check diff entre debut et fin
        response.message.push('format date fin')
      }

      // contrôle valeur date de fin
      if (dtFin.diff(dtDebut) < 0) {
        response.message.push(' date/heure fin < date/heure debut')
      }
      if (!ligne.nom) response.message.push(' nom vide')

      // contrôle du type
      if (
        !this.typeProgrammation.find((element) => element.text === ligne.type)
      ) {
        response.message.push(' le type est inconnu')
      }

      // contrôle adresse
      let ctrlAdr = ligne.adresse.replace(' ', '+')
      await axios
        .get(
          'https://api-adresse.data.gouv.fr/search/?q=' + ctrlAdr + '&limit=1'
        )
        .then((retour) => {
          // recherche des coordonnées
          let adr = retour.data.features[0].properties
          let coord = retour.data.features[0].geometry.coordinates

          if (Number(adr.score) > 0.8) {
            response.localisation = {
              adr: adr.label,
              latLng: { lat: coord[1], lng: coord[0] }
            }
          } else {
            response.message.push(' adresse non contrôlée')
          }
        })
      if (response.message.length > 0) this.checkImport = false

      return response
    }
  }
}
</script>
<style></style>

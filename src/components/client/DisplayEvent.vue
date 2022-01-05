<template>
  <v-hover v-slot="{ hover }">
    <v-card :elevation="hover ? 12 : 6" :class="{ 'on-hover': hover }">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circularl
            indeterminate
            color="#6600A1"
          ></v-progress-circularl>
        </v-row>
      </template>
      <v-card-title>{{ currentEvent.nom }}</v-card-title>
      <v-card-text @click="detailEvent(itemPlanning)">
        <displayImage
          :fileName="itemPlanning.eventid"
          rep="image_event"
          height="120"
          width="100%"
        ></displayImage>
        <EmailManagement :content="getHtml" />
        <v-card-subtitle
          >{{ itemPlanning.category }} - {{ getAdresseEvent() }}
          <div class="orange--text">{{ DateDebut }} - {{ DateFin }}</div>
        </v-card-subtitle>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-badge
          v-if="nbLike > 0"
          overlap
          bordered
          color="error"
          :content="nbLike"
        >                  <v-tooltip bottom>
            <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-icon small @click="addLike()">mdi-heart</v-icon>
          </v-btn>
                      </template>
            <span>j'aime</span>
          </v-tooltip>
          </v-badge
        >
                        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" v-if="!nbLike">
          <v-icon small @click="addLike()">mdi-heart</v-icon>
        </v-btn>
                              </template>
            <span>j'aime</span>
          </v-tooltip>
                        <v-tooltip bottom>
            <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon small @click="sendEmail">mdi-share-variant-outline</v-icon>
        </v-btn>
                                      </template>
            <span>partager</span>
          </v-tooltip></spacer>
                  <v-tooltip bottom>
<template v-slot:activator="{ on }">
        <v-icon v-on="on" x-small
 v-for="index in getPrix" :key="index"
          >mdi-currency-eur</v-icon
        >
                </template>
            <span>€ <10,€€ <30, €€€>30</span>
          </v-tooltip>
        <v-tooltip bottom>
<template v-slot:activator="{ on }">

        <v-icon small v-on="on" v-if="getPrix == 0">mdi-currency-eur-off</v-icon>
        </template>
            <span>Gratuit</span>
          </v-tooltip>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import moment from 'moment'
import axios from 'axios'

import mixFunctions from '@/components/commun/Functions'
import displayImage from '@/components/commun/DisplayImage'
import EmailManagement from '@/components/commun/EmailManagement'

import { mapState } from 'vuex'

export default {
  data () {
    return {
      isAdmin: false,
      urlImg: null,
      displayImg: false,
      calculNbLike: false,
      currentEvent: {}
    }
  },
  components: {
    displayImage,
    EmailManagement
  },
  name: 'displayEvent',
  props: ['itemPlanning', 'taille'],
  mixins: [mixFunctions],

  computed: {
    ...mapState('event', ['events']), // assuming you are using namespaced modules

    DateDebut: function () {
      return moment(this.itemPlanning.start, 'YYYY-MM-DD HH:mm').format(
        'DD/MM/YYYY HH:mm'
      )
    },
    DateFin: function () {
      return moment(this.itemPlanning.end, 'YYYY-MM-DD HH:mm').format(
        'DD/MM/YYYY HH:mm'
      )
    },
    nbLike () {
      return this.currentEvent.like.length
    },
    getHtml () {
      return {
        nom: this.currentEvent.nom,
        adr: this.currentEvent.localisation.adr,
        debut: this.DateDebut,
        fin: this.DateFin,
        description: this.currentEvent.minisite ? this.currentEvent.minisite : 'Pas de description'
      }
    },
    getPrix () {
      if (!this.currentEvent.prix) return 0
      if (this.currentEvent.prix <= 10) return 1
      if (this.currentEvent.prix > 10 && this.currentEvent.prix <= 30) return 2
      if (this.currentEvent.prix > 30) return 3
    }
  },

  created () {
    let searchIdEvent = this.itemPlanning.eventid
    this.currentEvent = this.events.find((element) => element.id == searchIdEvent)
  },

  methods: {

    detailEvent (element) {
      this.$router.push({
        name: 'clientdetailEvent',
        params: { currentPlanning: element.id }
      })
    },
    getAdresseEvent () {
      if (this.currentEvent && typeof this.currentEvent.localisation !== 'undefined') {
        return this.currentEvent.localisation.adr
      } else return null
    },

    async readIP () {
      return axios.get('https://api.ipify.org?format=json')
    },

    // add like to event
    async addLike () {
      await this.readIP().then((response) => {
        console.log('ip'+response.data.ip)
        if (!this.currentEvent.like.find(element => element === response.data.ip)) {
          this.currentEvent.like.push(response.data.ip)
          this.$store.dispatch('event/addLike2Event',this.currentEvent)
        }
      })
    },

    sendEmail () {
      // affichage de la fenêtre d'nevoi de mail
      this.$store.commit('event/setActiveEmailWin')
    }
  }
}
</script>

<style scoped>
.v-badge--bordered
{
  border-width:none;

}
</style>

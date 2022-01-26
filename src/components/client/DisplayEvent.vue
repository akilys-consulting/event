<template>
  <v-hover v-slot="{ hover }">
    <v-card
      class="cardColor d-flex flex-column"
      :elevation="hover ? 12 : 6"
      :class="{ 'on-hover': hover }"
    >
      <v-row @click="detailEvent(itemPlanning)">
        <v-col cols="6">
          <v-card-title>{{ itemPlanning.category }} </v-card-title>
          <v-card-subtitle>{{ currentEvent.nom }} </v-card-subtitle>
        </v-col>
        <v-col cols="6">
          <v-avatar tile size="125"
            ><displayImage
              :fileName="itemPlanning.eventid"
              rep="image_event"
              height="100%"
              width="100%"
            ></displayImage>
          </v-avatar>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-card-actions>
        <v-menu v-model="allDates" :close-on-content-click="false" offset-x>
          <template v-slot:activator="{ on, attrs }">
            <v-card-subtitle v-bind="attrs" v-on="on">
              {{ DisplayDate(itemPlanning.start) }}
              <v-chip outlined x-small>+{{ nbDates }} dates</v-chip>
            </v-card-subtitle>
          </template>
          <v-date-picker
            :events="tableDates"
            event-color="green lighten-1"
            readonly
            elevation="15"
            no-title
            :show-current="tableDates[0]"
            width="200"
            hight="60"
          ></v-date-picker>
        </v-menu>
        <v-spacer></v-spacer>

        <v-tooltip bottom v-if="nbLike > 0">
          <template v-slot:activator="{ on }">
            <v-btn x-small plain v-on="on">
              <v-icon color="pink" @click="addLike()">mdi-heart</v-icon
              >{{ nbLike }}
            </v-btn>
          </template>
          <span>j'aime</span>
        </v-tooltip>

        <v-tooltip v-else bottom>
          <template v-slot:activator="{ on }">
            <v-btn x-small plain v-on="on">
              <v-icon @click="addLike()">mdi-heart</v-icon>
            </v-btn>
          </template>
          <span>j'aime</span>
        </v-tooltip>
        <reseauxSociaux :display="share" :content="getHtml" />

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" small v-for="index in getPrix" :key="index"
              >mdi-currency-eur</v-icon
            >
          </template>
          <span>€ &lt;10,€€ &lt; 30, €€€>30</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-icon small v-on="on" v-if="getPrix == 0"
              >mdi-currency-eur-off</v-icon
            >
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
import reseauxSociaux from '@/components/commun/ReseauxSociaux'

import { mapState } from 'vuex'

export default {
  data () {
    return {
      share: false,
      isAdmin: false,
      urlImg: null,
      displayImg: false,
      calculNbLike: false,
      currentEvent: {},
      allDates: false,
      nbDates: 0,
      tableDates: []
    }
  },
  components: {
    displayImage,
    reseauxSociaux
  },
  name: 'displayEvent',
  props: ['itemPlanning', 'taille'],
  mixins: [mixFunctions],

  computed: {
    ...mapState('event', ['events', 'planning']), // assuming you are using namespaced modules

    DateFin: function () {
      return moment(this.itemPlanning.end, 'YYYY-MM-DD HH:mm')
        .lang('fr')
        .format('HH:mm')
    },
    nbLike () {
      return this.currentEvent.like.length
    },
    getHtml () {
      return {
        nom: this.currentEvent.nom,
        adr: this.currentEvent.localisation.adr,
        url: this.currentEvent.urlsite,
        debut: this.DisplayDate(this.itemPlanning.start),
        fin: this.DisplayDate(this.itemPlanning.end),
        description: this.currentEvent.minisite
          ? this.currentEvent.minisite
          : 'Pas de description'
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
    // on se positionne sur l'event
    let searchIdEvent = this.itemPlanning.eventid
    this.currentEvent = this.events.find(
      (element) => element.id === searchIdEvent
    )

    let data = this.planning.filter((element) => {
      return element.eventid === this.itemPlanning.eventid
    })
    this.nbDates = data.length
    data.forEach((ligne) => {
      this.tableDates.push(ligne.start.slice(0, ligne.start.indexOf(' ')))
    })
  },

  methods: {
    DisplayDate (date) {
      return moment(date, 'YYYY-MM-DD HH:mm').lang('fr').format('DD MMMM HH:mm')
    },

    detailEvent (element) {
      this.$router.push({
        name: 'clientdetailEvent',
        params: { currentPlanning: element.id }
      })
    },
    getAdresseEvent () {
      if (
        this.currentEvent &&
        typeof this.currentEvent.localisation !== 'undefined'
      ) {
        return this.currentEvent.localisation.adr
      } else return null
    },

    async readIP () {
      return axios.get('https://api.ipify.org?format=json')
    },

    // add like to event
    async addLike () {
      await this.readIP().then((response) => {
        alert('ip' + response.data.ip)
        if (
          !this.currentEvent.like.find(
            (element) => element === response.data.ip
          )
        ) {
          this.currentEvent.like.push(response.data.ip)
          this.$store.dispatch('event/addLike2Event', this.currentEvent)
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
.v-badge--bordered {
  border-width: none;
}
.cardColor {
  opacity: 0.8 !important;
}
.badgeLike .v-badge__badge {
  padding: 2px 2px;
  font-size: 9px;
  min-width: 10px;
  height: 10px;
}
</style>

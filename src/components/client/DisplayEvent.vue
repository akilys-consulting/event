<template>
  <v-hover v-slot="{ hover }">
    <v-card :elevation="hover ? 12 : 6" :class="{ 'on-hover': hover }">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circularl
            indeterminate
            color="grey lighten-5"
          ></v-progress-circularl>
        </v-row>
      </template>
      <v-card-title>{{ getNom }}</v-card-title>
      <v-card-text @click="detailEvent(itemPlanning)">
        <v-row class="">
          <v-col cols="6" lg="4">
            <displayImage
              :fileName="itemPlanning.eventid"
              rep="image_event"
              height="80"
              width="150"
            ></displayImage>
          </v-col>
          <v-col cols="6" class="hidden-lg-and-up">
            <v-avatar tile color="pink">
              {{ getPrix }}
            </v-avatar>
          </v-col>

          <EmailManagement :content="getHtml" />
          <v-col cols="auto">
            <v-card-subtitle
              >{{ itemPlanning.category }} - {{ getAdresseEvent() }}
              <div class="orange--text">{{ DateDebut }} - {{ DateFin }}</div>
            </v-card-subtitle>
          </v-col>
          <v-col cols="3" class="hidden-md-and-down">
            <v-avatar tile color="pink">
              {{ getPrix }}
            </v-avatar>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-badge
          v-if="nbLike > 0"
          overlap
          bordered
          color="error"
          :content="nbLike"
        >
          <v-btn icon>
            <v-icon @click="addLike()">mdi-heart</v-icon>
          </v-btn></v-badge
        >
        <v-btn icon v-if="!nbLike">
          <v-icon @click="addLike()">mdi-heart</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon @click="sendEmail">mdi-email-send-outline</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import moment from 'moment'
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
      calculNbLike: false
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
      let currentEvent = this.getEvent()
      return currentEvent.like
    },
    getHtml () {
      let event = this.getEvent()
      return {
        nom: event.nom,
        adr: event.localisation.adr,
        debut: this.DateDebut,
        fin: this.DateFin,
        description: event.minisite ? event.minisite : 'Pas de description'
      }
    },
    getPrix () {
      let event = this.getEvent()
      return event.prix ? event.prix + '€' : 'Free!'
    },
    getNom () {
      let event = this.getEvent()
      return event.nom
    }
  },

  methods: {
    getEvent () {
      let searchIdEvent = this.itemPlanning.eventid
      return this.events.find((element) => element.id == searchIdEvent)
    },
    detailEvent (element) {
      this.$router.push({
        name: 'clientdetailEvent',
        params: { currentPlanning: element.id }
      })
    },
    getAdresseEvent () {
      let event = this.getEvent()
      if (event && typeof event.localisation !== 'undefined') {
        return event.localisation.adr
      } else return null
    },
    // add like to event
    addLike () {
      console.log('addlike')
      this.$store.commit(
        'event/setCurrentEventByPlanning',
        this.itemPlanning.eventid
      )
      this.$store.dispatch('event/addLike2Event')
    },

    sendEmail () {
      // affichage de la fenêtre d'nevoi de mail
      this.$store.commit('event/setActiveEmailWin')
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.7;
}
</style>

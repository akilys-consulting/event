<template>
  <v-hover v-slot="{ hover }">
    <v-card :elevation="hover ? 24 : 12" :class="{ 'on-hover': hover }">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circularl
            indeterminate
            color="grey lighten-5"
          ></v-progress-circularl>
        </v-row>
      </template>
      <v-card-title>{{ itemPlanning.name }}</v-card-title>
      <v-card-text @click="detailEvent(itemPlanning)">
        <v-row>
          <v-col cols="4">
            <displayImage
              :fileName="itemPlanning.eventid"
              rep="image_event"
              height="80"
              width="150"
            ></displayImage>
          </v-col>
          <v-col>
            <v-card-subtitle
              >{{ itemPlanning.category }} - {{ getAdresseEvent() }}
              <div class="orange--text">{{ DateDebut }} - {{ DateFin }}</div>
            </v-card-subtitle>
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

        <v-btn icon @click="shareinfo()">
          <v-icon>mdi-share-variant</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-hover>
</template>

<script>
import moment from 'moment'
import mixFunctions from '@/components/commun/Functions'
import displayImage from '@/components/commun/DisplayImage'

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
    displayImage
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
      let searchIdEvent = this.itemPlanning.eventid
      let currentEvent = this.events.find(
        element => element.id == searchIdEvent
      )
      return currentEvent.like
    }
  },
  methods: {
    detailEvent (element) {
      this.$router.push({
        name: 'clientdetailEvent',
        params: { currentPlanning: element.id }
      })
    },
    getAdresseEvent () {
      let searchIdEvent = this.itemPlanning.eventid
      let event = this.events.find(element => element.id == searchIdEvent)
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

    shareinfo () {
      console.log('shareinfo')
      this.$emit('send2EMail')
    }
  }
}
</script>

<style scoped>
.v-card {
  transition: opacity 0.4s ease-in-out;
}

.v-card:not(.on-hover) {
  opacity: 0.6;
}

.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
</style>

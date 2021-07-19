<template>
  <v-card>
    <v-card-title>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn fab small color="primary" @click="refreshList" v-on="on">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>retour à la liste</span> </v-tooltip
      >{{ event.nom }}</v-card-title
    >
    <v-card-subtitle
      >{{ event.categorie }} - {{ event.localisation.adr }}
      <div class="orange--text">{{ DateDebut }} - {{ DateFin }}</div>
    </v-card-subtitle>
    <v-card-text>
      <v-row>
        <v-col cols="auto">
          <displayImage
            :fileName="event.id"
            rep="image_event"
            height="250"
            width="350"
          ></displayImage>
          <v-btn
            small
            color="primary"
            text
            :href="event.urlsite"
            target="_blank"
          >
            Lien vers site organisateur
          </v-btn>
        </v-col>
        <v-col>
          <l-map
            :zoom="zoom"
            :options="mapOptions"
            :center="center"
            style="height: 100%"
          >
            <l-tile-layer :url="url" />
            <l-marker :lat-lng="makerEvent"></l-marker>
          </l-map>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-text v-html="event.minisite"></v-card-text>
  </v-card>
</template>

<script>
import moment from 'moment'

import { latLng } from 'leaflet'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
import displayImage from '@/components/commun/DisplayImage'
import { mapState } from 'vuex'
export default {
  name: 'detailEvent',
  components: {
    displayImage,
    LMap,
    LTileLayer,
    LMarker
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      center: [],
      zoom: 12,
      mapOptions: {
        zoomSnap: 0.5
      },
      event: { nom: null, minisite: null },
      currentPlanning: null,
      makerEvent: null
    }
  },

  computed: {
    ...mapState('event', ['planning', 'events']),
    DateDebut: function () {
      return moment(this.currentPlanning.start, 'YYYY-MM-DD HH:mm').format(
        'DD/MM/YYYY HH:mm'
      )
    },
    DateFin: function () {
      return moment(this.currentPlanning.end, 'YYYY-MM-DD HH:mm').format(
        'DD/MM/YYYY HH:mm'
      )
    }
  },
  created () {
    this.$store.commit('setDisplayMenuOff')
    // on récupére l'event
    if (typeof this.$route.params.currentPlanning === 'undefined') {
      this.refreshList()
    }

    this.currentPlanning = this.planning.find(
      (element) => element.id == this.$route.params.currentPlanning
    )
    this.event = this.events.find(
      (element) => element.id == this.currentPlanning.eventid
    )
    console.log('minisiste' + this.event.minisite)

    this.center = latLng(
      this.event.localisation.latLng.lat,
      this.event.localisation.latLng.lng
    )
    this.makerEvent = latLng(
      this.event.localisation.latLng.lat,
      this.event.localisation.latLng.lng
    )
  },
  methods: {
    refreshList () {
      this.$router.push({
        name: 'listEvent'
      })
    }
  }
}
</script>

<style></style>

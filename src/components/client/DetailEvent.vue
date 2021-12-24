<template>
  <v-card>
    <v-row>
      <v-col cols="6">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn fab small color="primary" @click="refreshList" v-on="on">
              <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>retour à la liste</span>
        </v-tooltip>
      </v-col>
      <v-col cols="6">
        <add-to-calendar
          :title="event.nom"
          :location="event.localisation.adr"
          :details="displayMiniSite"
          inline-template
        >
          <div>
            <google-calendar id="google-calendar">
              <v-btn small rounded plain>
                <img
                  style="height: 30px; width: 30px"
                  class="icon_image"
                  src="@/assets/google-calendar.png"
                />
                calendrier
              </v-btn>
            </google-calendar>
          </div>
        </add-to-calendar>
      </v-col>
    </v-row>
    <v-card-title> {{ event.nom }}</v-card-title>

    <v-card-subtitle>
      organisé par : {{ event.organisateur }} 
      <v-btn v-if="event.urlsite"
 fab  small color="primary" :href="event.urlsite" target="_blank">
      <v-icon dark>
        mdi-search-web
      </v-icon></v-btn
><br>
      {{ event.localisation.adr }}
      <div class="orange--text">{{ DateDebut }} - {{ DateFin }}</div>
    </v-card-subtitle>

    <v-card-text>
      <v-row>
        <v-col lg="6" sm="6" xs="12">
          <displayImage
            :fileName="event.id"
            rep="image_event"
            height="250"
            width="auto"
          ></displayImage>

            Lien vers site organisateur
          </v-btn>
        </v-col>
        <v-col lg="6" sm="6" xm="12">
          <l-map
            :zoom="zoom"
            :options="mapOptions"
            :center="center"
            style="height: 300px;width=auto"
          >
            <l-tile-layer :url="url" />
            <l-marker :icon="warehouse_icon" :lat-lng="[43.6142, 1.4155]">
            </l-marker>
          </l-map>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-text
      class="subtitle-2"
      v-if="event.minisite"
      v-html="event.minisite"
    ></v-card-text>
    <v-card-text class="subtitle-2" v-else
      >Aucune description n'a été fourni</v-card-text
    >
  </v-card>
</template>

<script>
import moment from 'moment'

import displayImage from '@/components/commun/DisplayImage'
import { mapState } from 'vuex'

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import { latLng, icon } from 'leaflet'
import marker from '@/assets/marker.png'

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

      makerEvent: null,
      aad2calendar: false,
      warehouse_icon: icon({
        iconUrl: marker,
        iconSize: [32, 37],
        iconAnchor: [16, 37]
      })
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
    },
    // format la date de début pour l'addOn calendar
    calendarDebut: function () {
      return moment(this.currentPlanning.start, 'YYYY-MM-DD HH:mm')
    },
    // format la date de finb pour l'addOn calendar
    calendarFin: function () {
      return moment(this.currentPlanning.end, 'YYYY-MM-DD HH:mm')
    },

    displayMiniSite () {
      return 'Pas de description'
    },
    dynamicSize () {
      return [this.iconSize, this.iconSize * 1.15]
    },
    dynamicAnchor () {
      return [this.iconSize / 2, this.iconSize * 1.15]
    }
  },
  created () {
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
    // console.log('minisiste' + this.event.minisite)

    this.center = [
      this.event.localisation.latLng.lat,
      this.event.localisation.latLng.lng
    ]

    console.log(
      'marker' +
        this.event.localisation.latLng.lat +
        ' ' +
        this.event.localisation.latLng.lng
    )
    this.makerEvent = [
      this.event.localisation.latLng.lat,
      this.event.localisation.latLng.lng
    ]
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

<style>
.vue2leaflet-map {
  z-index: 0;
}
</style>

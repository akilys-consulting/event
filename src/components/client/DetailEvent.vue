<template>
  <v-card>
      <v-toolbar flat>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn plain icon @click="refreshList" v-on="on">
              <v-icon >mdi-arrow-left</v-icon>
            </v-btn>
          </template>
          <span>retour à la liste</span>
        </v-tooltip>

        <add-to-calendar
          :title="event.nom"
          :location="event.localisation.adr"
          :details="displayMiniSite"
          inline-template
        >
            <google-calendar id="google-calendar">
                      <v-tooltip bottom>
          <template v-slot:activator="{ on }">
              <v-btn plain v-on="on">
                <v-icon>mdi-calendar-plus</v-icon></v-btn>
                          </template>
          <span>ajouter à votre calendrier</span>
        </v-tooltip>
            </google-calendar>
        </add-to-calendar>
                              <v-tooltip bottom>
          <template v-slot:activator="{ on }">
        <v-btn icon plain
 v-on="on"
  v-if="event.urlsite"
  :href="event.urlsite"
  target="_blank"
>
      <v-icon dark>
        mdi-web
      </v-icon></v-btn>
                                </template>
          <span>visiter le site de l'organisateur</span>
        </v-tooltip>
      </v-toolbar>
    <v-card-title> {{ event.nom }}</v-card-title>

    <v-card-subtitle v-if="event.organisateurs">
      organisé par : {{ event.organisateur }} 
    </v-card-subtitle>
    <v-card-subtitle>
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
            <l-marker :icon="warehouse_icon" :lat-lng="[event.localisation.latLng.lat, event.localisation.latLng.lng]">
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
      url: 'https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png',
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
.vue-add-to-calendar { text-decoration: none;

}
</style>

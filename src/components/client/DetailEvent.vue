<template>
  <v-card>
    <!--    <v-toolbar flat>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn fab small flat color="primary" @click="refreshList" v-on="on">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>retour à la liste</span>
      </v-tooltip>
    </v-toolbar>-->
    <v-row no-gutters>
      <v-col lg="6" sm="6" xs="12" md="6"
        ><v-avatar tile size="300">
          <displayImage
            :fileName="event.id"
            rep="image_event"
            height="100%"
            width="100%"
          ></displayImage>
        </v-avatar>
      </v-col>

      <v-col lg="6" sm="6" xs="12" md="6">
        <v-card flat>
          <v-card-title>{{ event.nom }}</v-card-title>
          <v-card-subtitle> {{ event.localisation.adr }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-subtitle
            ><span class="orange--text">Le {{ DateDebut }}</span>
            Séances à
            <span class="orange--text" v-for="item in getseances" :key="item">
              {{ item }}
            </span>
            <div>
              {{ event.categorie }} - organisé par : {{ event.organisateur }}
            </div>
          </v-card-subtitle>
          <v-divider></v-divider>

          <v-card-title>Description</v-card-title>
          <v-card-text>{{ event.minisite }} </v-card-text>
          <v-card-actions>
            <v-btn
              plain
              calss="ma-1"
              v-if="event.urlsite"
              :href="event.urlsite"
              target="_blank"
            >
              <v-icon>mdi-search-web</v-icon> site internet
            </v-btn>
            <add-to-calendar
              :title="event.nom"
              :location="event.localisation.adr"
              :details="displayMiniSite"
              inline-template
            >
              <google-calendar id="google-calendar">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn calss="ma-1" plain v-on="on">
                      <v-icon>mdi-calendar-plus</v-icon>calendrier
                    </v-btn>
                  </template>
                  <span>ajouter à votre calendrier</span>
                </v-tooltip>
              </google-calendar>
            </add-to-calendar>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row no-gutters
      ><v-col cols="12">
        <v-card-subtitle>Sur la carte </v-card-subtitle>
        <l-map
          :zoom="zoom"
          :options="mapOptions"
          :center="center"
          style="height: 300px; width: auto"
        >
          <l-tile-layer :url="url" />
          <l-marker
            :icon="warehouse_icon"
            :lat-lng="[
              event.localisation.latLng.lat,
              event.localisation.latLng.lng
            ]"
          >
          </l-marker>
        </l-map> </v-col
    ></v-row>
  </v-card>
</template>

<script>
import moment from 'moment'

import displayImage from '@/components/commun/DisplayImage'
import { mapState } from 'vuex'

import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import { icon } from 'leaflet'
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
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      center: [],
      zoom: 15,
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
      return moment(this.currentPlanning.start, 'YYYY-MM-DD')
        .lang('fr')
        .format('DD MMMM')
    },
    HeureFin: function () {
      return moment(this.currentPlanning.end, 'YYYY-MM-DD HH:mm').format(
        'HH:mm'
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
      return this.event.minisite ? this.event.minisite : 'Pas de description'
    },
    dynamicSize () {
      return [this.iconSize, this.iconSize * 1.15]
    },
    dynamicAnchor () {
      return [this.iconSize / 2, this.iconSize * 1.15]
    },
    getseances () {
      let heures = []
      let self = this
      console.log(
        'start heure' +
          this.$route.params.currentPlanning +
          ' ' +
          moment(self.currentPlanning.start).format('YYYY-MM-DD')
      )
      let filteredDates = this.planning.filter(
        (element) => element.id === self.$route.params.currentPlanning
      )

      let test = filteredDates.filter(
        (element) =>
          moment(this.currentPlanning.start).format('YYYY-MM-DD') ===
          moment(self.currentPlanning.start).format('YYYY-MM-DD')
      )

      console.log('nb elment ' + test.length)

      test.forEach((element) => {
        console.log(
          'heure' +
            parseInt(
              moment(moment(element.start).format('HH:mm'), 'HH:mm').format(
                'HH'
              )
            )
        )
        heures.push(moment(element.start).format('HH:mm'))
      })
      heures.sort(
        (a, b) =>
          parseInt(moment(a, 'HH:mm').format('HH')) -
          parseInt(moment(b, 'HH:mm').format('HH'))
      )

      return heures
    }
  },
  created () {
    //
    // on efface la fentre de recherche
    this.$store.commit('event/clearActiveSearch')
    // on récupére l'event
    if (typeof this.$route.params.currentPlanning === 'undefined') {
      this.refreshList()
    }

    this.currentPlanning = this.planning.find(
      (element) => element.id === this.$route.params.currentPlanning
    )
    this.event = this.events.find(
      (element) => element.id === this.currentPlanning.eventid
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
.vue-add-to-calendar {
  text-decoration: none;
}
</style>

<template>
  <div>
    <v-toolbar>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn outlined color="primary" v-on="on" :to="{ name: 'listEvent' }">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>retour aux évènements</span>
      </v-tooltip>
      <v-btn outlined color="primary" @click="ajouterEvenement">
        <v-icon left> mdi-calendar-plus </v-icon>
        ajouter
      </v-btn>
      <v-menu bottom right>
        <template v-slot:activator="{ on, attrs }">
          <v-btn outlined color="primary" v-bind="attrs" v-on="on">
            <span>affichage</span>
            <v-icon right>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="type = 'day'">
            <v-list-item-title>jour</v-list-item-title>
          </v-list-item>
          <v-list-item @click="type = 'week'">
            <v-list-item-title>semaine</v-list-item-title>
          </v-list-item>
          <v-list-item @click="type = 'month'">
            <v-list-item-title>mois</v-list-item-title>
          </v-list-item>
          <v-list-item @click="type = 'category'">
            <v-list-item-title>catégories</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn icon small @click="prev">
        <v-icon> mdi-chevron-left </v-icon>
      </v-btn>
      <v-btn icon small @click="next">
        <v-icon> mdi-chevron-right </v-icon>
      </v-btn>
    </v-toolbar>
    <v-toolbar-sub-title v-if="$refs.calendar">
      {{ $refs.calendar.title }}
    </v-toolbar-sub-title>

    <v-calendar
      ref="calendar"
      v-model="focus"
      color="primary"
      :events="planning"
      category-show-all
      :weekdays="weekday"
      :categories="getCategories"
      :event-color="getEventColor"
      :type="type"
      @click:event="showEvent"
      @click:more="viewDay"
      @click:date="viewDay"
    ></v-calendar>
  </div>
</template>

<script>
import { mapState,mapGetters } from 'vuex'
export default {
  data: () => ({
    focus: '',
    type: 'day',
    typeToLabel: {
      month: 'Month',
      week: 'Week',
      day: 'Day',
      '4day': '4 Days'
    },
    selectedEvent: {},
    weekday: [1, 2, 3, 4, 5, 6, 0]
  }),

  async created () {
    let self = this

    this.$store.commit('setDisplayMenuOn')

    if (!this.isAdmin) this.$router.push('/')

    // charger les events via la liste des events specifiques
    this.$store.dispatch('startWaiting')
    await this.$store
      .dispatch('event/loadPlanning')
      .then(data => {
        self.$store.dispatch('stopWaiting')
      })
      .catch(error => {
        self.$store.dispatch('stopWaiting')
        self.$store.dispatch('displayMessage', {
          code: 'ADMIN',
          param: error.message
        })
      })
  },
  computed: {
    ...mapState('event', ['planning']), // assuming you are using namespaced modules
    ...mapGetters('cnx', ['isAuthenticated', 'isAdmin']),
    ...mapGetters('event', ['getCategories'])
  },
  methods: {
    ajouterEvenement () {
      this.$store.commit('event/setInitEvent')
      this.$router.push({ name: 'formEvent' })
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },

    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      console.log('event.id' + event.eventid)
      this.$store.commit('event/setCurrentEventByPlanning', event.eventid)
      this.$router.push({ name: 'formEvent' })
    }
  }
}
</script>

<style>
.v-btn--fab.v-size--default {
  height: 24px !important;
  width: 24px !important;
}
</style>

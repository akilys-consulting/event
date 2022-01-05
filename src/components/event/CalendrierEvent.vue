<template>
  <div>
    <v-toolbar>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" :to="{ name: 'listEvent' }">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
        </template>
        <span>retour aux évènements</span>
      </v-tooltip>
      <v-tooltip bottom>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" @click="ajouterEvenement">
            <v-icon> mdi-calendar-plus </v-icon>
          </v-btn>
        </template>
        <span>ajouter un évènement</span>
      </v-tooltip>
      <v-menu bottom open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn v-bind="attrs" v-on="on">
            <v-icon right> mdi-calendar-today </v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item-group
            @change="console.log(value)"
            v-model="selectedType"
          >
            <v-list-item
              v-for="(item, i) in typeToLabel"
              :value="item.type"
              :key="i"
            >
              <v-list-item-title>{{ item.label }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="$refs.calendar">
        {{ $refs.calendar.title }}
      </v-toolbar-title>

      <v-btn icon small @click="prev">
        <v-icon> mdi-chevron-left </v-icon>
      </v-btn>
      <v-btn icon small @click="next">
        <v-icon> mdi-chevron-right </v-icon>
      </v-btn>
    </v-toolbar>

    <v-calendar
      ref="calendar"
      v-model="focus"
      color="primary"
      :events="planning"
      category-show-all
      :weekdays="weekday"
      :categories="getCategories"
      :event-color="getEventColor"
      :type="selectedType"
      @click:event="showEvent"
      @click:more="viewDay"
      @click:date="viewDay"
    ></v-calendar>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data: () => ({
    focus: '',
    type: 'day',
    typeToLabel: [
      { type: 'month', label: 'Mois' },
      { type: 'week', label: 'Semaine' },
      { type: 'day', label: 'Jour' },
      { type: '4day', label: '4jours' },
      { type: 'category', label: 'Categories' }
    ],
    selectedEvent: {},
    selectedType: 'week',
    weekday: [1, 2, 3, 4, 5, 6, 0]
  }),

  async created () {
    let self = this

    this.$store.commit('setDisplayMenuOn')
    this.$store.commit('event/clearActiveSearch')

    if (!this.isAdmin) this.$router.push('/')

    // charger les events via la liste des events specifiques
    this.$store.dispatch('startWaiting')
    await this.$store
      .dispatch('event/loadPlanning')
      .then((data) => {
        self.$store.dispatch('stopWaiting')
      })
      .catch((error) => {
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

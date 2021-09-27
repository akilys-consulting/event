<template>
  <div>
    <v-progress-linear
      v-if="waiting"
      height="9"
      indeterminate
      color="yellow darken-2"
    />
    <chargement />

    <v-app id="app">
      <navbar></navbar>
      <v-main>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </v-main>

      <v-footer app>
        <v-col class="text-center" cols="12" color="blue-grey lighten-2">
          {{ new Date().getFullYear() }} —
          <strong>AKILYS</strong>
        </v-col>
      </v-footer>
    </v-app>
    <v-bottom-sheet
      inset
      :open-delay="message.timeout"
      v-model="message.display"
      :overlay-color="message.type"
      overlay-opacity="0.2"
    >
      <v-sheet class="text-center" height="100px">
        <v-btn
          class="text--lighten-1 text-body-2 mt-6"
          text
          @click="message.display = !message.display"
        >
          fermer
        </v-btn>
        <div class="py-3">
          {{ message.message }}
        </div>
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<script>
import navbar from '@/components/commun/NavBar'
import chargement from '@/components/commun/Chargement'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      user: false
    }
  },
  components: { navbar, chargement },
  computed: {
    ...mapState(['waiting', 'message'])
  },
  created () {
    console.log('created App')
    this.$store.dispatch('plan/loadBanqueImage')
  }
}
</script>

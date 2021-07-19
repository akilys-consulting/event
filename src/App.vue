<template>
  <v-app id="app">
    <v-progress-linear
      v-if="waiting"
      height="9"
      indeterminate
      color="yellow darken-2"
    />
    <chargement />
    <navbar></navbar>

    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>

    <v-bottom-sheet
      inset
      :open-delay="message.timeout"
      v-model="message.display"
      :overlay-color="message.type"
      overlay-opacity="0.2"
    >
      <v-sheet class="text-center" height="100px">
        <v-btn class="mt-6" text @click="message.display = !message.display">
          fermer
        </v-btn>
        <div class="py-3">
          {{ message.message }}
        </div>
      </v-sheet>
    </v-bottom-sheet>
    <v-footer app>
      <v-col class="text-center" cols="12" color="blue-grey lighten-2">
        {{ new Date().getFullYear() }} —
        <strong>AKILYS</strong>
      </v-col>
    </v-footer>
  </v-app>
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
    this.user = this.$store.getters.getUserInfo
    this.$store.dispatch('loadBanqueImage')
  }
}
</script>
<style></style>

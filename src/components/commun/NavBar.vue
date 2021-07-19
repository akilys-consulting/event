<template>
  <div v-if="display">
    <v-toolbar app color="primary">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>quefaire.fr</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-divider class="mx-4" vertical></v-divider>
      <v-btn v-if="admin" text to="/admin"> mes events</v-btn>
      <v-btn v-if="connected && !admin" text to="/preference">
        mes events</v-btn
      >
      <v-spacer></v-spacer>
      <v-btn icon @click="checkConnect">
        <AvatarDisplay />
      </v-btn>
    </v-toolbar>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { fb } from '@/firebaseDef.js'
import AvatarDisplay from '@/components/commun/AvatarDisplay'

// @ is an alias to /src
export default {
  name: 'navbar',
  data () {
    return {
      drawer: false,
      displayProfil: false,
      connected: false,
      menuItem: [],
      admin: false
    }
  },
  components: { AvatarDisplay },
  computed: {
    ...mapState(['display'])
  },
  created () {
    this.connected = this.$store.getters.isconnected
    this.admin = this.$store.getters.isAdmin
  },
  methods: {
    checkConnect () {
      if (this.connected) this.disconnect()
      else this.$router.push({ name: 'login' })
    },
    disconnect () {
      let self = this
      let user = this.$store.dispatch('disconnect')
      user.then(() => {
        self.$router.push({ name: 'listEvent' })
        self.$store.dispatch('displayMessage', 'DCNX')
      })
      user.catch((error) => {
        self.$store.dispatch('displayMessage', 'ECNX')
      })
    }
  }
}
</script>

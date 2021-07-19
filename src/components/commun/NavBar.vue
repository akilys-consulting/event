<template>
  <div v-if="display">
    <v-app-bar app color="primary">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>quefaire.fr</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-divider class="mx-4" vertical></v-divider>
        <v-btn v-if="admin" text to="/admin"> mes events</v-btn>
        <v-btn v-if="connected && !admin" text to="/preference">
          mes events</v-btn
        >

        <v-divider class="mx-4" vertical></v-divider>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn depressed text @click="checkConnect" v-on="on">
            <AvatarDisplay @click="checkConnect" />
          </v-btn>
        </template>
        <span>connexion</span>
      </v-tooltip>
    </v-app-bar>
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
      !this.connected ? this.$router.push({ name: 'login' }) : this.disconnect()
    },
    disconnect () {
      let self = this
      let user = this.dispatch('disconnect')
      user.then(() => {
        self.$router.push('/login')
        self.dispatch('displayMessage', 'DCNX')
      })
      user.catch(() => {
        self.dispatch('displayMessage', 'ECNX')
      })
    }
  }
}
</script>

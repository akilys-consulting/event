<template>
  <div>
    <v-toolbar v-if="display" app color="primary">
      <v-app-bar-nav-icon @click="drawer = true"></v-app-bar-nav-icon>
      <v-toolbar-title>quefaire.fr</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-divider class="mx-4" vertical></v-divider>
      <v-btn v-if="admin" text to="/calendrier"> gestion events</v-btn>
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
  async created () {
    this.connected = this.$store.getters.isconnected
    try {
      await this.$store.dispatch('fetchUserProfile')
      this.admin = this.$store.getters.isAdmin
    } catch (ex) {
      console.log('err navbar' + ex.message)
      this.$store.dispatch('displayMessage', 'ECNX')
    }
  },
  mounted () {
    //   this.admin = this.$store.getters.isAdmin
    console.log('admin : ' + this.admin)
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

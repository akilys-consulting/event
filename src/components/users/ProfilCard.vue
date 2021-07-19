<template>
  <v-card>
    <ImageUserDisplay @disconnect="disconnect" />

    <v-list>
      <v-divider></v-divider>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title class="title"
            >{{ profil.nom }} - {{ profil.prenom }}</v-list-item-title
          >
          <v-list-item-subtitle>{{ profil.societe }}</v-list-item-subtitle>
          <v-list-item-subtitle>{{ authUser.email }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
import { fb } from '@/firebaseDef'
import ImageUserDisplay from '@/components/commun/ImageUserDisplay'
export default {
  components: { ImageUserDisplay },
  name: 'ProfilCard',
  data () {
    return {
      profil: {},
      authUser: {}
    }
  },
  mounted () {
    // récupération du user courant
    let self = this
    this.authUser = this.$store.getters.getUserInfo
    console.log('appel a fetchProfile')
    let execute = this.$store.dispatch('fetchUserProfile')
    execute.then((data) => {
      self.profil = data
      self.$emit('updateProfile')
    })
  },
  methods: {
    disconnect () {
      let self = this
      const user = fb.auth.signOut()
      user.then(() => {
        self.$store.dispatch('clearData')
        self.$router.push('/login')
      })
      user.catch((err) => {
        console.log(err)
      })
    }
  }
}
</script>

<style></style>

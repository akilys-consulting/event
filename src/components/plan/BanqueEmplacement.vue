<template>
  <v-card class="mx-auto" max-width="400">
    <v-list>
      <v-list-item-group>
        <v-list-item v-for="(image, name) in banqueEmplacement" :key="name">
          <v-list-item-icon @click="setImage(image)">
            <v-icon color="light-green lighten-3" v-text="image.icon"></v-icon>
          </v-list-item-icon>

          <v-list-item-content @click="setImage(image)">
            <v-list-item-title v-text="image.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script>
import { fb } from '@/plugins/firebaseInit'

export default {
  name: 'banqueEmplacement',
  data () {
    return {
      banqueEmplacement: []
    }
  },
  created () {
    this.getBanqueImage()
  },
  methods: {
    getBanqueImage () {
      let self = this
      this.$store.dispatch('startWaiting')

      // récuperation des emplacement
      fb.banqueEmplacementCollection
        .get()
        .then(function (querySnapshot) {
          querySnapshot.forEach(function (emplacement) {
            self.banqueEmplacement.push({
              icon: 'mdi-' + emplacement.data().name,
              path: emplacement.data().path,
              name: emplacement.data().name
            })
          })
          self.$store.dispatch('stopWaiting')
        })
        .catch((err) => {
          self.$store.dispatch('stopWaiting')

          self.dispatch('displayMessage', { code: 'EGIM', param: err.message })
          reject(false)
        })
    },
    setImage (image) {
      this.$emit('setemplacement', image.path)
    }
  }
}
</script>

<style></style>

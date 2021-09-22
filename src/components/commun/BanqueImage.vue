<template>
  <v-card class="mx-auto" max-width="400">
    <v-list>
      <v-list-item-group mandatory color="indigo">
        <v-list-item v-for="(image, name) in banqueImage" :key="name">
          <v-list-item-avatar @click="setImage(image)">
            <v-avatar>
              <img :src="image.url" :alt="image.name" />
            </v-avatar>
          </v-list-item-avatar>

          <v-list-item-content>
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
  name: 'banqueImage',
  data () {
    return {
      banqueImage: []
    }
  },
  created () {
    this.getBanqueImage()
  },
  methods: {
    getBanqueImage () {
      this.banqueImage = this.$store.getters['getBanqueImage']
    },
    setImage (image) {
      this.$emit('setImage', image.url)
    }
  }
}
</script>

<style></style>

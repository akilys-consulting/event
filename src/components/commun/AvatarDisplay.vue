<template>
  <v-avatar>
    <v-img v-if="displayImg" :src="urlImg"></v-img>
  </v-avatar>
</template>

<script>
import { fb } from '@/plugins/firebaseInit'
export default {
  name: 'AvatarDisplay',
  data () {
    return { urlImg: null, displayImg: false }
  },
  created () {
    const self = this
    // get UID user
    if (self.$store.getters.isconnected) {
      console.log('avatar: user connect')
      const execute = fb.file
        .ref()
        .child(self.$store.getters.getCurrentAvatarImg)
        .getDownloadURL()
        .then(function (url) {
          self.urlImg = url
          self.displayImg = true
        })
        .catch(function () {
          self.loadDefautImg()
        })
    } else {
      this.loadDefautImg()
    }
  },
  methods: {
    loadDefautImg () {
      const self = this
      let executeFile = fb.file
        .ref()
        .child(this.$store.getters.getDefaultAvatarImg)
        .getDownloadURL()
        .then(function (url) {
          self.urlImg = url
          self.displayImg = true
        })
        .catch(() => {
          console.log('pas de fichier')
        })
    }
  }
}
</script>

<style>
.taille_image {
  width: 284;
  height: 80%;
}
</style>

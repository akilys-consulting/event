<template>
  <v-list-item-avatar>
    <v-img v-if="displayImg" :src="urlImg"></v-img>
  </v-list-item-avatar>
</template>

<script>
import { fb } from '@/firebaseDef'
export default {
  name: 'AvatarDisplay',

  data () {
    return { urlImg: null, displayImg: false }
  },
  created () {
    let self = this
    // get UID user
    const execute = fb.file
      .ref()
      .child(self.$store.getters.getCurrentAvatarImg)
      .getDownloadURL()
    execute.then(function (url) {
      self.urlImg = url
      self.displayImg = true
    })
    execute.catch(function () {
      let defaultFile = fb.file
        .ref()
        .child(self.$store.getters.getDefaultAvatarImg)
        .getDownloadURL()
      defaultFile.then(function (url) {
        self.urlImg = url
        self.displayImg = true
      })
      defaultFile.catch(() => {
        console.log('pas de fichier')
      })
    })
  },
  methods: {
    loadImg () {}
  }
}
</script>

<style>
.taille_image {
  width: 284;
  height: 80%;
}
</style>

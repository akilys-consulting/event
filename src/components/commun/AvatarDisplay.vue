<template>
  <v-row>
    <v-col cols="5">
      <v-avatar :size="sizeAvatar">
        <v-img :src="urlImg"></v-img>
      </v-avatar>
    </v-col>

    <v-col cols="7" align-self="start">
      <v-file-input
        v-if="uploadMode"
        v-model="file"
        :loading="loadPhoto"
        show-size
        dense
        accept="image/png, image/jpeg, image/bmp image/svg"
        :placeholder="placeholderImg"
        prepend-icon="mdi-camera"
        @change="UploadFile"
        @click.stop
      ></v-file-input>
    </v-col>
  </v-row>
</template>

<script>
import { fb } from '@/plugins/firebaseInit'
import { mapGetters } from 'vuex'

export default {
  name: 'AvatarDisplay',
  props: ['uploadMode', 'sizeAvatar'],

  data () {
    return {
      urlImg: null,
      displayImg: false,
      loadPhoto: false,
      placeholderImg: 'changer votre avatar',
      file: null
    }
  },

  mounted () {
    // récupération de l'avatar (google ou storage)
    this.$store.dispatch('cnx/getProfilPhoto').then((url)=>{
        this.urlImg = url
    }).catch((error)=>{
      self.$store.dispatch('displayMessage', {'code':'IMOK',param:error})
    })
  },
  methods: {
    UploadFile (file) {
      let self = this
      // récupération du nom de l'image
      if (typeof file !== 'undefined' && file != null) {
        this.$store.dispatch('startWaiting')
        // get avatar rep+filename
        let filename = this.$store.getters['cnx/getAvatarImg']

        if (filename) {
          let storageRef = fb.file.ref()

          storageRef
            .child(filename)
            .put(file)
            .then(function (snapshot) {
              self.$store.dispatch('stopWaiting')
              self.$store.dispatch('displayMessage', 'IMOK')
              self.localImg = self.fileName
              self.displayImage().then(() => {
                self.$emit('uploadfile', self.urlImg)
                self.file = null
              })
            })
            .catch(() => {
              self.$store.dispatch('stopWaiting')
              self.$store.dispatch('displayMessage', 'IMKO')
            })
        }
      }
    },
    displayImage: function () {
      let self = this
      let filename = this.$store.getters['cnx/getAvatarImg']
      return new Promise((resolve, reject) => {
        if (filename && typeof filename !== 'undefined') {
          const file = fb.file
            .ref()
            .child(filename)
            .getDownloadURL()
          file.then(function (url) {
            self.urlImg = url
            self.displayImg = true
            self.loadPhoto = false
            self.placeholderImg = "Changer d'image"
            resolve()
          })
          file.catch(function (err) {
            self.getDefaultImg()
            reject(err)
          })
        } else {
          self.getDefaultImg()
        }
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

<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" align-self="start">
        <v-file-input
          v-model="file"
          show-size
          dense
          v-if="this.fileName != -1"
          accept="image/jpeg"
          :placeholder="placeholderImg"
          prepend-icon="mdi-camera"
          @change="UploadFile"
          @click.stop
        ></v-file-input>
        <span v-else
          >L'image ne peut être changée que si l'évènement est sauvegardé</span
        >
      </v-col>

      <v-col cols="12">
        <v-img contain max-height="150" max-width="300" :src="urlImg">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular
                indeterminate
                color="grey lighten-5"
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { fb } from '@/plugins/firebaseInit'
import mixFunctions from '@/components/commun/Functions'
import { mapState } from 'vuex'

export default {
  name: 'ImageUpload',
  mixins: [mixFunctions],
  data () {
    return {
      displayImg: false,
      urlImg: '',
      loadPhoto: false,
      localImg: null,
      placeholderImg: 'choisir une image',
      file: null
    }
  },
  props: ['fileName', 'rep'],
  computed: {
    ...mapState('event', ['CONST_RESIZE_HEIGHT', 'CONST_RESIZE_WIDTH'])
  },

  created () {
    this.localImg = this.fileName
    this.displayImage()
  },
  methods: {
    stopPropagation (event) {
      event.preventDefault()
    },
    getDefaultImg () {
      let self = this

      const fileDefault = fb.file
        .ref()
        .child(this.rep + '/IMG_DEFAUT.jpg')
        .getDownloadURL()
      fileDefault.then(function (url) {
        console.log('get default img')
        self.urlImg = url
        self.displayImg = true
        self.loadPhoto = false
      })
      fileDefault.catch(() => {
        self.loadPhoto = false
        // message chargement photo impossible
        self.$store.dispatch('displayMessage', 'IMKO')
      })
    },
    displayImage: function () {
      let self = this
      if (
        this.localImg &&
        typeof this.localImg !== 'undefined' &&
        this.localImg !== -1
      ) {
        fb.file
          .ref()
          .child(this.rep + '/' + this.localImg)
          .getDownloadURL()
          .then(function (url) {
            self.urlImg = url
            self.displayImg = true
            self.loadPhoto = false
            self.placeholderImg = "Changer d'image"
          })
          .catch(function () {
            self.getDefaultImg()
          })
      } else {
        self.getDefaultImg()
      }
    },
    UploadFile: function (file) {
      let self = this
      let typeFile = file.type.split('/')
      const newMetadata = { cacheControl: 'public,max-age=4000' }

      // récupération du nom de l'image
      if (typeof file !== 'undefined' && file != null) {
        this.$store.dispatch('startWaiting')
        // on redéfinit l'image pour la réduire si besoin
        var reader = new FileReader()
        reader.onload = function (e) {
          self
            .resizeImage({
              file: file,
              width: self.CONST_RESIZE_WIDTH,
              height: self.CONST_RESIZE_HEIGHT,
              type: typeFile[1]
            })
            .then((resp) => {
              fb.file
                .ref()
                // on va détruire l'image qui existait
                // storageRef.child(this.filename).delete();
                .child(self.rep + '/' + self.fileName)
                .put(resp, newMetadata)
                .then(function (snapshot) {
                  self.$store.dispatch('stopWaiting')
                  self.$store.dispatch('displayMessage', 'IMOK')
                  self.localImg = self.fileName
                  self.displayImage()
                  self.file = null
                })
                .catch(() => {
                  self.$store.dispatch('stopWaiting')
                  self.$store.dispatch('displayMessage', 'IMKO')
                })
            })
            .catch(() => {})
        }
        reader.readAsDataURL(file)
      }
    }
  }
}
</script>

<style></style>

<template>
  <v-container fluid>
    <v-card>
      <v-row>
        <v-col cols="12" align-self="start">
          <v-file-input
            v-model="file"
            show-size
            dense
            v-if="this.fileName != -1"
            accept="image/png, image/jpeg, image/bmp image/svg"
            :placeholder="placeholderImg"
            prepend-icon="mdi-camera"
            @change="UploadFile"
            @click.stop
          ></v-file-input>
          <v-else
            >L'image ne peut être changée que si l'évènement est
            sauvegardé</v-else
          >
        </v-col>

        <v-col cols="12">
          <v-img height="200" :src="urlImg">
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
    </v-card>
  </v-container>
</template>

<script>
import { fb } from '@/plugins/firebaseInit'
export default {
  name: 'ImageUpload',
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
    getUrlImg () {
      return self.urlImg
    }
  },

  created () {
    console.log('id' + this.fileName)
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

      // récupération du nom de l'image
      if (typeof file !== 'undefined' && file != null) {
        this.$store.dispatch('startWaiting')
        fb.file
          .ref()
          // on va détruire l'image qui existait
          // storageRef.child(this.filename).delete();
          .child(this.rep + '/' + self.fileName)
          .put(file)
          .then(function (snapshot) {
            console.log('fichier' + self.fileName)
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
      }
    }
  }
}
</script>

<style></style>

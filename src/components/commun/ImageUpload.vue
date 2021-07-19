<template>
  <v-container fluid>
    <v-card>
      <v-row>
        <v-col cols="6">
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
        <v-col cols="6" align-self="start">
          <v-file-input
            v-model="file"
            :loading="loadPhoto"
            show-size
            dense
            accept="image/png, image/jpeg, image/bmp"
            :placeholder="placeholderImg"
            prepend-icon="mdi-camera"
            @change="UploadFile"
            @click.stop
          ></v-file-input>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import { fb } from '@/firebaseDef'
export default {
  name: 'ImageUpload',
  data () {
    return {
      displayImg: false,
      urlImg: '',
      loadPhoto: true,
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
        self.localImg = url
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
      if (this.localImg && typeof this.localImg !== 'undefined') {
        const file = fb.file
          .ref()
          .child(this.rep + '/' + this.localImg)
          .getDownloadURL()
        file.then(function (url) {
          self.urlImg = url
          self.displayImg = true
          self.loadPhoto = false
          self.placeholderImg = "Changer d'image"
        })
        file.catch(function () {
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
        var storageRef = fb.file.ref()

        // on va détruire l'image qui existait
        // storageRef.child(this.filename).delete();
        storageRef.child(this.rep + '/' + self.fileName).put(file)
        storageRef.then(function (snapshot) {
          self.$store.dispatch('stopWaiting')
          self.$store.dispatch('displayMessage', 'IMOK')
          self.localImg = self.fileName
          self.displayImage()
          self.file = null
        })
        storageRef.catch(() => {
          self.$store.dispatch('stopWaiting')
          self.$store.dispatch('displayMessage', 'IMKO')
        })
      }
    }
  }
}
</script>

<style></style>

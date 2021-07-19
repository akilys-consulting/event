<template>
  <v-card>
    <v-img :height="height" :width="width" :src="urlImg">
      <template v-slot:placeholder>
        <v-row class="fill-height ma-0" align="center" justify="center">
          <v-progress-circular
            indeterminate
            color="grey lighten-5"
          ></v-progress-circular>
        </v-row>
      </template>
    </v-img>
  </v-card>
</template>

<script>
import { fb } from '@/firebaseDef'
export default {
  name: 'displayImage',
  data () {
    return {
      displayImg: false,
      urlImg: '',
      loadPhoto: true,
      localImg: null,
      file: null
    }
  },
  props: ['fileName', 'rep', 'height', 'width'],
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
    getDefaultImg () {
      let self = this
      const file = fb.file
        .ref()
        .child(this.rep + '/IMG_DEFAUT.jpg')
        .getDownloadURL()
      file.then((url) => {
        self.urlImg = url
        self.displayImg = true
        self.loadPhoto = false
      })
      file.catch(() => {
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
        })
        file.catch(function () {
          self.getDefaultImg()
        })
      } else {
        self.getDefaultImg()
      }
    }
  }
}
</script>

<style>
.map {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>

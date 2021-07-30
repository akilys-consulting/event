<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="headline grey lighten-2">
        Ajouter une image
      </v-card-title>

      <v-card-text>
        <v-file-input
          label="charger une image"
          filled
          prepend-icon="mdi-camera"
          @change="uploadEventImg"
        ></v-file-input>
      </v-card-text>

      <v-divider></v-divider>
    </v-card>
    <v-row v-if="tabPathImage.length > 1">
      <v-col cols="12">
        <v-data-iterator
          :lstimage="tabPathImage"
          hide-default-footer
          no-results-text="Pas d'image trouvé"
        >
          <template v-slot:default="props">
            <v-row>
              <v-col
                v-for="image in props.lstimage"
                :key="image.path"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <displayEventImg :imageEvent="image" />
              </v-col>
            </v-row>
          </template>
        </v-data-iterator>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import displayEventImg from '@/components/event/DisplayEventImg'
export default {
  data () {
    return {
      tabPathImage: [],
      requestAddImg: false,
      file: null
    }
  },
  name: 'ListEventImg',

  components: { displayEventImg },
  created () {
    // chargement des images displonible pour l'event
    this.tabPathImage = this.$store.getters['event/getCurrentEventImg']
  },

  methods: {
    uploadEventImg (file) {
      let self = this
      if (typeof this.file !== 'undefined') {
        let img2save = {}
        img2save.file = file
        img2save.name = this.$store.getters['event/getCurrentEventId']
        console.log('id' + img2save.name)
        img2save.rep = this.$store.getters['event/getEventImgPath']
        console.log('image ' + img2save.name + img2save.rep)
        let execute = this.$store.dispatch('saveImg', img2save)
        execute.then(imgId => {
          img2save.path = imgId
          console.log('image saved')
          self.$store.commit('event/setAddEventImg', img2save.name)
          self.tabPathImage.push(img2save.name)
        })
        execute.catch(() => {
          self.$store.dispatch('displayMessage', 'LIMG')
        })
      }
    }
  }
}
</script>

<style></style>

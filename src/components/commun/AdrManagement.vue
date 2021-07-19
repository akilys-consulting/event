<template>
  <div>
    <dialogmodal ref="checkModif" :message="codeQuestion">
      <example-slot :key="codeQuestion.display"></example-slot>
    </dialogmodal>
    <v-text-field
      class="updateAdr"
      v-model="localeadr.adr"
      id="country"
      label="Votre adresse"
    ></v-text-field>
  </div>
</template>

<script>
import places from 'places.js'
import dialogmodal from '@/components/commun/DialogModal'
export default {
  name: 'adrmanagement',
  components: {
    dialogmodal
  },
  props: ['adresse'],
  data () {
    return {
      codeQuestion: {
        code: 'GMOD',
        display: false
      },
      localeadr: {
        adr: '',
        latLgt: {
          lat: 0,
          lgt: 0
        }
      }
    }
  },
  created () {
    if (typeof this.adresse !== 'undefined') this.localeadr = this.adresse
  },
  mounted () {
    let self = this
    var placesAutocomplete = places({
      container: document.getElementById('country')
    }).configure({
      countries: ['fr']
    })
    placesAutocomplete.on('change', function (e) {
      let execute = self.$refs.checkModif.open(
        'sauvegarde',
        'voulez-vous sauvegarder la valeur <br>' + e.suggestion.value + ' ?',
        {
          color: 'red',
          width: '300'
        }
      )
      execute.then((data) => {
        if (data) {
          self.localeadr = {
            adr: e.suggestion.value,
            latLng: e.suggestion.latlng
          }
          self.$emit('uptadr', self.localeadr)
        }
      })
    })
  },
  methods: {}
}
</script>
<style>
.ap-input {
  border: none;
}
</style>

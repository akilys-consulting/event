<template>
  <div>
    <dialogmodal ref="checkModif" :message="codeQuestion">
      <example-slot :key="codeQuestion.display"></example-slot>
    </dialogmodal>
    <v-text-field
      id="autocomplete"
      ref="autocomplete"
      v-model="localeadr.adr"
      placeholder="Search"
      :label="libelleAdr == null ? 'Votre adresse' : libelleAdr"
      onfocus="value = ''"
      type="text"
    />
  </div>
</template>

<script>
import dialogmodal from '@/components/commun/DialogModal'
export default {
  name: 'adrmanagement',
  components: {
    dialogmodal
  },
  props: ['adresse', 'libelleAdr'],
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
    console.log('adrManagement' + this.adresse)
    if (typeof this.adresse !== 'undefined') this.localeadr = this.adresse
  },
  mounted () {
    let self = this
    let currentField = document.getElementById('autocomplete')

    this.autocomplete = new window.google.maps.places.Autocomplete(currentField)

    this.autocomplete.addListener('place_changed', () => {
      let place = this.autocomplete.getPlace()
      let localeadr = { adr: null, latLng: { lat: 0, lng: 0 } }
      localeadr = {
        adr: place['formatted_address'],
        latLng: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }
      self.$emit('uptadr', self.localeadr)
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

<template>
  <div>
    <dialogmodal ref="checkModif"> </dialogmodal>
    <v-text-field
      id="autocomplete"
      ref="autocomplete"
      v-model="localeadr.adr"
      label="Votre adresse"
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
    console.log('adrManagement')
    console.log(this.adresse)
    if (typeof this.adresse !== 'undefined') this.localeadr = this.adresse
  },
  mounted () {
    // permet d'effacer le placeholder par défaut de Google
    document.getElementById('autocomplete').setAttribute('placeholder', '')
    let currentField = document.getElementById('autocomplete')

    this.autocomplete = new window.google.maps.places.Autocomplete(
      currentField,
      { componentRestrictions: { country: 'fr' } }
    )

    this.autocomplete.addListener('place_changed', () => {
      let place = this.autocomplete.getPlace()
      this.localeadr = { adr: null, latLng: { lat: 0, lng: 0 } }
      this.localeadr = {
        adr: place['formatted_address'],
        latLng: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        }
      }
      this.$emit('uptadr', this.localeadr)
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

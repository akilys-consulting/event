<template>
  <v-overlay :value="waiting">
    <p class="font-weight-thin loader">
      <v-progress-circular
        :size="50"
        color="amber"
        indeterminate
      ></v-progress-circular>
      Chargement...
    </p>
  </v-overlay>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'displayChargement',
  computed: {
    ...mapState(['waiting'])
  }
}
</script>

<style></style>

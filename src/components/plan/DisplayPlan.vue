<template>
  <v-hover v-slot:default="{ hover }">
    <v-card class="mx-auto">
      <v-img
        :src="itemPlan.img_plan"
        class="white--text align-end"
        max-height="350"
        max-width="450"
        gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular
              indeterminate
              color="grey lighten-5"
            ></v-progress-circular>
          </v-row>
        </template>

        <v-card-title>{{ displayVille(itemPlan.ville) }}</v-card-title>
        <v-card-title>{{ itemPlan.nom }}</v-card-title>
        <v-expand-transition>
          <div v-if="hover">
            <v-card-actions>
              <v-bottom-navigation>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      small
                      @click="goto(itemPlan, 'plandesign')"
                    >
                      <v-icon dark>mdi-floor-plan</v-icon>
                    </v-btn>
                  </template>
                  <span>Concevoir</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" small @click="goto(itemPlan, 'planForm')">
                      <v-icon dark>mdi-lead-pencil</v-icon>
                    </v-btn>
                  </template>
                  <span>Modifier</span>
                </v-tooltip>
              </v-bottom-navigation>
            </v-card-actions>
          </div>
        </v-expand-transition>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script>
import mixFunctions from '@/components/commun/Functions'

export default {
  data () {
    return {}
  },
  name: 'displayPlan',
  props: ['itemPlan'],
  mixins: [mixFunctions],

  methods: {
    goto (element, destination) {
      console.log('element' + element)
      this.$store.commit('plan/setCurrentPlan', element)
      this.$router.push({ name: destination })
    }
  }
}
</script>

<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.9;
  position: absolute;
  width: 100%;
}
</style>

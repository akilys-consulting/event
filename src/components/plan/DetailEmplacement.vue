<template>
  <v-dialog :value="DisplayDetailEmplacement" persistent :max-width="300">
    <v-card height="100%" width="100%">
      <v-card-title>
        <span class="headline">Informations</span>
      </v-card-title>
      <v-card-text>
        <v-col cols="12">
          <v-text-field
            v-model="currentEmplacement.reference"
            label="reference"
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <p class="subtitle-1">catégorie de l'emplacement :</p>
          <v-radio-group v-model="currentEmplacement.couleur">
            <v-radio
              v-for="categorie in categoriesEmplacement"
              :key="categorie.prix"
              :label="categorie.color.hex"
              :value="categorie.color.hex"
            >
              <template v-slot:label>
                <v-chip :color="categorie.color.hex"></v-chip>
              </template>
            </v-radio>
          </v-radio-group>
        </v-col>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" outlined text @click="closewindows"
          >Close</v-btn
        >
        <v-btn color="success" outlined text @click="saveEmplacement"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex'
import { fb } from '@/plugins/firebaseInit'

export default {
  data () {
    return {
      categoriesEmplacement: []
    }
  },
  created () {
    this.categoriesEmplacement =
      this.$store.getters['plan/getCurrentCatEmplacement']
    this.planId = this.$store.getters['plan/getCurrentPlanId']
  },
  computed: {
    ...mapState('plan',['DisplayDetailEmplacement']),
    ...mapState('plan', { currentEmplacement: 'currentEmplacement' })
  },
  methods: {
    closewindows () {
      this.$store.commit('plan/setDisplayDetailEmplacement')
      this.$store.commit('plan/setInitCurrentEmplacement')
    },
    saveEmplacement () {
      this.$store.dispatch('plan/saveEmplacement', this.currentEmplacement)
      this.$emit('refreshemp')
      this.closewindows()
    }
  }
}
</script>

<style></style>

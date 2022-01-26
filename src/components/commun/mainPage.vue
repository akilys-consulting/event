<template>
  <v-card>
    <v-data-iterator
      hide-default-footer
      :page.sync="page"
      :items="filteredItems"
      :items-per-page="getItemsPerPage"
      :sort-by="['start']"
    >
      <template v-slot:default="{ items }">
        <v-row>
          <v-col
            v-for="item in items"
            :key="item.start + item.end + item.name"
            cols="12"
            xs="12"
            sm="6"
            lg="3"
            md="4"
            class="d-flex child-flex"
          >
            <displayEvent
              :key="item.start + item.end + item.nom"
              :itemPlanning="item"
          /></v-col>
        </v-row>
      </template>
    </v-data-iterator>
  </v-card>
</template>

<script>
export default {
    name : 'mainPage'
  data () {
    return {}
  },
  computed:{
      ...mapState('event', ['planning']),

filteredItems () { // on récupère les enregistrements correspondant aux critères
let allElements = []
allElements = this.planning.filter((row) => { return
this.searchByCritere(row) })

  },
}
</script>

<style></style>

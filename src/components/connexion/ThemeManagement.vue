<template>
  <v-tab-item>
    <v-card-text>
      <v-row>
        <v-col cols="6"
          ><v-switch label="sombre" v-model="$vuetify.theme.dark" />
        </v-col>
        <v-col cols="6"
          ><v-select
            v-model="$vuetify.theme.themes.name"
            :items="themes"
            item-text="name"
            menu-props="auto"
            label="Select"
            hide-details
            prepend-icon="mdi-palette-outline"
            single-line
            @change="setTheme"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>
  </v-tab-item>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ThemeChanger',

  computed: {
    ...mapState(['themes']), // assuming you are using namespaced modules
    ...mapState('cnx', ['currentProfil'])
  },

  data: () => ({
    currentTheme: null
  }),

  mounted () {
    this.setTheme(this.currentProfil.theme.name)
    this.$vuetify.theme.dark = this.currentProfil.theme.dark
  },
  methods: {
    setTheme (selected) {
      let theme = this.themes.find((value) => value.name == selected)
      const name = theme.name
      const dark = theme.dark
      const light = theme.light // set themes
      Object.keys(dark).forEach((i) => {
        this.$vuetify.theme.themes.dark[i] = dark[i]
      })
      Object.keys(light).forEach((i) => {
        this.$vuetify.theme.themes.light[i] = light[i]
      }) // also save theme name to disable selection
      this.$vuetify.theme.themes.name = name
    }
  }
}
</script>

<style></style>

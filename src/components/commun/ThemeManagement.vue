<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark icon v-bind="attrs" v-on="on">
        <v-icon> mdi-palette-outline </v-icon>
      </v-btn>
    </template>
    <v-subheader>Choix du thème</v-subheader>
    <v-switch label="sombre" v-model="$vuetify.theme.dark" />
    <v-list-item-group v-model="getCurrentTheme" color="primary">
      <v-list>
        <v-list-item v-for="(item, index) in themes" :key="index">
          <v-list-item-title @click="setTheme(item)">{{
            item.name
          }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-list-item-group>
  </v-menu>
</template>

<script>
export default {
  inject: ['theme'],

  name: 'ThemeChanger',
  data: () => ({
    currentTheme: null,
    themes: [
      {
        name: 'vert',
        dark: {
          primary: '#90AB47',
          accent: '#FF4081',
          secondary: '#9ECBB4',
          success: '#74F25A',
          info: '#BCEDAD',
          warning: '#FB8C00',
          error: '#EA4848'
        },
        light: {
          primary: '#1976D2',
          accent: '#e91e63',
          secondary: '#30b1dc',
          success: '#4CAF50',
          info: '#2196F3',
          warning: '#FB8C00',
          error: '#FF5252'
        }
      },
      {
        name: 'marron',
        dark: {
          primary: '#A1887F',
          accent: '#BF360C',
          secondary: '#689F38',
          success: '#43A047',
          info: '#78909C',
          warning: '#FB8C00',
          error: '#E65100'
        },
        light: {
          primary: '#ffa450',
          accent: '#a1e754',
          secondary: '#92de4e',
          success: '#6dff74',
          info: '#7365ff',
          warning: '#2e8ac0',
          error: '#ff5e3c'
        }
      }
    ]
  }),
  created () {
    console.log('current theme ' + this.$vuetify.theme.themes.name)
  },
  computed: {
    getCurrentTheme () {
      return this.themes.findIndex((element) => {
        return element.name === this.$vuetify.theme.themes.name
      })
    }
  },
  methods: {
    setTheme (theme) {
      console.log('click' + this.$vuetify.theme.themes.name)
      // close menu
      this.menu = false
      const name = theme.name
      const dark = theme.dark
      const light = theme.light // set themes
      Object.keys(dark).forEach((i) => {
        console.log('set' + dark[i])
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

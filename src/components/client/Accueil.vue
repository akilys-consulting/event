<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          <span class="red--text text-h3">Sortie Toulouse</span></v-card-title
        >
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card color="blue">
        <v-card-subtitle>les derniers evènements....</v-card-subtitle>
        <v-card-text>
          <v-carousel
            :continuous="false"
            :cycle="cycle"
            :show-arrows="false"
            hide-delimiter-background
            delimiter-icon="mdi-minus"
            height="300"
          >
            <v-carousel-item v-for="(slide, i) in slides" :key="i">
              <v-hover v-slot="{ hover }">
                <v-card
                  class="d-flex flex-column"
                  :elevation="hover ? 12 : 6"
                  :class="{ 'on-hover': hover }"
                  color="red"
                >
                  <v-row>
                    <v-col class="mt-3" cols="6">
                      <span></span>
                      <div class="ms-4">xxxxx</div>
                      <v-card-subtitle class="orange--text"
                        >xxxxx
                      </v-card-subtitle>
                    </v-col>
                    <v-col cols="6">
                      <v-avatar tile size="125"
                        ><displayImage
                          fileName="xxxxxx"
                          rep="image_event"
                          height="100%"
                          width="100%"
                        ></displayImage>
                      </v-avatar>
                    </v-col>
                  </v-row>
                </v-card>
              </v-hover>
            </v-carousel-item>
          </v-carousel>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
export default {
  data () {
    return {
      slides: ['First', 'Second', 'Third', 'Fourth', 'Fifth'],
      colors: [
        'green',
        'secondary',
        'yellow darken-4',
        'red lighten-2',
        'orange darken-1'
      ],
      cycle: false
    }
  },
  created () {
    this.$store.commit('setDisplayMenuOn')
  },
  methods: {
    getLastEvents () {}
  }
}
</script>

<style></style>

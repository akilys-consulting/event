<template>
  <v-dialog
    overlay-opacity="0.4"
    overlay-color="white"
    v-model="this.dialog"
    :max-width="options.width"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-card-text class="pa-4">{{ question.message }} ?</v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="primary" dark @click.native="agree">Oui</v-btn>
        <v-btn color="grey" @click.native="cancel">Non</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      answer: null,
      dialog: false,
      question: { display: false, message: '' },
      options: {
        color: 'primary',
        width: 290,
        zIndex: 200
      }
    }
  },

  methods: {
    open () {
      this.question = this.$store.getters.getQuestion
      this.dialog = true
      return new Promise((resolve) => {
        this.answer = resolve
      })
    },
    agree () {
      this.dialog = false
      this.$store.commit('setInitQuestion')
      this.answer(true)
    },
    cancel () {
      this.dialog = false
      this.$store.commit('setInitQuestion')
      this.answer(false)
    }
  }
}
</script>

<template>
  <v-dialog
    overlay-opacity="0.4"
    overlay-color="white"
    v-model="dialog"
    :max-width="options.width"
    @keydown.esc="cancel"
  >
    <v-card>
      <v-toolbar dark dense flat>
        <v-toolbar-title class="white--text"
          >Action à votre demande</v-toolbar-title
        >
      </v-toolbar>
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
import { mapState } from 'vuex'
export default {
  data: () => ({
    dialog: false,
    resolve: null,
    reject: null,
    question: { message: null },
    options: {
      color: 'primary',
      width: 290,
      zIndex: 200
    }
  }),

  methods: {
    open () {
      this.question = this.$store.getters.getQuestion
      this.dialog = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    agree () {
      this.dialog = false
      this.question = false
      this.$store.commit('setInitQuestion')
      this.resolve(true)
    },
    cancel () {
      this.dialog = false
      this.question = false
      this.$store.commit('setInitQuestion')
      this.resolve(false)
    }
  }
}
</script>

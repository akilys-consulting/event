<template>
  <v-dialog v-model="ActiveEmailWin" width="500">
    <v-card>
      <v-card-subtitle>Partager cet évènement</v-card-subtitle>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="email"
                label="saisir l'email du destinataire"
                :rules="emailRules"
                required
              ></v-text-field>
            </v-col>
            <v-col col="6">
              <v-btn
                plain
                :disabled="!valid"
                @click.stop="sendEmail"
                text
                color="primary"
                >Envoyer</v-btn
              >
            </v-col>
            <v-col col="6">
              <v-btn plain text @click.stop="cancelAction">Annuler</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import emailjs from 'emailjs-com'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      email: '',
      valid: true,
      emailRules: [
        (v) => !!v || 'E-mail à saisir',
        (v) => /.+@.+\..+/.test(v) || 'E-mail non valide'
      ]
    }
  },
  props: ['content'],

  computed: {
    ...mapState('event', ['ActiveEmailWin'])
  },
  methods: {
    sendEmail () {
      if (this.$refs.form.validate()) {
        let templateParams = {
          event_contact: this.email,
          event_name: this.content.name,
          date_debut: this.content.debut,
          date_fin: this.content.fin,
          event_adr: this.content.adr,
          event_description: this.content.description
        }
        emailjs.init('user_ykRUBR3yHvO1VOlIU0z2V')
        emailjs
          .send('gmail', 'template_buy6lvg', templateParams)
          .catch((error) => {
            console.log('erreur emailjs' + error.message)
          })
        this.$store.commit('event/setActiveEmailWin')
      }
    },
    cancelAction () {
      this.$store.commit('event/setActiveEmailWin')
    }
  }
}
</script>

<template>
  <v-card>
    <v-card-subtitle>Partager cette event</v-card-subtitle>
    <v-card-text>
      <v-form ref="form" @submit.prevent="sendEmail" lazy-validation>
        <v-row>
          <v-col cols="8">
            <v-text-field
              v-model="email"
              label="saisir l'email du destinataire"
              required
            ></v-text-field>
          </v-col>
          <v-col col="4">
            <v-btn text color="primary">Envoyer</v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>
<script>
import emailjs from 'emailjs-com'

export default {
  data () {
    return { email: '' }
  },
  methods: {
    sendEmail: e => {
      let templateParams = {
        to_name: 'jerome.vidaillac@gmail.com',
        commande: 'CMD962020',
        message_html: 'coucou , ceci est un test'
      }
      emailjs.send('gmail', 'template_W2ROE7Xi', templateParams)
    }
  }
}
</script>

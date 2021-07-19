<template>
  <form class="contact-form" @submit.prevent="sendEmail">
    <label>Name</label>
    <input type="text" name="user_name" />
    <label>Email</label>
    <input type="email" name="user_email" />
    <label>Message</label>
    <textarea name="message"></textarea>
    <input type="submit" value="Send" />
  </form>
</template>
<script>
import emailjs from 'emailjs-com'

export default {
  methods: {
    sendEmail: (e) => {
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

<template>
  <div class="resetPassword">
    <md-content class="md-elevation-9">
      <h3>initialisation mot de passe</h3>
      <p>We will send you an email to reset your password</p>

      <md-field>
        <label>Email</label>
        <md-input v-model="email"></md-input>
      </md-field>

      <md-button @click="resetPassword" class="md-raised md-primary"
        >init mot de passe</md-button
      >

      <transition name="fade">
        <div v-if="passwordResetSuccess" class="md-primary">
          <p>
            Un email a été envoyé à votre adresse avec la procédure à réaliser
          </p>
        </div>
        <div v-if="errorMsg !== ''" class="md-accent">
          <p>{{ errorMsg }}</p>
        </div>
      </transition>
    </md-content>
  </div>
</template>
<script>
import { fb } from '@/firebaseDef.js'
export default {
  name: 'resetPassword',
  data () {
    return {
      email: '',
      performingRequest: false,
      passwordResetSuccess: false,
      errorMsg: ''
    }
  },
  methods: {
    resetPassword () {
      this.performingRequest = true
      const user = fb.auth.sendPasswordResetEmail(this.email)
      user.then(() => {
        this.performingRequest = false
        this.passwordResetSuccess = true
        this.email = ''
      })
      user.catch((err) => {
        console.log(err)
        this.performingRequest = false
        this.errorMsg = err.message
      })
    }
  }
}
</script>
<style></style>

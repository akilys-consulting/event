<template>
  <div class="text-center">
    <v-menu
      v-model="menuProfil"
      :close-on-content-click="false"
      :nudge-width="400"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">
          Mon compte
        </v-btn>
      </template>
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="voirProfil()">profil</v-btn>
          <v-btn text @click="deconnexion()">déconnexion</v-btn>
          <v-btn color="primary" text @click="menuProfil = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
      <profilForm @closeProfilDetail="closeDetail"></profilForm>
    </v-menu>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import profilForm from '@/components/connexion/ProfilForm'

export default {
  name: 'profil',
  data () {
    return {
      menuProfil: false,
      profil: { nom: '', prenom: '' },
      urlProfilPhoto: null,
      detailDisplayed: false
    }
  },
  components: { profilForm },

  computed: {
    ...mapGetters('cnx', ['getDisplayName'])
  },

  created () {
    let self = this
    this.$store.dispatch('cnx/getProfilPhoto').then((data)=>{
      this.urlProfilPhoto = data
    })

    this.$store
      .dispatch('cnx/loadProfil')
      .then(data => {
        if (data.exists) {
          console.log('then' + data.exists)
          self.profil = data.data()
        }
      })
      .catch(() => {
        console.log('catch')
      })
  },
  methods: {
    deconnexion () {
      console.log('demande de deconnexion')
      this.$store.dispatch('cnx/disconnect').then(() => {
        this.$store.dispatch('displayMessage', { code: 'DCNX', param: null })
      })
      this.$router.push({ name: 'listEvent' }).catch(() => {})
    },
    voirProfil () {
      this.detailDisplayed = true
    },
    closeDetail () {
      console.log('close detail')
      this.detailDisplayed = false
    }
  }
}
</script>

<style></style>

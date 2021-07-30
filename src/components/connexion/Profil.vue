<template>
  <div class="text-center">
    <v-menu
      v-model="menuProfil"
      open-on-hover
      :close-on-content-click="false"
      :nudge-width="200"
      offset-x
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn text v-bind="attrs" v-on="on">
          Mon compte
        </v-btn>
      </template>

      <v-card>
        <v-list>
          <v-list-item>
            <v-list-item-avatar>
              <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title
                >{{ profil.prenom }} {{ profil.nom }}
              </v-list-item-title>
              <v-list-item-subtitle>{{
                profil.organisation
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="voirProfil()">profil</v-btn>
          <v-btn text @click="deconnexion()">déconnexion</v-btn>
          <v-btn color="primary" text @click="menuProfil = false">
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'profil',
  data () {
    return {
      menuProfil: false,
      profil: { nom: '', prenom: '' }
    }
  },

  created () {
    let self = this
    console.log('profil:Created')

    this.$store
      .dispatch('cnx/loadUser')
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
      this.$store.dispatch('cnx/disconnect')
    },
    voirProfil () {
      this.$router.push({ name: 'voirProfil' })
    }
  }
}
</script>

<style></style>

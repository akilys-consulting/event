<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <v-toolbar>
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                fab
                dark
                small
                color="pink"
                v-on="on"
                :to="{ name: 'admin' }"
              >
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </template>
            <span>retour à la liste</span>
          </v-tooltip>

          <v-spacer></v-spacer>
          <v-btn @click="saveUser" large icon>
            <v-icon>mdi-content-save-outline</v-icon>
          </v-btn>
          <v-btn @click="deleteUser" large icon>
            <v-icon>mdi-delete-outline</v-icon>
          </v-btn>
        </v-toolbar>
      </v-col>
    </v-row>
    <v-card tile>
      <v-row>
        <v-col align-self="start" cols="6">
          <ImageUpload :fileName="filename" rep="image_avatar" />
        </v-col>

        <v-col align-self="start" cols="6">
          <v-row>
            <v-col cols="6" lg="6" sm="12" md="12">
              <v-text-field
                label="Nom"
                v-model="nom"
                @change="changeData"
              ></v-text-field>
            </v-col>
            <v-col cols="6" lg="6" sm="12" md="12">
              <v-text-field
                label="Prénom"
                v-model="prenom"
                @change="changeData"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12">
          <v-text-field
            prepend-icon="mdi-account"
            disabled
            label="Email"
            hint="read only"
            persistent-hint
            v-model="email"
          ></v-text-field>
        </v-col>
        <v-col cols="12">
          <v-text-field
            prepend-icon="mdi-office-building"
            label="Société"
            v-model="user.societe"
            @change="changeData"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="12" md="12">
          <adrmanagement
            @uptadr="updateadresse"
            @change="changeData"
            :adresse="user.ville"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script>
import adrmanagement from '@/components/commun/AdrManagement'
import ImageUpload from '@/components/commun/ImageUpload'
import { fb } from '@/firebaseDef.js'
export default {
  data () {
    return {
      filename: null,
      lstProfils: [],
      EmailChanged: false,
      email: null
    }
  },
  name: 'VueUser',
  props: ['user'],
  components: { adrmanagement, ImageUpload },
  beforeRouteLeave (to, from, next) {
    let self = this
    if (this.$store.getters.getModifUser) {
      this.$dialog
        .confirm('Voulez-vous sauver vos modifications', {
          okText: 'Oui',
          cancelText: 'Non'
        })
        .then(function (dialog) {
          self.saveUser()
          next()
        })
        .catch(error => {
          next()
        })
    } else next()
  },
  created () {
    let self = this
    if (typeof this.user !== 'object') this.$router.push({ name: 'admin' })

    if (
      this.user.user_uid !== null &&
      typeof this.user.user_uid !== 'undefined'
    ) {
      this.filename = this.user.user_uid
      let execute = this.$store.dispatch('getEmailUser')
      execute.then(res => {
        self.email = res
        self.lstProfils = self.$store.getters.getAllProfils
      })
      execute.catch(() => {
        self.$store.dispatch('displayMessage', 'ERRE')
      })
    }
  },
  methods: {
    updateadresse: function () {
      console.log('test')
    },

    changeData: function () {
      this.$store.commit('setModifUser')
    },
    deleteUser: function () {
      let self = this
      // vérifier s'il a des commandes
      const commande = fb.commandeCollection
        .where('user_uid', '==', this.user.id)
        .get()
      commande.then(function (querySnapshot) {
        if (querySnapshot.empty) {
          let execute = self.$dialog.confirm(
            'vous confirmez la suppression ?' + e.suggestion.value,
            {
              okText: 'Oui',
              cancelText: 'Non'
            }
          )
          execute.then(function (dialog) {
            // pas de commande, le user peut être supprimé
            self.$store.dispatch('DeleteUser', self.user).then(() => {
              self.$store.dispatch('displayMessage', 'SUOK')
            })
          })
        }
      })
    },
    saveUser: function () {
      let self = this
      this.$store.commit('initModifUser')
      let execute = this.$store.dispatch('updateUser', this.user)
      execute.then(() => {
        self.$store.dispatch('displayMessage', 'SAOK')
      })
      execute.catch(() => {
        self.$store.dispatch('displayMessage', 'SAKO')
      })
    }
  }
}
</script>

<style></style>

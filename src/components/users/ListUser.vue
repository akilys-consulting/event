<template>
  <v-container fluid>
    <v-card>
      <v-card-title>Liste des utilisateurs</v-card-title>

      <v-divider></v-divider>
      <v-data-table
        :headers="headers"
        :items="tabUser"
        item-key="user_uid"
        class="elevation-1"
      >
        <template v-slot:item.image="{ item }">
          <v-avatar size="36" v-if="item.image">
            <img :src="item.image" :alt="item.nom" />
          </v-avatar>
          <v-avatar size="36" color="orange" v-else>
            <span
              >{{ item.prenom.charAt(0).toUpperCase() }}
              {{ item.nom.charAt(0).toUpperCase() }}</span
            >
          </v-avatar>
        </template>
        <template v-slot:item.action="{ item }">
          <v-btn color="primary" fab x-small dark @click="editItem(item)">
            <v-icon>mdi-pencil-outline</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import { fb } from '@/firebaseDef.js'
export default {
  name: 'listUser',
  data () {
    return {
      dialogInfo: { code: 'QDUS', display: false },
      headers: [
        {
          text: 'Avatar',
          align: 'start',
          value: 'image'
        },
        {
          text: 'Nom',
          align: 'start',
          value: 'nom'
        },
        { text: 'Prenom', value: 'prenom' },
        { text: 'Société', value: 'societe' },
        { text: 'Profil', value: 'profil' },
        { text: 'Editer', value: 'action', sortable: false }
      ],
      tabUser: []
    }
  },

  created () {
    let self = this
    this.$store.dispatch('startWaiting')
    const execute = fb.clientCollection.get()
    execute.then(function (querySnapshot) {
      if (querySnapshot.empty) {
        self.$store.dispatch('stopWaiting')
        self.$store.dispatch('displayMessage', 'NDAT')
        console.log('pas utilisateurs')

        // self.$store.dispatch("displayMessage", "LOAS");
      } else {
        self.$store.dispatch('stopWaiting')
        querySnapshot.forEach(function data (user) {
          let infoUser = user.data()
          infoUser.id = user.id
          let file = self.$store.dispatch('getAvatarFile', infoUser.user_uid)
          file.then((url) => {
            infoUser.image = url
            self.tabUser.push(infoUser)
          })
          file.catch(() => {
            infoUser.image = null
            self.tabUser.push(infoUser)
          })
        })
      }
    })
  },
  methods: {
    editItem: function (item) {
      this.$router.push({ name: 'viewProfil', params: { user: item } })
      console.log('Edit user')
    }
  }
}
</script>

<style></style>

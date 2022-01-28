<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn x-small plain v-on="on" v-bind="attrs">
        <v-icon>mdi-share-variant-outline</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-btn
        :color="network.color"
        class="ma-1"
        dark
        x-small
        fab
        @click="share(network.name)"
        v-for="network in networks"
        :key="network.icon"
        ><v-icon>{{ network.icon }}</v-icon>
      </v-btn>
    </v-card>
  </v-menu>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      url: null,
      sharing: {
        url: this.content.url,
        title: this.content.nom,
        description: this.content.description,
        quote: "The hot reload is so fast it's near instant. - Evan You",
        hashtags: 'sortieToulouse',
        twitterUser: 'youyuxi'
      },
      networks: [
        {
          network: 'email',
          name: 'Email',
          icon: 'mdi-email-outline',
          color: '#333333',
          url: 'mailto:?subject=@t&body=@u%0D%0A@d'
        },
        {
          network: 'facebook',
          name: 'Facebook',
          icon: 'mdi-facebook',
          color: '#1877f2',
          url: 'https://www.facebook.com/sharer/sharer.php?u=@u&title=@t&description=@d&quote=@q&hashtag=@h'
        },
        {
          network: 'messenger',
          name: 'Messenger',
          icon: 'mdi-facebook-messenger',
          color: '#0084ff',
          url: 'fb-messenger://share/?link=@u'
        },
        {
          network: 'skype',
          name: 'Skype',
          icon: 'mdi-skype',
          color: '#00aff0'
        },
        {
          network: 'sms',
          name: 'SMS',
          icon: 'mdi-message-outline',
          color: '#333333',
          url: 'sms:&body=@t%0D%0A@u%0D%0A@d'
        },
        {
          network: 'twitter',
          name: 'Twitter',
          icon: 'mdi-twitter',
          color: '#1da1f2',
          url: 'https://twitter.com/intent/tweet?text=@t&url=@u&hashtags=@h@tu'
        },
        {
          network: 'whatsapp',
          name: 'Whatsapp',
          icon: 'mdi-whatsapp',
          color: '#25d366',
          url: 'https://api.whatsapp.com/send?text=@t%0D%0A@u%0D%0A@d'
        }
      ]
    }
  },
  props: ['content', 'display'],
  computed: { ...mapState('event', ['ActiveEmailWin']) },
  methods: {
    cancelAction () {
      this.$store.commit('event/setActiveEmailWin')
    },
    share (selectedName) {
      let selectedNetwork = this.networks.find(
        (element) => element.name === selectedName
      )
      let url = this.shareLink(selectedNetwork.url)
      window.open(url, '_blank')
    },
    shareLink (link) {
      /**
       * Twitter sharing shouldn't include empty parameter
       * Source: https://github.com/nicolasbeauvais/vue-social-sharing/issues/143
       */
      if (this.key === 'twitter') {
        if (!this.hashtags.length) link = link.replace('&hashtags=@h', '')
        if (!this.twitterUser.length) link = link.replace('@tu', '')
      }

      return link
        .replace(/@tu/g, '&via=' + encodeURIComponent('sortietoulouse'))
        .replace(
          /@u/g,
          encodeURIComponent(
            'https://akilys-dev.web.app//network/' +
              this.content.id +
              '/planningid/' +
              this.content.planningId
          )
        )
        .replace(/@t/g, encodeURIComponent(this.content.nom))
        .replace(
          /@d/g,
          encodeURIComponent(
            'le ' +
              this.content.debut +
              'description ' +
              this.content.description
          )
        )
        .replace(/@q/g, encodeURIComponent(this.conte))
        .replace(/@h/g, 'sortieToulouse')
        .replace(/@m/g, encodeURIComponent('http://www.sortietoulouse.fr'))
    }
  }
}
</script>

<style></style>

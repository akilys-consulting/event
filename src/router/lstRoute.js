import login from '@/components/connexion/login'
import signUp from '@/components/connexion/SignUp'
import listEvent from '@/components/client/ListEvent'
import detailEvent from '@/components/client/DetailEvent'
import calendrier from '@/components/event/CalendrierEvent'
import formevent from '@/components/event/FormEvent'
import profilForm from '@/components/connexion/ProfilForm'

export const routes = [
  {
    path: '/',
    name: 'listEvent',
    component: listEvent
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/profil',
    name: 'voirProfil',
    component: profilForm
  },
  {
    path: '/creation',
    name: 'creation',
    component: signUp
  },

  {
    path: '/detailEvent',
    name: 'clientdetailEvent',
    component: detailEvent
  },

  {
    path: '/calendrier',
    name: 'calendrier',
    component: calendrier
  },

  {
    path: '/formevent',
    name: 'formEvent',
    component: formevent
  }
]

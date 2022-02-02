import login from '@/components/connexion/login'
import signUp from '@/components/connexion/SignUp'
import listEvent from '@/components/client/ListEvent'
import detailEvent from '@/components/client/DetailEvent'
import calendrier from '@/components/event/CalendrierEvent'
import formevent from '@/components/event/FormEvent'
import profilForm from '@/components/connexion/ProfilForm'
import importEvent from '@/components/event/ImportEvent'
import presentation from '@/components/client/Accueil'

export const routes = [
  {
    path: '/',
    name: 'presentation',
    component: listEvent
  },
  {
    path: '/events',
    name: 'listEvent',
    component: listEvent
  },
  {
    path: '/login',
    name: 'login',
    component: login
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
    path: '/network/:eventId/planning/:planningId',
    name: 'detailEventNetwork',
    component: detailEvent
  },
  {
    path: '/profil',
    name: 'voirProfil',
    component: profilForm
  },
  {
    path: '/importEvent',
    name: 'importEvent',
    component: importEvent,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/calendrier',
    name: 'calendrier',
    component: calendrier,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/formevent',
    name: 'formEvent',
    component: formevent,
    meta: {
      requiresAuth: true
    }
  }
]

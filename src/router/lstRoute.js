import login from '@/components/connexion/login'
import signUp from '@/components/connexion/SignUp'
import listEvent from '@/components/client/ListEvent'
import detailEvent from '@/components/client/DetailEvent'
import calendrier from '@/components/event/CalendrierEvent'
import formevent from '@/components/event/FormEvent'
import profilForm from '@/components/connexion/ProfilForm'
import designPlan from '@/components/plan/Design'
import selectPlan from '@/components/plan/SelectPlan'
import planform from '@/components/plan/FormPlan'
import importEvent from '@/components/event/ImportEvent'

export const routes = [
  {
    path: '/',
    name: 'listEvent',
    component: listEvent
  },
  {
    path: '/importEvent',
    name: 'importEvent',
    component: importEvent
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
    component: calendrier,
    meta: {
      requiresAuth: true
    }
  },

  {
    path: '/formevent',
    name: 'formEvent',
    component: formevent
  },
  {
    path: '/plandesign',
    name: 'plandesign',
    component: designPlan,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/selectplan',
    name: 'selectPlan',
    component: selectPlan,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/planForm',
    name: 'planForm',
    component: planform,
    meta: {
      requiresAuth: true
    }
  }
]

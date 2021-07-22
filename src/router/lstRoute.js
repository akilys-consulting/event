import login from '@/components/users/login'
import listEvent from '@/components/client/ListEvent'
import detailEvent from '@/components/client/DetailEvent'
import calendrier from '@/components/event/CalendrierEvent'
import formevent from '@/components/event/FormEvent'

export default [
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




import listEvent from '@/components/client/ListEvent'
import detailEvent from '@/components/client/DetailEvent'
import login from '@/components/users/login'

export default [
  {
    path: '/', name: 'listEvent',
    component: listEvent
  },
  {
    path: '/', name: 'login',
    component: login
  },

  {
    path: '/detailEvent',
    name: 'clientdetailEvent',
    component: detailEvent
  },




]

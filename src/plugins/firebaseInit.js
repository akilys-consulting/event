import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/storage'

// firebase init goes here

const config = {
  apiKey: 'AIzaSyDzEN6chBjGEi5b6DlcNqQpTItZw9l0zLA',
  authDomain: 'akilys-dev.firebaseapp.com',
  databaseURL: 'https://akilys-dev.firebaseio.com',
  projectId: 'akilys-dev',
  storageBucket: 'akilys-dev.appspot.com',
  messagingSenderId: '249987798838',
  appId: '1:249987798838:web:33c1c3d195843c1de70597',
  measurementId: 'G-NYLWNCZ3XN'
}

const errorCode = [
  {
    code: 'EMAILEXIST',
    errorCode: 'auth/email-already-in-use'
  }
]

!firebase.apps.length ? firebase.initializeApp(config) : ''

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const authObj = firebase.auth
const file = firebase.storage()
const storage = firebase.app().storage('gs://akilys-dev.appspot.com')

const currentUser = auth.currentUser

// firebase collections
const profilCollection = db.collection('profil')
const eventCollection = db.collection('event')

export const fb = {
  db,
  auth,
  authObj,
  file,
  storage,
  currentUser,
  profilCollection,
  eventCollection,
  errorCode
}

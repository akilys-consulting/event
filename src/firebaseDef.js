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
firebase.initializeApp(config)

// firebase utils
const db = firebase.firestore()
const auth = firebase.auth()
const file = firebase.storage()
const storage = firebase.app().storage('gs://akilys-dev.appspot.com')

const currentUser = auth.currentUser

// firebase collections
const clientCollection = db.collection('client')
const planCollection = db.collection('plan')
const eventCollection = db.collection('event')
const standCollection = db.collection('stand')
const cmdCollection = db.collection('commande')
const banqueEmplacementCollection = db.collection('emplacement')

// const postsCollection = db.collection('posts')
// const commentsCollection = db.collection('comments')
// const likesCollection = db.collection('likes')

export const fb = {
  db,
  auth,
  file,
  storage,
  currentUser,
  clientCollection,
  planCollection,
  eventCollection,
  standCollection,
  cmdCollection,
  banqueEmplacementCollection
}

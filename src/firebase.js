import Firebase from 'firebase'

Firebase.initializeApp({
  apiKey: 'AIzaSyBj-oXS2n_jnrTg6Hzj9eD4CFYGDXLVZQg',
  authDomain: 'entries.firebaseapp.com',
  databaseURL: 'https://entries.firebaseio.com',
  storageBucket: 'project-164560165500119978.appspot.com',
})

export const database = Firebase.database()

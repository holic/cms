import Firebase from 'firebase'

// TODO: set up security rules, can use `now` to validate `ServerValue.TIMESTAMP`
// https://github.com/webhook/webhook-server-open/blob/master/security.json

Firebase.initializeApp({
  apiKey: 'AIzaSyBj-oXS2n_jnrTg6Hzj9eD4CFYGDXLVZQg',
  authDomain: 'entries.firebaseapp.com',
  databaseURL: 'https://entries.firebaseio.com',
  storageBucket: 'project-164560165500119978.appspot.com',
})

export const auth = Firebase.auth()
export const database = Firebase.database()
export const storage = Firebase.storage()

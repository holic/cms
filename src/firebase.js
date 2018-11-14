import Firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

// TODO: set up security rules, can use `now` to validate `ServerValue.TIMESTAMP`
// https://github.com/webhook/webhook-server-open/blob/master/security.json

export const app = Firebase.initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

export const auth = Firebase.auth();
export const database = Firebase.database();
export const storage = Firebase.storage();

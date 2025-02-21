// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDrodjGfJiGdcaxma16IUhHaBAguN4ZOJ4",
  authDomain: "chess-review-dffb1.firebaseapp.com",
  projectId: "chess-review-dffb1",
  storageBucket: "chess-review-dffb1.firebasestorage.app",
  messagingSenderId: "353960066311",
  appId: "1:353960066311:web:31151e36b243c317a499a2",
  measurementId: "G-QVC8XW5XRB",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { analytics, app, auth, db, provider };
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAyErYOU1dSQ1DNygQoGTF6gRNCq-Ne1wk",
  authDomain: "healthy-teen-cec6c.firebaseapp.com",
  projectId: "healthy-teen-cec6c",
  storageBucket: "healthy-teen-cec6c.firebasestorage.app",
  messagingSenderId: "53156353248",
  appId: "1:53156353248:web:4dc33444f70d07c3202c85"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
// firebase.js (for Firebase v9 and above)
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDV0a4jpMK82Gsmed_61L1VEJJsDNjOtPs",
    authDomain: "surveilliance-website.firebaseapp.com",
    projectId: "surveilliance-website",
    storageBucket: "surveilliance-website.firebasestorage.app",
    messagingSenderId: "185241880517",
    appId: "1:185241880517:web:c72e1503612d652037edac",
    measurementId: "G-8G82JQ9RZ2"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };

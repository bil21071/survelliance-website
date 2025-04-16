import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyDV0a4jpMK82Gsmed_61L1VEJJsDNjOtPs",
  authDomain: "surveilliance-website.firebaseapp.com",
  databaseURL: "https://surveilliance-website-default-rtdb.firebaseio.com",
  projectId: "surveilliance-website",
  storageBucket: "surveilliance-website.firebasestorage.app",
  messagingSenderId: "185241880517",
  appId: "1:185241880517:web:c72e1503612d652037edac",
  measurementId: "G-8G82JQ9RZ2"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
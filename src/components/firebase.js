// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database"; // Realtime Database
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7yuM8mkmCRATvhKyAeWQbsH3rFDBHMFU",
  authDomain: "rveilx.firebaseapp.com",
  databaseURL: "https://rveilx-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rveilx",
  storageBucket: "rveilx.firebasestorage.app",
  messagingSenderId: "968434901886",
  appId: "1:968434901886:web:ce2a9ae3dacff15037892f",
  measurementId: "G-NBM5DBCYGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
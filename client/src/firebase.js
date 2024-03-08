// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "dr-estate.firebaseapp.com",
  projectId: "dr-estate",
  storageBucket: "dr-estate.appspot.com",
  messagingSenderId: "492745425316",
  appId: "1:492745425316:web:b27fc7c290ca0eaa610131"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
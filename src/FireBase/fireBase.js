
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBwALzgqY2c3YJGNwCj7yq6GwJTFoXqCvA",
  authDomain: "readhaven-3029b.firebaseapp.com",
  projectId: "readhaven-3029b",
  storageBucket: "readhaven-3029b.firebasestorage.app",
  messagingSenderId: "1056823511374",
  appId: "1:1056823511374:web:b353e52717f8e8f52b361f",
  measurementId: "G-JKQ34CNBLH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
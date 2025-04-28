
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAhgCocex8N0hUezpcI-Ki6-KWwJiRMSzY",
  authDomain: "diamond-hunt-ba564.firebaseapp.com",
  projectId: "diamond-hunt-ba564",
  storageBucket: "diamond-hunt-ba564.firebasestorage.app",
  messagingSenderId: "686873155214",
  appId: "1:686873155214:web:0883cdcf7c9cdbe0cddbdf",
  measurementId: "G-2BGPXFWVWG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

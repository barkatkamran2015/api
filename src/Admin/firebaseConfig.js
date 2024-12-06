// firebaseConfig.js (Firebase 9+)
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB3jVr_FwaTEd8rNFcygZhP-b7GLEzPvWg",
  authDomain: "classymama-9dd2e.firebaseapp.com",
  projectId: "classymama-9dd2e",
  storageBucket: "classymama-9dd2e.firebasestorage.app",
  messagingSenderId: "418035074616",
  appId: "1:418035074616:web:f0bc8f0125264cb2c988cd",
  measurementId: "G-CHBMLM101P"
};

const app = initializeApp(firebaseConfig);

// Export auth, firestore, and storage
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;

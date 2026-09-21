import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDa7IO5BRzjNOEUMtAa1aQCgMTVacYYL7k",
  authDomain: "cloud-digital-evidence.firebaseapp.com",
  projectId: "cloud-digital-evidence",
  storageBucket: "cloud-digital-evidence.firebasestorage.app",
  messagingSenderId: "492994130048",
  appId: "1:492994130048:web:e764759b31f5acad81b665"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
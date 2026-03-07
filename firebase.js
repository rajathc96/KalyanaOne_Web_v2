import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqGgjzkxh1vDTad413FXWy2w5TFxuGiPo",
  authDomain: "kalyanaone.firebaseapp.com",
  projectId: "kalyanaone",
  storageBucket: "kalyanaone.firebasestorage.app",
  messagingSenderId: "288600468838",
  appId: "1:288600468838:web:bfd108c7f528e7f6fa2ca7",
  measurementId: "G-3QZ5GDGESY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const clientAuth = getAuth(app);
const storage = getStorage(app);

export { clientAuth, db, storage };


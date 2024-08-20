import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDLfRVgjXeayd9SOtZAzyc0w0gkaMrpQ5A",
  authDomain: "nwitter-reloaded-51a15.firebaseapp.com",
  projectId: "nwitter-reloaded-51a15",
  storageBucket: "nwitter-reloaded-51a15.appspot.com",
  messagingSenderId: "499884381655",
  appId: "1:499884381655:web:00f76ea9c5f346b789a792"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAW6nwiM-yT1A6M99vyzaCNso1aBbSyoTs",
  authDomain: "dango-de20b.firebaseapp.com",
  projectId: "dango-de20b",
  storageBucket: "dango-de20b.appspot.com",
  messagingSenderId: "315289188301",
  appId: "1:315289188301:web:cd4b33bef7a3c1f21cf684",
  measurementId: "G-YYTDN33WWL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, auth, storage };

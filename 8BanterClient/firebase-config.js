// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVwLV4vV69_PPrd5JK2L6Io8xUt2FjSXg",
  authDomain: "banter-memes.firebaseapp.com",
  projectId: "banter-memes",
  storageBucket: "banter-memes.appspot.com",
  messagingSenderId: "139212492426",
  appId: "1:139212492426:web:35fc7de01215c5806ae773",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

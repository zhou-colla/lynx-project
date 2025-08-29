// Import the functions you need from the SDKs you need
// firebase.ts
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get, child } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASE4J0dsBumvbt2ateuJ3N2jo6LKpvq0Q",
  authDomain: "lynx-project-4d8bc.firebaseapp.com",
  databaseURL: "https://lynx-project-4d8bc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lynx-project-4d8bc",
  storageBucket: "lynx-project-4d8bc.firebasestorage.app",
  messagingSenderId: "576766988756",
  appId: "1:576766988756:web:f07f362ea03a4c48f9c641",
  measurementId: "G-QK7KBGPGSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
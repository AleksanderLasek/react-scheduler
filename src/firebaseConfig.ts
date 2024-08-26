// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhNamRUnQv7x8228fH9j9IbrW79M69Wb8",
  authDomain: "react-scheduler-7eac6.firebaseapp.com",
  projectId: "react-scheduler-7eac6",
  storageBucket: "react-scheduler-7eac6.appspot.com",
  messagingSenderId: "449541251583",
  appId: "1:449541251583:web:40100e59ebd89c461d47ca",
  measurementId: "G-5SC989B9E7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };

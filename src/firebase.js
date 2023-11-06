// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth  } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3Bjf3jr446jn4gkZg_H_eo7f3UINSubc",
  authDomain: "fitbit-api-403117.firebaseapp.com",
  projectId: "fitbit-api-403117",
  storageBucket: "fitbit-api-403117.appspot.com",
  messagingSenderId: "965476647928",
  appId: "1:965476647928:web:f1be80bedf51fee6740c0d",
  measurementId: "G-9YN8N8FNZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;
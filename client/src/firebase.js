// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "swagatom-test-ed0a4.firebaseapp.com",
  projectId: "swagatom-test-ed0a4",
  storageBucket: "swagatom-test-ed0a4.firebasestorage.app",
  messagingSenderId: "270621610169",
  appId: "1:270621610169:web:6f6b1c1091daecf343cb68",
  measurementId: "G-54VWM40FXT"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
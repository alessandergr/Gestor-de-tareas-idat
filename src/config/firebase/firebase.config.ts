import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-57YkBqYLpWIm0awuZnR51vQbOBATU70",
  authDomain: "gestor-tareas-idat.firebaseapp.com",
  projectId: "gestor-tareas-idat",
  storageBucket: "gestor-tareas-idat.firebasestorage.app",
  messagingSenderId: "127944042779",
  appId: "1:127944042779:web:f2672779df92e590c14bbe",
};

const firebaseApp =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

export const firebaseAuth = getAuth(firebaseApp);
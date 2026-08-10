import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp, } from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import type { Auth, Persistence, } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Datos para conectar la app con nuestro proyecto de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-57YkBqYLpWIm0awuZnR51vQbOBATU70",
  authDomain: "gestor-tareas-idat.firebaseapp.com",
  projectId: "gestor-tareas-idat",
  storageBucket:
    "gestor-tareas-idat.firebasestorage.app",
  messagingSenderId: "127944042779",
  appId:
    "1:127944042779:web:f2672779df92e590c14bbe",
};

// Evita crear Firebase más de una vez
const firebaseApp =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

type FirebaseAuthNative =
  typeof FirebaseAuth & {
    getReactNativePersistence: (
      storage: typeof AsyncStorage,
    ) => Persistence;
  };

const firebaseAuthNative =
  FirebaseAuth as FirebaseAuthNative;

// Mantiene la sesión iniciada aunque se cierre la app
const initializeFirebaseAuth = (): Auth => {
  try {
    return FirebaseAuth.initializeAuth(
      firebaseApp,
      {
        persistence:
          firebaseAuthNative.getReactNativePersistence(
            AsyncStorage,
          ),
      },
    );
  } catch {
    return FirebaseAuth.getAuth(firebaseApp);
  }
};

export const firebaseAuth =
  initializeFirebaseAuth();

// Base de datos de Firestore
export const firebaseDb =
  getFirestore(firebaseApp);
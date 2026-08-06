import AsyncStorage from
  "@react-native-async-storage/async-storage";
import {
  getApp,
  getApps,
  initializeApp,
} from "firebase/app";
import * as FirebaseAuth from "firebase/auth";
import type {
  Auth,
  Persistence,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

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

const initializeFirebaseAuth = (): Auth => {
  try {
    return FirebaseAuth.initializeAuth(
      firebaseApp,
      {
        persistence:
          firebaseAuthNative
            .getReactNativePersistence(
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

export const firebaseDb =
  getFirestore(firebaseApp);
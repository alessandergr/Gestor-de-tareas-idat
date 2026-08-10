import {doc,getDoc,serverTimestamp,setDoc,} from "firebase/firestore";

import { firebaseDb } from "@/config/firebase/firebase.config";

export type UserGender = "Masculino" | "Femenino" | "Otro";

export interface UserProfileData {
  uid: string;
  firstName: string;
  lastName: string;
  gender: UserGender;
  email: string;
  photoUrl?: string;
}

// Guarda los datos del usuario cuando crea su cuenta
export const saveUserProfile = async (
  profile: UserProfileData,
): Promise<void> => {
  const userRef = doc(firebaseDb, "users", profile.uid);

  await setDoc(
    userRef,
    {
      firstName: profile.firstName,
      lastName: profile.lastName,
      gender: profile.gender,
      email: profile.email,
      photoUrl: profile.photoUrl ?? "",
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};

// Lee los datos guardados del usuario actual
export const getUserProfile = async (
  uid: string,
): Promise<UserProfileData | null> => {
  const userRef = doc(firebaseDb, "users", uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  const data = snapshot.data();

  return {
    uid,
    firstName: data.firstName ?? "",
    lastName: data.lastName ?? "",
    gender: data.gender ?? "Otro",
    email: data.email ?? "",
    photoUrl: data.photoUrl ?? "",
  };
};

// setDoc con merge también funciona si la cuenta antigua todavía no tiene perfil
export const updateUserPhoto = async (
  uid: string,
  photoUrl: string,
): Promise<void> => {
  const userRef = doc(firebaseDb, "users", uid);

  await setDoc(
    userRef,
    {
      photoUrl,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
};
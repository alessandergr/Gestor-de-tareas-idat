import { Redirect } from "expo-router";

import { firebaseAuth } from "@/config/firebase/firebase.config";

export default function Index() {
  // Revisamos si ya existe una sesión iniciada
  const user = firebaseAuth.currentUser;

  // Con sesión va a tareas, sin sesión va al login
  return (
    <Redirect
      href={user ? "/tasks" : "/login"}
    />
  );
}
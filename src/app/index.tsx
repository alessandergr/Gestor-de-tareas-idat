import { Redirect } from "expo-router";

import { firebaseAuth } from "@/config/firebase/firebase.config";

export default function Index() {
  const user = firebaseAuth.currentUser;

  return (
    <Redirect
      href={user ? "/products" : "/login"}
    />
  );
}
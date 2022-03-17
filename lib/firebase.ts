// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
} from "firebase/auth";

import { useState, useEffect } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5yY8odWKLfi53qzc77YxL7FLmQAZAJRc",
  authDomain: "hash-emblem.firebaseapp.com",
  projectId: "hash-emblem",
  storageBucket: "hash-emblem.appspot.com",
  messagingSenderId: "322508123316",
  appId: "1:322508123316:web:d43ba8e88fdb9016413be1",
  measurementId: "G-ZWVQYW4W4L",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export type FirebaseUser = {
  uid: string;
  email: string;
};

const formatAuthUser = (user: FirebaseUser) => ({
  uid: user.uid,
  email: user.email,
});

function useFirebaseAuth() {
  const [authUser, setAuthUser] = useState<FirebaseUser>({
    uid: "",
    email: "",
  });
  const [loading, setLoading] = useState<boolean>(true);

  const signInWithPassword = (email: string, password: string) => {
    signInWithEmailAndPassword(getAuth(app), email, password);
  };

  const createUserWithPassword = async (
    email: string,
    password: string
  ): Promise<UserCredential> => {
    const createdUser = await createUserWithEmailAndPassword(
      getAuth(app),
      email,
      password
    );
    return createdUser;
  };

  const signOut = () => getAuth(app).signOut();

  const authStateChanged = async (authState: any) => {
    if (!authState) {
      setAuthUser({ uid: "", email: "" });
      setLoading(false);
      return;
    }

    setLoading(true);
    const formattedUser: FirebaseUser = formatAuthUser(authState);
    setAuthUser(formattedUser);
    setLoading(false);
  };

  // listen for Firebase state change
  useEffect(() => {
    const unsubscribe = getAuth(app).onAuthStateChanged(authStateChanged);
    return () => unsubscribe();
  }, []);

  return {
    authUser,
    loading,
    signInWithPassword,
    createUserWithPassword,
    signOut,
  };
}

export { app, useFirebaseAuth };

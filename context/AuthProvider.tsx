/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { FirebaseUser, useFirebaseAuth } from "../lib/firebase";

const AuthUserContext = createContext({
  authUser: { uid: "", email: "" },
  loading: false,
  signInWithPassword: (email: string, password: string) => {},
  createUserWithPassword: (email: string, password: string) => {},
  signOut: () => {},
  updateFirebaseUser: (user: FirebaseUser) => {
    console.log(user);
  },
});

export function AuthUserProvider({ children }: { children: any }) {
  const auth = useFirebaseAuth();
  const [firebaseUser, setFirebaseUser] = useState(
    auth.authUser ? auth.authUser : { uid: "", email: "" }
  );

  const updateFirebaseUser = (user: FirebaseUser) => {
    setFirebaseUser(user);
  };

  useEffect(() => {
    const usrString = window.localStorage.getItem(
      "firebase:authUser:AIzaSyB5yY8odWKLfi53qzc77YxL7FLmQAZAJRc:[DEFAULT]"
    );
    console.log("DONE");
    if (usrString) {
      const sesionUser: any = JSON.parse(usrString);
      if (sesionUser) {
        console.log(sesionUser);
        setFirebaseUser({
          uid: sesionUser.uid,
          email: sesionUser.email,
        });
      }
    } else {
      console.log("NO USER");
    }
  }, [firebaseUser.uid]);
  return (
    <AuthUserContext.Provider
      value={{
        ...auth,
        authUser: firebaseUser,
        updateFirebaseUser,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
}
// custom hook to use the authUserContext and access authUser and loading
export const useAuth = () => useContext(AuthUserContext);

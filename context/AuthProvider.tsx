/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { useFirebaseAuth } from "../lib/firebase";
import { client } from "../lib/sanity";
import { FirebaseUser } from "./utils/types";

const AuthUserContext = createContext({
  authUser: {
    firebaseId: "",
    email: "",
    alias: "",
    profileImage: "",
    hederaAccount: {
      accountId: "",
    },
    associatedCollection: false,
  },
  loading: false,
  signInWithPassword: (email: string, password: string) => {},
  createUserWithPassword: (email: string, password: string) => {},
  signOut: () => {},
  updateFirebaseUser: (user: FirebaseUser) => {},
});

export function AuthUserProvider({ children }: { children: any }) {
  const auth = useFirebaseAuth();
  const [firebaseUser, setFirebaseUser] = useState(
    auth.authUser
      ? auth.authUser
      : {
          firebaseId: "",
          email: "",
          alias: "",
          profileImage: "",
          hederaAccount: {
            accountId: "",
          },
          associatedCollection: false,
        }
  );

  const updateFirebaseUser = (user: FirebaseUser) => {
    setFirebaseUser(user);
  };

  useEffect(() => {
    const usrString = window.localStorage.getItem(
      "firebase:authUser:AIzaSyB5yY8odWKLfi53qzc77YxL7FLmQAZAJRc:[DEFAULT]"
    );

    if (usrString) {
      const sesionUser: any = JSON.parse(usrString);

      if (sesionUser) {
        const query = `
        *[_type=="account" && firebaseId=="${sesionUser.uid}"]{
          alias,
          email,
          firebaseId,
          alias,
          profileImage,
          hederaAccount
        }
        `;

        let resultUser: FirebaseUser;
        client.fetch(query).then((res) => {
          if (res) {
            resultUser = {
              firebaseId: sesionUser.uid,
              email: sesionUser.email,
              alias: res[0].alias,
              profileImage: res[0].profileImage,
              hederaAccount: res[0].hederaAccount,
              associatedCollection: res[0].assciatedCollection,
            };

            const hederaAccountQuery = `
            *[_type=="hederaAccount" && accountId=="${res[0].hederaAccount._ref}"]{
              accountId,
              topic,
              connectionId,
              network,
              privateKey,
              appMetadata
            }
            
            `;
            console.log(resultUser);
            client.fetch(hederaAccountQuery).then((res) => {
              if (res) {
                resultUser.hederaAccount = res[0];
              }
              setFirebaseUser(resultUser);
            });
          }
        });
      }
    } else {
    }
  }, [firebaseUser.firebaseId]);
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

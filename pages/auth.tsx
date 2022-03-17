import {
  browserLocalPersistence,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthProvider";

export default function Auth() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { createUserWithPassword, updateFirebaseUser, authUser } = useAuth();
  const handleShowConnectModal = () => {
    console.log("HE");
  };
  const requestCreateAccount = async () => {
    console.log("KE");

    const userCreated = await createUserWithEmailAndPassword(
      getAuth(),
      email,
      password
    );
    updateFirebaseUser({
      uid: userCreated.user.uid,
      email: userCreated.user.email ? userCreated.user.email : "",
    });
    router.push("/mint");
  };
  const requestSignIn = async () => {
    setPersistence(getAuth(), browserLocalPersistence)
      .then(async () => {
        // Existing and future Auth states are now persisted in the current
        // session only. Closing the window would clear any existing state even
        // if a user forgets to sign out.
        // ...
        // New sign-in will be persisted with session persistence.
        const userCreated = await signInWithEmailAndPassword(
          getAuth(),
          email,
          password
        );
        updateFirebaseUser({
          uid: userCreated.user.uid,
          email: userCreated.user.email ? userCreated.user.email : "",
        });
        return userCreated;
      })

      .catch((error) => {
        // Handle Errors here.
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(authUser);
    if (authUser.uid !== "") {
      console.log(authUser);
      router.push("/");
    }
  }, [authUser]);
  return (
    <div className="flex flex-col w-screen h-screen  gap-10">
      <Navbar handleShowConnectModal={() => handleShowConnectModal()} />
      <div className="w-full flex flex-col h-full items-center text-center justify-evenly">
        <div className="text-white flex flex-col items-center justify-evenly  f w-full h-full sm:w-4/5 md:w-2/3 xl:w-2/5 h-[600px] border border-gray-800 bg-gray-900 bg-opacity-40 rounded-3xl">
          <div className="w-full py-2">
            <div className="auth_title text-3xl uppercase bold">
              {isLogin ? "Sign into your Account " : "Create a new Account"}
            </div>
          </div>
          <form className="w-4/5 shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4 flex flex-col items-start">
              <div className="block text-gray-500 text-md font-bold mb-2">
                Username
              </div>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="Email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username"
              />
            </div>
            <div className="mb-6 flex flex-col items-start ">
              <div className="block text-gray-500 text-md font-bold mb-2">
                Password
              </div>
              <input
                className="shadow appearance-none border border-red-400 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="******************"
              />
              <p className="text-red-500 text-sm italic">
                Please choose a password.
              </p>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() =>
                  isLogin ? requestSignIn() : requestCreateAccount()
                }
                type="button"
              >
                {isLogin ? "Login" : "Register"}
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-orange-500  hover:text-orange-800"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          <div>
            <a
              className="inline-block align-baseline font-bold text-sm text-orange-500  hover:text-orange-800"
              href="#"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin
                ? "No Account? Create a new one using your email"
                : "Already have an account? Sign in with your email"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

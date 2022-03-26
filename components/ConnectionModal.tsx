import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import { RiCloseCircleLine } from "react-icons/ri";
import { useAuth } from "../context/AuthProvider";
import { SaveData } from "../context/utils/types";
import { client } from "../lib/sanity";

export const hashPackLoader = () => {
  return "https://lh3.googleusercontent.com/11gZzwVrl8X2eoCbag1y5_hhyUqMKxG-zfDThmczUD7TwlX6HS0207EqyKGcz-FY1ZtDrWBwtNIG5VMlp-f6jkniYQ=w128-h128-e365-rj-sc0x00ffffff";
};

export const ipfsLoader = ({ src }: { src: string }) => {
  return src;
};

type PropsType = {
  open: boolean;
  closeModal: () => void;
  walletData: SaveData;
};

function ConnectionModal(props: PropsType) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alias, setAlias] = useState("");
  const { updateFirebaseUser } = useAuth();

  //Register errors
  const [emailInUseError, setEmailinUseError] = useState(false);
  const [emailFormatError, setEmailFormatError] = useState(false);
  const [aliasError, setAliasError] = useState(false);
  const [paswordError, setPasswordError] = useState(false);

  const [emailNotExistsError, setEmailNotExistsError] = useState(false);
  const [invalidCredentialsError, setInvalidCredentialsError] = useState(false);

  const cleanState = () => {
    setEmail("");
    setPassword("");
    setAlias("");
    setEmailFormatError(false);
    setAliasError(false);
    setEmailinUseError(false);
    setPasswordError(false);
  };
  const requestCreateAccount = async () => {
    //Check username has less than 12 letters and no straneg chars
    try {
      const userCreated = await createUserWithEmailAndPassword(
        getAuth(),
        email,
        password
      );

      const doc = {
        _id: userCreated.user.uid,
        _type: "account",
        firebaseId: userCreated.user.uid,
        email: email,
        alias: alias,
        profileImage: `https://avatars.dicebear.com/api/adventurer/${alias}.svg`,
        hederaAccount: {},
        associatedCollection: false,
      };
      const createdDoc = await client.createIfNotExists(doc);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, _createdAt, _rev, _type, _updatedAt, ...restData } =
        createdDoc;
      updateFirebaseUser(restData);
      window.localStorage.setItem("firebaseId", userCreated.user.uid);
      cleanState();
      props.closeModal();
    } catch (e) {
      const error: any = e;
      if (error.code === "auth/email-already-in-use") {
        setEmailinUseError(true);
      }
    }
  };
  const requestSignIn = async () => {
    setPersistence(getAuth(), browserLocalPersistence)
      .then(async () => {
        try {
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

          const query = `
        *[_type=="account" && firebaseId=="${userCreated.user.uid}"]{
          alias,
          email,
          firebaseId,
          alias,
          profileImage,
          hederaAccount
        }
        `;

          let resultUser;
          const sanityAccount = await client.fetch(query);
          if (sanityAccount) {
            resultUser = {
              firebaseId: sanityAccount[0].firebaseId,
              email: email,
              alias: sanityAccount[0].alias,
              profileImage: sanityAccount[0].profileImg,
              hederaAccount: sanityAccount[0].hederaAccount,
              associatedCollection: sanityAccount[0].associatedCollection,
            };
            updateFirebaseUser(resultUser);
            window.localStorage.setItem(
              "firebaseId",
              sanityAccount[0].firebaseId
            );
          }
          props.closeModal();
          return userCreated;
        } catch (e) {
          const error: any = e;
          if (error.code === "auth/user-not-found") {
            setEmailNotExistsError(true);
          } else if (error.code === "auth/wrong-password") {
            setInvalidCredentialsError(true);
          }
        }
      })

      .catch((error) => {
        // Handle Errors here.
        console.log(error);
      });
  };

  const handleChangeAlias = (_alias: string) => {
    const regexTest = /^[a-zA-Z]+$/.test(_alias);

    if (_alias !== "") {
      if (regexTest) {
        setAlias(_alias.slice(0, 12));
        setAliasError(false);
      } else {
        setAlias(_alias.slice(0, 12));
        setAliasError(true);
      }
    } else {
      setAlias(_alias);
      setAliasError(false);
    }
  };

  const handleEmailChange = (_email: string) => {
    if (!isLogin) {
      const regexTest =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(
          _email
        );

      if (regexTest) {
        setEmail(_email);
        setEmailinUseError(false);
        setEmailFormatError(false);
      } else {
        setEmail(_email);
        setEmailFormatError(true);
      }
    } else {
      setEmail(_email);
    }
    setInvalidCredentialsError(false);
    setEmailNotExistsError(false);
  };

  const handlePasswordChange = (_pass: string) => {
    if (!isLogin) {
      if (_pass.length >= 8) {
        setPassword(_pass);
        setPasswordError(false);
      } else {
        setPassword(_pass);
        setPasswordError(true);
      }
    } else {
      setPassword(_pass);
    }
    setInvalidCredentialsError(false);
    setEmailNotExistsError(false);
  };

  const blankInputs = () => {
    return !isLogin
      ? password === "" || email === "" || alias === ""
      : password === "" || email === "";
  };

  return (
    <>
      {props.open && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          aria-labelledby="modal-title"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              aria-hidden="true"
            ></div>

            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>

            <div className="relative  bg-gray-900  inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-fit">
              <RiCloseCircleLine
                className="text-white text-3xl absolute right-2 top-2 cursor-pointer"
                onClick={() => props.closeModal()}
              />

              <div className="flex flex-col p-10 w-full items-center">
                <div className="w-full py-2">
                  <div className="auth_title text-3xl uppercase bold">
                    {isLogin
                      ? "Sign into your Account "
                      : "Create a new Account"}
                  </div>
                </div>
                <form className="w-4/5 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                  <div className="mb-4 flex flex-col items-start">
                    <div className="block text-gray-500 text-md font-bold mb-2">
                      Email
                    </div>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="Email"
                      value={email}
                      type="email"
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="satoshinakamoto@hashemblem.com"
                    />
                    {(emailInUseError || emailFormatError) && !isLogin && (
                      <div className=" mt-2 text-red-500">
                        {emailInUseError && "Email is already being used!"}
                        {emailFormatError && "Introduce a valid email!"}
                      </div>
                    )}
                    {emailNotExistsError && isLogin && (
                      <div className=" mt-2 text-red-500">
                        {"No account registered with that email!"}
                      </div>
                    )}
                  </div>
                  <div className="mb-6 flex flex-col items-start ">
                    <div className="block text-gray-500 text-md font-bold mb-2">
                      Password
                    </div>

                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="******************"
                    />
                    {paswordError && !isLogin && (
                      <div className=" mt-2 text-red-500">
                        {"Password must have atleast 8 characters!"}
                      </div>
                    )}
                    {invalidCredentialsError && isLogin && (
                      <div className=" mt-2 text-red-500">
                        {"Invalid credentials!"}
                      </div>
                    )}
                  </div>
                  {!isLogin && (
                    <div className="mb-4 flex flex-col items-start">
                      <div className="block text-gray-500 text-md font-bold mb-2">
                        Select a cool Alias
                      </div>
                      <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="username"
                        value={alias}
                        type="text"
                        onChange={(e) => handleChangeAlias(e.target.value)}
                        placeholder="StshiNkmoto"
                      />
                      {aliasError && !isLogin && (
                        <div className=" mt-2 text-red-500">
                          {aliasError &&
                            "Alias can't contain special characters"}
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex gap-2 flex-col md:flex-row items-center justify-between">
                    <button
                      disabled={aliasError}
                      className={`text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                        isLogin
                          ? invalidCredentialsError ||
                            emailNotExistsError ||
                            blankInputs()
                            ? "bg-gray-600 cursor-not-allowed"
                            : "bg-orange-700 hover:bg-orange-800"
                          : aliasError ||
                            emailFormatError ||
                            paswordError ||
                            blankInputs()
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-orange-700 hover:bg-orange-800"
                      }`}
                      onClick={() =>
                        isLogin
                          ? !invalidCredentialsError &&
                            !emailNotExistsError &&
                            requestSignIn()
                          : !aliasError &&
                            !emailInUseError &&
                            !emailFormatError &&
                            !blankInputs() &&
                            requestCreateAccount()
                      }
                      type="button"
                    >
                      {isLogin ? "Log in" : "Register"}
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
        </div>
      )}
    </>
  );
}

export default ConnectionModal;

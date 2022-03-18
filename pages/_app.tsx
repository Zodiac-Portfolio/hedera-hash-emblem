import "../styles/globals.css";
import type { AppProps } from "next/app";
import HashConnectProvider from "../context/HashConnectAPIProvider";
import { HashConnect } from "hashconnect";
const hashConnect = new HashConnect();
import { AuthUserProvider } from "../context/AuthProvider";
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthUserProvider>
      <HashConnectProvider hashConnect={hashConnect} netWork={"testnet"} debug>
        <Component {...pageProps} />
      </HashConnectProvider>
    </AuthUserProvider>
  );
}

export default MyApp;

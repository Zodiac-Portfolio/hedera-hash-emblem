import "../styles/globals.css";
import type { AppProps } from "next/app";
import HashConnectProvider from "../context/HashConnectAPIProvider";
import { HashConnect } from "hashconnect";
const hashConnect = new HashConnect(true);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <HashConnectProvider hashConnect={hashConnect} netWork={"testnet"} debug>
      <Component {...pageProps} />
    </HashConnectProvider>
  );
}

export default MyApp;

import "../styles/globals.css";
import type { AppProps } from "next/app";
import HashConnectProvider from "../context/HashConnectAPIProvider";
import { HashConnect } from "hashconnect";
import { AuthUserProvider } from "../context/AuthProvider";
import Head from "next/head";

const hashConnect = new HashConnect(true);

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Hash Emblem - An Hedera NFT ecosystem</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthUserProvider>
        <HashConnectProvider
          hashConnect={hashConnect}
          netWork={"testnet"}
          debug
        >
          <Component {...pageProps} />
        </HashConnectProvider>
      </AuthUserProvider>
    </>
  );
}

export default MyApp;

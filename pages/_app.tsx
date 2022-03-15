import "tailwindcss/tailwind.css";
import "../styles/HighlightPop.css";

import Head from "next/head";

import Header from "../components/legacy/header";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>My awesome blog</title>
      </Head>

      <Header />

      <main className="py-14">
        <Component {...pageProps} />
      </main>
    </>
  );
}

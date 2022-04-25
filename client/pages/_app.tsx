import type { AppProps } from "next/app";

import Layout from "../components/Layout";

import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.scss";

function App({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default App;

import type { AppProps } from "next/app";

import Layout from "../components/Layout";
import { AuthProvider } from "../context/user-context";

import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.scss";

const MyApp = ({ Component, pageProps }: AppProps) => {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
};

export default MyApp;

import type { AppProps, AppContext } from "next/app";
import { NextPage } from "next";

import { Layout } from "../components";

import "bootstrap/dist/css/bootstrap.css";
import "../styles/globals.scss";
import buildClient from "../api/build-client";

interface MyAppProps extends AppProps {
  pathname: string;
}

const MyApp = ({ Component, pageProps, pathname }: MyAppProps) => {
  return (
    <Layout pathname={pathname}>
      <Component {...pageProps} />
    </Layout>
  );
};

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { pathname } = appContext.ctx;

  return {
    pathname,
  };
};

export default MyApp;

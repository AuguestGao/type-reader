import type { AppProps } from "next/app";
import { BGP, Layout } from "../components";
import { useRouter } from "next/router";

import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import "../styles/globals.scss";
import { AuthProvider } from "../context/user-context";

const MyApp = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  return (
    <AuthProvider>
      <Layout pathname={router.pathname}>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
};

// MyApp.getInitialProps = async (appContext: AppContext) => {
//   const { ctx, Component } = appContext

//   const client = buildClient(ctx)
//   const { data } = await client.get('/api/users/currentuser');

//   if (Component.getServerSideProps)

//   return {
//     pathname: ctx.pathname,
//   };
// };

export default MyApp;

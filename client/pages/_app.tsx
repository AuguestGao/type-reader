import type { AppProps } from "next/app";
import { Layout } from "../components";
import { useRouter } from "next/router";

import "bootstrap/dist/css/bootstrap.css";
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

export default MyApp;

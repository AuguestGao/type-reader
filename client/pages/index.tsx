import type { GetServerSideProps } from "next";
import { AxiosRequestHeaders } from "axios";

import buildClient from "../api/build-client";
import { ButtonLink } from "../components";
import { useAuth } from "../context/user-context";

import styles from "../styles/Home.module.scss";
import { getCurrentUser } from "../api/get-current-user";
import { useEffect } from "react";

const Home = ({ currentUser }: { currentUser: string }) => {
  const { setCurrentUser } = useAuth();
  useEffect(() => {
    setCurrentUser!(currentUser);
  }, []);

  return (
    <div className={styles.main}>
      <h1 className={styles.logo}>
        Ty<span className={styles.flickerSlow}>p</span>e Rea
        <span className={styles.flickerFast}>d</span>er
      </h1>
      <p className={styles.subtitle}>
        Pratise touch typing with your favourite books.
      </p>
      <div className={styles.buttons}>
        {currentUser ? (
          <>
            <p className="text-center fs-3 text-white">
              Welcome back, {currentUser}
            </p>

            <ButtonLink dest="/books" label="to Books" />
            <ButtonLink
              dest="/statistics"
              label="see Stats"
              isOutlined={true}
            />
          </>
        ) : (
          <>
            <ButtonLink dest="/demo" label="Try Demo" isOutlined={true} />
            <ButtonLink dest="/auth/signup" label="Register" />
            <ButtonLink dest="/auth/signin" label="Sign in" isOutlined={true} />
          </>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers as AxiosRequestHeaders;
  const client = buildClient(headers);

  const currentUser = await getCurrentUser(client);

  return {
    props: {
      currentUser: !!currentUser ? currentUser.displayName : "",
    },
  };
};

export default Home;

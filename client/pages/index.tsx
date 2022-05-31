import type { GetServerSideProps } from "next";
import { useEffect } from "react";
import { AxiosRequestHeaders } from "axios";

import { useAuth } from "../context/user-context";
import buildClient from "../api/build-client";
import { CurrentUser } from "../types";

import styles from "../styles/Home.module.scss";

const Home = ({ user }: { user: CurrentUser }) => {
  const { currentUser, setCurrentUser } = useAuth();

  useEffect(() => {
    setCurrentUser(user);
  }, []);

  return (
    <>
      <h1 className={styles.colored}>Type Reader!</h1>{" "}
      <h2 className={styles.colored}>Make touch typing practices fun!</h2>
      {currentUser ? <h1>signed in</h1> : <h1>NOT signed in</h1>}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers = context.req.headers as AxiosRequestHeaders;
  const client = buildClient(headers);

  try {
    const { data } = await client.get("/api/users/currentuser");
    return {
      props: {
        user: data.currentUser as CurrentUser,
      },
    };
  } catch (err) {
    // ! delete before deploy
    console.log(err);
  }

  return {
    props: {
      user: null,
    },
  };
};

export default Home;

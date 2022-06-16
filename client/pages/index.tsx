import type { GetServerSideProps } from "next";
import { useEffect } from "react";
import { AxiosRequestHeaders } from "axios";
import Cookies from "js-cookie";

import { useAuth } from "../context/user-context";
import buildClient from "../api/build-client";
import bgSource from "../public/images/henry-be--Pg63JThyCg-unsplash.jpg";
import { BGP } from "../components";

import styles from "../styles/Home.module.scss";

const Home = ({ user }: { user: string }) => {
  // const { currentUser, setCurrentUser } = useAuth();

  // useEffect(() => {
  //   setCurrentUser!(user);
  // });

  return (
    <div className={styles.main}>
      <h1 className={styles.colored}>Type Reader!</h1>{" "}
      <h2 className={styles.colored}>Make touch typing practices fun!</h2>
      {/* {currentUser ? <h1>signed in</h1> : <h1>NOT signed in</h1>} */}
      {/* <BGP color="home" /> */}
    </div>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const headers = context.req.headers as AxiosRequestHeaders;
//   const client = buildClient(headers);

//   try {
//     const { data } = await client.get("/api/users/currentuser");

//     return {
//       props: {
//         user: data.currentUser?.displayName as string,
//       },
//     };
//   } catch (err) {
//     // ! delete before deploy
//     console.log(err);

//     return {
//       props: {
//         user: "",
//       },
//     };
//   }
// };

export default Home;

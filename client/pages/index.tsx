import type { NextPage } from "next";
import Link from "next/link";
// import Layout from "../components/Layout";
import styles from "../styles/Home.module.scss";

const Home: NextPage = () => {
  return (
    <>
      <h1 className={styles.colored}>Type Reader!</h1>{" "}
      <h2 className={styles.colored}>Make touch typing practices fun!</h2>
      <div className={styles.coloredLink}>
        <Link href="/auth/signup">sign up</Link>
        {"  "}
        <Link href="/auth/signin">sign in</Link>
      </div>
    </>
  );
};

export default Home;

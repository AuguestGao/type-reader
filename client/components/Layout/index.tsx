import { ReactNode, useEffect, useState } from "react";
import Head from "next/head";

import { BGP, Header, Footer } from "../";

import styles from "./styles.module.scss";

type LayoutProps = {
  children: ReactNode;
  pathname: string;
  subtitle?: string;
};

export const Layout = ({ children, pathname, subtitle = "" }: LayoutProps) => {
  const isHome = pathname === "/";

  return (
    <main className={styles.main}>
      <Head>
        <title>Type Reader{subtitle && ` | ${subtitle}`}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <BGP bgpName={isHome ? "home" : "texturedDarkGrayWall"} />

      {!isHome ? (
        <div className={styles.header}>
          <Header />
        </div>
      ) : (
        ""
      )}

      <div className={styles.content}>{children}</div>
      <div className={styles.footer}>
        <Footer />
      </div>
    </main>
  );
};

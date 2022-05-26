import React, { ReactNode } from "react";
import Head from "next/head";

import { BGP, Header } from "../";

import styles from "./styles.module.scss";

type LayoutProps = {
  children: ReactNode;
  title?: string;
};

export const Layout = ({ children, title = "Type Reader" }: LayoutProps) => (
  <div className={styles.main}>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <BGP />
    <Header />
    {children}
  </div>
);

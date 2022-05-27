import React, { ReactNode } from "react";

import styles from "./styles.module.scss";

export const Typable = ({ children }: { children: ReactNode }) => (
  <article className={styles.main}>{children}</article>
);

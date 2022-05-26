import React, { ReactNode } from "react";

import styles from "./styles.module.scss";

export const Textile = ({ children }: { children: ReactNode }) => (
  <div className={styles.textile}>{children}</div>
);

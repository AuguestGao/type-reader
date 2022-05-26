import React, { ReactNode } from "react";

import styles from "./styles.module.scss";

export const Typable = ({ children }: { children: ReactNode }) => (
  <pre className={styles.main}>{children}</pre>
);

import React, { ReactNode } from "react";

import styles from "./styles.module.scss";

const Textile = ({ children }: { children: ReactNode }) => (
  <div className={styles.textile}>{children}</div>
);

export default Textile;

import React, { ReactNode } from "react";

import styles from "./styles.module.scss";

const Typable = ({ children }: { children: ReactNode }) => (
  <pre className={styles.main}>{children}</pre>
);

export default Typable;

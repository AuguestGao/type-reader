import { ReactNode } from "react";
import styles from "./styles.module.scss";

export const Paragraph = ({ children }: { children: ReactNode }) => {
  return <section className={styles.main}>{children}</section>;
};

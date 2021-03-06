import { FormEvent, ReactNode } from "react";

import styles from "./styles.module.scss";

type SignFormProps = {
  title: string;
  onSubmit(e: FormEvent<HTMLFormElement>): any;
  children: ReactNode;
};

export const SignForm = ({ children, title, onSubmit }: SignFormProps) => (
  <div className={styles.main}>
    <form className={styles.form} onSubmit={onSubmit}>
      <h1>{title}</h1>
      {children}
    </form>
  </div>
);

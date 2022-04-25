import React, { FormEvent, ReactNode } from "react";
import styles from "./styles.module.scss";

type SignFormProps = {
  title: string;
  onSubmit(e: FormEvent<HTMLFormElement>): any;
  children: ReactNode;
};

const SignForm = ({ children, title, onSubmit }: SignFormProps) => (
  <div className={styles.position}>
    <form className={styles.form} onSubmit={onSubmit}>
      <h1>{title.toUpperCase()}</h1>
      {children}
    </form>
  </div>
);

export default SignForm;

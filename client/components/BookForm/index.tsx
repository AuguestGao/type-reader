import React, { FormEvent, ReactNode } from "react";

import styles from "./styles.module.scss";

type BookFormProps = {
  onSubmit(e: FormEvent<HTMLFormElement>): any;
  children: ReactNode;
};

export const BookForm = ({ children, onSubmit }: BookFormProps) => {
  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {children}
    </form>
  );
};

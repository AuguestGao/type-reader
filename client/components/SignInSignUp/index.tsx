import React, { ReactNode } from "react";
import styles from "./styles.module.scss";
import Layout from "../../components/Layout";

type SignFormProps = {
  title: string;
  action: string;
  children: ReactNode;
};

const SignForm = ({ children, title, action }: SignFormProps) => (
  <Layout>
    <div className={styles.position}>
      <form className={styles.form} action={action}>
        <h1>{title.toUpperCase()}</h1>
        {children}
      </form>
    </div>
  </Layout>
);

export default SignForm;

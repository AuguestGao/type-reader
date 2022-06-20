import { useState, useEffect, FormEvent } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import { FormInput, SignForm } from "../../components";

import styles from "../../styles/Auth.module.scss";

const ForgotPassword: NextPage = () => {
  const [formInput, setFormInput] = useState({
    email: "",
  });

  useEffect(() => {
    return () =>
      setFormInput({
        email: "",
      });
  }, []);

  const { doRequest, errors } = useRequest({
    url: "/api/users/forgotpassword",
    method: "post",
    body: {
      email: formInput.email,
    },

    onSuccess: ({ question }: { question: string }) => {
      localStorage.setItem("question", question);
      Router.push("/auth/resetpassword");
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <SignForm title="Forgot password?" onSubmit={onSubmit}>
      <FormInput
        type="email"
        label="Email"
        id="email"
        value={formInput.email}
        onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
      />

      {errors}

      <div className="w-100 mt-5 d-flex justify-content-center">
        <button
          type="submit"
          className="btn btn-outline-light rounded-pill px-5 fs-5 fw-bold"
        >
          Submit
        </button>
      </div>

      <p className={styles.redirect}>
        Now remember it?{" "}
        <Link href="/auth/signin" passHref>
          <a className={styles.link}>back to Sign In</a>
        </Link>
      </p>
    </SignForm>
  );
};

export default ForgotPassword;

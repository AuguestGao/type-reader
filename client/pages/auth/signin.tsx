import { useState, useEffect, FormEvent } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import { FormInput, SignForm } from "../../components";

import styles from "../../styles/Auth.module.scss";

const SignIn: NextPage = () => {
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    return () =>
      setFormInput({
        email: "",
        password: "",
      });
  }, []);

  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    method: "post",
    body: {
      email: formInput.email,
      password: formInput.password,
    },

    onSuccess: (displayName: string) => {
      Router.push("/");
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <SignForm title="Sign in" onSubmit={onSubmit}>
      <FormInput
        type="email"
        label="Email"
        id="email"
        value={formInput.email}
        onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
      />
      <FormInput
        type="password"
        label="Password"
        id="password"
        value={formInput.password}
        onChange={(e) =>
          setFormInput({ ...formInput, password: e.target.value })
        }
      />
      <p className={styles.forgotPassword}>
        <Link href="/auth/forgotpassword">Forgot password?</Link>{" "}
      </p>

      {errors}

      <div className="w-100 mt-5 d-flex justify-content-center">
        <button
          type="submit"
          className="btn btn-outline-light rounded-pill px-5 fs-5 fw-bold"
        >
          Sign in
        </button>
      </div>

      <p className={styles.redirect}>
        Already have an account?{" "}
        <Link href="/auth/signup" passHref>
          <a className={styles.link}>go to Sign Up</a>
        </Link>{" "}
      </p>
    </SignForm>
  );
};

export default SignIn;

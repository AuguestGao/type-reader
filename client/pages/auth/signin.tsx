import { useState, useEffect, FormEvent } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import { useAuth } from "../../context/user-context";

import SignForm from "../../components/SignInSignUp";
import FormInput from "../../components/FromInput";
import styles from "../../styles/Auth.module.scss";

const SignIn: NextPage = () => {
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      Router.push("/");
    }

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

    onSuccess: () => {
      Router.push("/");
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <SignForm title="sign in" onSubmit={onSubmit}>
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

      <pre>{errors}</pre>

      <button type="submit" className="btn btn-primary w-100 mt-4">
        Sign in
      </button>

      <p className={styles.redirect}>
        Already have an account? <Link href="/auth/signup">Go to Sign Up</Link>{" "}
      </p>
    </SignForm>
  );
};

export default SignIn;

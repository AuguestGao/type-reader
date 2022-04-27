import { useState, useEffect, FormEvent } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import { useAuth } from "../../context/user-context";

import SignForm from "../../components/SignInSignUp";
import FormInput from "../../components/FromInput";
import styles from "../../styles/Auth.module.scss";

const ForgotPassword: NextPage = () => {
  const [formInput, setFormInput] = useState({
    email: "",
  });

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      Router.push("/");
    }

    return () =>
      setFormInput({
        email: "",
      });
  }, [currentUser]);

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
    <SignForm title="forgot password" onSubmit={onSubmit}>
      <FormInput
        type="email"
        label="Email"
        id="email"
        value={formInput.email}
        onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
      />

      <p>{errors}</p>

      <button type="submit" className="btn btn-primary w-100 mt-4">
        Submit
      </button>

      <p className={styles.redirect}>
        Remembered it? <Link href="/auth/signin">Go to Sign In</Link>
      </p>
    </SignForm>
  );
};

export default ForgotPassword;

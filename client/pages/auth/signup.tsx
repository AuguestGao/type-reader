import type { NextPage } from "next";
import { useState, FormEvent, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import SignForm from "../../components/SignInSignUp";
import FormInput from "../../components/FromInput";

import styles from "../../styles/Auth.module.scss";

const SignUp: NextPage = () => {
  const [formInput, setFormInput] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
    question: "",
    answer: "",
  });

  useEffect(() => {
    return () =>
      setFormInput({
        displayName: "",
        email: "",
        password: "",
        confirmPassword: "",
        question: "",
        answer: "",
      });
  });

  const { doRequest, errors } = useRequest({
    url: "/api/users/signup",
    method: "post",
    body: {
      displayName: formInput.displayName,
      email: formInput.email,
      password: formInput.password,
      confirmPassword: formInput.confirmPassword,
      question: formInput.question,
      answer: formInput.answer,
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
    <SignForm title="sign up" onSubmit={onSubmit}>
      <FormInput
        type="text"
        label="Display Name"
        fieldName="displayName"
        value={formInput.displayName}
        onChange={(e) =>
          setFormInput({ ...formInput, displayName: e.target.value })
        }
      />
      <FormInput
        type="email"
        label="Email"
        fieldName="email"
        value={formInput.email}
        onChange={(e) => setFormInput({ ...formInput, email: e.target.value })}
      />
      <FormInput
        type="password"
        label="Password"
        fieldName="password"
        value={formInput.password}
        onChange={(e) =>
          setFormInput({ ...formInput, password: e.target.value })
        }
      />
      <FormInput
        type="password"
        label="Comfirm Password"
        fieldName="confirmPassword"
        value={formInput.confirmPassword}
        onChange={(e) =>
          setFormInput({ ...formInput, confirmPassword: e.target.value })
        }
      />
      <FormInput
        type="text"
        label="Security Question"
        fieldName="question"
        value={formInput.question}
        onChange={(e) =>
          setFormInput({ ...formInput, question: e.target.value })
        }
      />
      <FormInput
        type="text"
        label="Security Answer"
        fieldName="answer"
        value={formInput.answer}
        onChange={(e) => setFormInput({ ...formInput, answer: e.target.value })}
      />
      <button type="submit" className="btn btn-primary w-100 mt-4">
        Sign up
      </button>

      <p className={styles.redirect}>
        Already have an account? <Link href="/auth/signin">Go to Sign In</Link>{" "}
      </p>
    </SignForm>
  );
};

export default SignUp;

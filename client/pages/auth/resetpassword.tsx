import { useState, useEffect, FormEvent } from "react";
import type { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";

import useRequest from "../../hooks/use-request";
import { useAuth } from "../../context/user-context";
import { FormInput, SignForm } from "../../components";

import styles from "../../styles/Auth.module.scss";

const ResetPassword: NextPage = () => {
  const [formInput, setFormInput] = useState({
    answer: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [question, setQuestion] = useState<string | null>(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      Router.push("/");
    }

    setQuestion(localStorage.getItem("question"));

    return () => {
      setFormInput({
        answer: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    };
  }, [currentUser]);

  const { doRequest, errors } = useRequest({
    url: "/api/users/resetpassword",
    method: "post",
    body: {
      answer: formInput.answer,
      password: formInput.newPassword,
      confirmPassword: formInput.confirmNewPassword,
    },

    onSuccess: () => {
      localStorage.removeItem("question");
      Router.push("/auth/signin");
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <SignForm title="reset password" onSubmit={onSubmit}>
      <div className={styles.question}>Question: {question}</div>
      <FormInput
        type="text"
        label="Answer"
        id="answer"
        value={formInput.answer}
        onChange={(e) => setFormInput({ ...formInput, answer: e.target.value })}
      />
      <FormInput
        type="password"
        label="New Password"
        id="newPassword"
        value={formInput.newPassword}
        onChange={(e) =>
          setFormInput({ ...formInput, newPassword: e.target.value })
        }
      />
      <FormInput
        type="password"
        label="Confirm New Password"
        id="confirmNewPassword"
        value={formInput.confirmNewPassword}
        onChange={(e) =>
          setFormInput({ ...formInput, confirmNewPassword: e.target.value })
        }
      />

      <p>{errors}</p>

      <button type="submit" className="btn btn-primary w-100 mt-4">
        Submit
      </button>

      <p className={styles.redirect}>
        <Link href="/auth/signin">Back to Sign In</Link>
      </p>
    </SignForm>
  );
};

export default ResetPassword;

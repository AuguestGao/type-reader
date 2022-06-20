import type { NextPage } from "next";
import { useState, useEffect, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useRequest from "../../hooks/use-request";
import { SignForm, FormInput } from "../../components";

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

  const router = useRouter();

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
  }, []);

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

    onSuccess: (data) => {
      router.push("/");
    },
  });

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    await doRequest();
  };

  return (
    <SignForm title="Sign up" onSubmit={onSubmit}>
      <FormInput
        type="text"
        label="Display Name"
        id="displayName"
        value={formInput.displayName}
        onChange={(e) =>
          setFormInput({ ...formInput, displayName: e.target.value })
        }
      />
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
      <FormInput
        type="password"
        label="Comfirm Password"
        id="confirmPassword"
        value={formInput.confirmPassword}
        onChange={(e) =>
          setFormInput({ ...formInput, confirmPassword: e.target.value })
        }
      />
      <FormInput
        type="text"
        label="Security Question"
        id="question"
        value={formInput.question}
        onChange={(e) =>
          setFormInput({ ...formInput, question: e.target.value })
        }
      />
      <FormInput
        type="text"
        label="Security Answer"
        id="answer"
        value={formInput.answer}
        onChange={(e) => setFormInput({ ...formInput, answer: e.target.value })}
      />

      {errors}

      <div className="w-100 mt-5 d-flex justify-content-center">
        <button
          type="submit"
          className="btn btn-outline-light rounded-pill px-5 fs-5 fw-bold"
        >
          Sign up
        </button>
      </div>

      <p className={styles.redirect}>
        Already have an account?{" "}
        <Link href="/auth/signin" passHref>
          <a className={styles.link}>go to Sign In</a>
        </Link>{" "}
      </p>
    </SignForm>
  );
};

export default SignUp;

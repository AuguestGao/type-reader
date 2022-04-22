import type { NextPage } from "next";
import Link from "next/link";
import SignForm from "../../components/SignInSignUp";
import FormInput from "../../components/FromInput";
import styles from "../../styles/Auth.module.scss";

const SignUp: NextPage = () => {
  return (
    <SignForm title="sign up" action="/api/users/signup">
      <FormInput
        type="text"
        label="Name"
        fieldName="displayName"
        placeholder="What would you like to be called?"
      />
      <FormInput
        type="email"
        label="Email"
        fieldName="email"
        placeholder="Your email address."
      />
      <FormInput
        type="password"
        label="Password"
        fieldName="password"
        placeholder="Set up a passsord for your account."
      />
      <FormInput
        type="password"
        label="Comfirm Password"
        fieldName="confirmPassword"
        placeholder="Enter password again."
      />
      <FormInput
        type="text"
        label="Security Question"
        fieldName="question"
        placeholder="Question for reset password."
      />
      <FormInput
        type="text"
        label="Security Answer"
        fieldName="answer"
        placeholder="Answer to reset password."
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

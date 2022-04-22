import type { NextPage } from "next";
import Link from "next/link";
import SignForm from "../../components/SignInSignUp";
import FormInput from "../../components/FromInput";
import styles from "../../styles/Auth.module.scss";

const SignIn: NextPage = () => {
  return (
    <SignForm title="sign in" action="/api/users/signup">
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
      <p className={styles.forgotPassword}>
        <Link href="/auth/forgotpassword">Forgot password?</Link>{" "}
      </p>

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

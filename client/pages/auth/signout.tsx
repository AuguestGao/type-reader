import { useEffect } from "react";
import type { NextPage } from "next";
import Router from "next/router";

import useRequest from "../../hooks/use-request";

const SignIn: NextPage = () => {
  const { doRequest } = useRequest({
    url: "/api/users/signout",
    method: "post",
    body: {},

    onSuccess: () => {
      Router.push("/");
    },
  });

  useEffect(() => {
    doRequest();
  }, [doRequest]);

  return <div>Signing out</div>;
};

export default SignIn;

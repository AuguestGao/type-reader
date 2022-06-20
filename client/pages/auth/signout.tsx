import { useEffect } from "react";
import Router from "next/router";

import { Textile } from "../../components";

import useRequest from "../../hooks/use-request";

const SignOut = () => {
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

  return (
    <Textile>
      <h1 className="text-white text-center">Signing out</h1>
    </Textile>
  );
};

export default SignOut;

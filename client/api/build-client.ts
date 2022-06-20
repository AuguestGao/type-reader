import axios, { AxiosRequestHeaders } from "axios";
import { NextPageContext } from "next";

const buildClient = (headers: AxiosRequestHeaders) => {
  if (typeof window === "undefined") {
    // server request
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers,
    });
  } else {
    // client request
    return axios.create({ baseURL: "/" });
  }
};

export default buildClient;

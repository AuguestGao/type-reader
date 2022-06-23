import axios, { AxiosRequestHeaders } from "axios";

const buildClient = (headers: AxiosRequestHeaders) => {
  if (typeof window === "undefined") {
    // server request
    return axios.create({
      // baseURL:
      // "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local", // for local dev
      baseURL: "http://www.type-reader.xyz/",
      headers,
    });
  } else {
    // client request
    return axios.create({ baseURL: "/" });
  }
};

export default buildClient;

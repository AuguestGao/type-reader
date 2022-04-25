import axios, { AxiosRequestConfig } from "axios";

const buildClient = ({ req }: { req: AxiosRequestConfig }) => {
  if (typeof window === undefined) {
    // server request
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.srv.cluster.local",
      headers: req.headers,
    });
  } else {
    // client request
    return axios.create({ baseURL: "/" });
  }
};

export default buildClient;

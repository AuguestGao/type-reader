import axios, { AxiosError, AxiosResponse } from "axios";

type Method = "post" | "get" | "put" | "delete" | "patch";

interface RequestProps {
  url: string;
  method: Method;
  body: object;
}

export const doRequest = async ({ url, method, body }: RequestProps) => {
  try {
    const response = (await axios[method](url, body)) as AxiosResponse;

    return { data: response.data, errors: null };
  } catch (err) {
    const errs = err as AxiosError;

    const errors = (
      <div className="alert alert-danger">
        <ul className="my-0">
          {errs.response!.data.errors.map((error: { message: string }) => (
            <li key={error.message}>{error.message}</li>
          ))}
        </ul>
      </div>
    );

    return { data: null, errors };
  }
};

import { ReactNode } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";

import { useState } from "react";

type Method = "post" | "get" | "put" | "delete";

interface RequestProps {
  url: string;
  method: Method;
  body: object;
  onSuccess: (data: any) => void;
}

const useRequest = ({ url, method, body, onSuccess }: RequestProps) => {
  //todo - chnage type for errors
  const [errors, setErrors] = useState<ReactNode | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);

      const response = (await axios[method](url, body)) as AxiosResponse;

      if (onSuccess) {
        onSuccess(response.data);
      }

      return response.data;
    } catch (err) {
      const errors = err as AxiosError;

      setErrors(
        <div className="alert alert-danger">
          <ul className="my-0">
            {errors.response!.data.errors.map((error: { message: string }) => (
              <li key={error.message}>{error.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
};

export default useRequest;

import axios from "axios";
import { useState } from "react";

type Method = "post" | "get" | "put" | "delete";

interface RequestProps {
  url: string;
  method: Method;
  body: object;
  onSuccess?: () => void;
}

const useRequest = ({ url, method, body, onSuccess }: RequestProps) => {
  //todo - chnage type for errors
  const [errors, setErrors] = useState<object | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);

      const response = await axios[method](url, body);

      if (onSuccess) {
        onSuccess();
      }

      return response.data;
    } catch (err) {
      // setErrors(
      // <div className="alert alert-danger">
      //     <ul className="my-0">
      //       {err.response.data.errors.map((error) => (
      //         <li key={error.message}>{error.message}</li>
      //       ))}
      //     </ul>
      //   </div>
      // );
      console.log(err);
    }
  };

  return { doRequest, errors };
};

export default useRequest;

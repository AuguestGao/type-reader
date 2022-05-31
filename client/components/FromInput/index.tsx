import { FormField } from "../../types";

export const FormInput = ({ type, label, id, value, onChange }: FormField) => {
  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        className="form-control"
        id={id}
        value={value}
        placeholder={label}
        onChange={onChange}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
};

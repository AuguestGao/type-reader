import { ChangeEvent } from "react";

interface FormInputProps {
  type: string;
  label: string;
  id: string;
  value: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

const FormInput = ({ type, label, id, value, onChange }: FormInputProps) => {
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

export default FormInput;

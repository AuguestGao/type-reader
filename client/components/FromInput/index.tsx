import { ChangeEvent } from "react";

interface FormInputProps {
  type: string;
  label: string;
  fieldName: string;
  value: string;
  onChange(e: ChangeEvent<HTMLInputElement>): void;
}

const FormInput = ({
  type,
  label,
  fieldName,
  value,
  onChange,
}: FormInputProps) => {
  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        className="form-control"
        id={fieldName}
        value={value}
        placeholder={label}
        onChange={onChange}
      />
      <label htmlFor={fieldName}>{label}</label>
    </div>
  );
};

export default FormInput;

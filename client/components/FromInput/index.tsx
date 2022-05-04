import { IFormField } from "../../@types/book";

const FormInput = ({ type, label, id, value, onChange }: IFormField) => {
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

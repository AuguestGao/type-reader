interface FormInputProps {
  type: string;
  label: string;
  fieldName: string;
  placeholder?: string;
}

const FormInput = ({ type, label, fieldName, placeholder }: FormInputProps) => {
  return (
    <div className="form-floating mb-3">
      <input
        type={type}
        className="form-control"
        id={fieldName}
        placeholder={placeholder}
      />
      <label htmlFor={fieldName}>{label}</label>
    </div>
  );
};

export default FormInput;

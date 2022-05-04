import { IFormField } from "../../@types/book";

const FormTextarea = ({ label, id, value, onChange }: IFormField) => {
  return (
    <div className="form-floating mb-2">
      <textarea
        className="form-control"
        id={id}
        placeholder={label}
        style={{
          height: "300px",
          minHeight: "300px",
          // background: "rgba(186, 197, 206, 0.4)",
        }}
        value={value}
        onChange={onChange}
      />
      <label htmlFor="body">{label}</label>
    </div>
  );
};

export default FormTextarea;

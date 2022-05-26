import { FormField } from "../../types";

export const FormTextarea = ({ label, id, value, onChange }: FormField) => {
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

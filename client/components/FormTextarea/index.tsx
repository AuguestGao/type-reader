import { FormField } from "../../types";
import styles from "./styles.module.scss";

export const FormTextarea = ({ label, id, value, onChange }: FormField) => {
  return (
    <div className={`form-floating mb-2 ${styles.main}`}>
      <textarea
        className="form-control"
        id={id}
        placeholder={label}
        style={{
          height: "230px",
          minHeight: "180px",
          // background: "rgba(186, 197, 206, 0.4)",
        }}
        value={value}
        onChange={onChange}
      />
      <label htmlFor="body">{label}</label>
    </div>
  );
};

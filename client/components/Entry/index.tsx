import styles from "./styles.module.scss";

export const Entry = ({ char, state }: { char: string; state: string }) => {
  let renderChar: string;

  switch (char) {
    case " ":
      renderChar = "⎵";
      break;
    case "TAB":
      renderChar = "↹";
      break;
    case "ENTER":
      renderChar = "↵";
      break;
    default:
      renderChar = char;
  }

  return (
    <div className={`${styles[state]} ${styles.main}`}>
      <span
        className={`${
          renderChar === "⎵"
            ? styles.twoSpaces
            : renderChar === "↹"
            ? styles.fourSpaces
            : ""
        }`}
      >
        {renderChar}
      </span>
      {renderChar === "↵" && <div className={styles.break}></div>}
    </div>
  );
};

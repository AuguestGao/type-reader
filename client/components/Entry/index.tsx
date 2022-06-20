import styles from "./styles.module.scss";

export const Entry = ({ char, state }: { char: string; state: string }) => {
  let renderChar: string;
  let space: string;

  switch (char) {
    case " ":
      renderChar = "⎵";
      space = "twoSpaces";
      break;
    case "ENTER":
      renderChar = "↵";
      space = "twoSpaces";
      break;
    case "TAB":
      renderChar = "↹";
      space = "fourSpaces";
      break;
    default:
      renderChar = char;
      space = "";
  }

  return (
    <span
      className={`${styles[state]} ${styles.main} ${!!space && styles[space]}`}
    >
      {renderChar}
    </span>
  );
};

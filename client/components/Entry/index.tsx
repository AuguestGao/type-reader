import styles from "./styles.module.scss";

export const Entry = ({ char, state }: { char: string; state: string }) => {
  return (
    <div className={`${styles[state]} ${styles.main}`}>
      <span>{char}</span>
    </div>
  );
};

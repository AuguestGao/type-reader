import styles from "./styles.module.scss";

export const Footer = () => {
  return (
    <p className={styles.main}>
      An app by{" "}
      <address role="author" className={styles.author}>
        Auguest Gao
      </address>{" "}
      Ⓒ {new Date().getFullYear().toString()}
    </p>
  );
};

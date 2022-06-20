import styles from "./styles.module.scss";

export const Footer = () => {
  return (
    <footer className={styles.main}>
      An app by&nbsp;
      <a
        className={styles.link}
        href="https://notaugust.com/"
        target="_blank"
        rel="noreferrer"
      >
        Auguest Gao
      </a>
      &nbsp;Ⓒ {new Date().getFullYear().toString()}
    </footer>
  );
};

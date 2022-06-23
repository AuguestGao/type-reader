import { ButtonLink } from "../components";

import styles from "../styles/404.module.scss";

const NotFound = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.title}>404</h1>
      <p className={styles.subtitle}>That page was gone with the wind...</p>

      <ButtonLink dest="/" label="go Home" />
    </div>
  );
};

export default NotFound;

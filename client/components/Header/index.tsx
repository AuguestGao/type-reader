import Link from "next/link";
import { useAuth } from "../../context/user-context";

import styles from "./styles.module.scss";

const Header = () => {
  const { currentUser } = useAuth();

  return (
    <div className={styles.navWrap}>
      <div className={styles.logo}>
        <Link href="/">Type Reader</Link>
      </div>
      <div className={styles.auth}>
        {currentUser ? (
          <Link href="/auth/signout">Sign Out</Link>
        ) : (
          <Link href="/auth/signin">Sign In</Link>
        )}
      </div>
    </div>
  );
};

export default Header;

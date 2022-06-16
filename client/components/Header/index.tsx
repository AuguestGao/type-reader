import Link from "next/link";

import { useAuth } from "../../context/user-context";

import styles from "./styles.module.scss";

export const Header = () => {
  const { currentUser } = useAuth();

  return (
    <nav className={styles.navWrap}>
      <div className={styles.logo}>
        <Link href="/">Type Reader</Link>
      </div>
      <ul className="nav justify-content-end">
        {currentUser ? (
          <>
            <li className="nav-item">
              <Link href="/books" passHref>
                <a className={styles.link} aria-current="page">
                  Books
                </a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/auth/signout" passHref>
                <a className={styles.link} aria-current="page">
                  Sign Out
                </a>
              </Link>
            </li>
          </>
        ) : (
          <Link href="/auth/signin">Sign In</Link>
        )}
        <Link href="/auth/signin">Sign In</Link>
      </ul>
    </nav>
  );
};

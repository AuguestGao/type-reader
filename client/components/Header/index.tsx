import Link from "next/link";

import { useAuth } from "../../context/user-context";

import styles from "./styles.module.scss";

export const Header = () => {
  const { currentUser } = useAuth();

  return (
    <nav className={styles.main}>
      <div className={styles.logo}>
        <Link href="/" passHref>
          <p>
            Ty<span className={styles.flickerSlow}>p</span>e Rea
            <span className={styles.flickerFast}>d</span>er
          </p>
        </Link>
      </div>
      <ul className="nav justify-content-end gap-3">
        {currentUser ? (
          <>
            <li className="nav-item">
              <Link href="/books" passHref>
                <a className={styles.link}>Books</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/statistics" passHref>
                <a className={styles.link}>Stats</a>
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/auth/signout" passHref>
                <a className={styles.link}>Sign Out</a>
              </Link>
            </li>
          </>
        ) : (
          <li className="nav-item">
            <Link href="/auth/signin" passHref>
              <a className={styles.link}>Sign In</a>
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

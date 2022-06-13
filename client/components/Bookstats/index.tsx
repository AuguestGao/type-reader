import { IBookStats } from "../../types";
import { getDHMSString } from "../../utils/convert-seconds";
import { ProgressBar } from "../ProgressBar";

import styles from "./styles.module.scss";

export const BookStats = ({ data }: { data: IBookStats }) => {
  const { totalSecOnBook, progress } = data;

  return (
    <div className={styles.main}>
      <p>
        You have spent{" "}
        <span className={styles.spentTime}>
          {getDHMSString(totalSecOnBook)}{" "}
        </span>
        on this book.
      </p>
      <ProgressBar current={progress} bgColor="#ffc107" />
    </div>
  );
};

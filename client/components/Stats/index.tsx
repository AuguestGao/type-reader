import { IStats } from "../../types";
import { getDHMSString } from "../../utils/convert-seconds";

import styles from "./styles.module.scss";

export const Stats = ({ data }: { data: IStats }) => {
  const { wpm, netWpm, readInSec, accuracy } = data;

  return (
    <div className={styles.main}>
      <h1>Typing Stats</h1>
      <h3>Speed (penalty-free): {wpm} WPM</h3>
      <h3>Speed: {netWpm} WPM</h3>
      <h3>Accuracy: {accuracy} %</h3>
      <h3>Time: {getDHMSString(readInSec)}</h3>
    </div>
  );
};

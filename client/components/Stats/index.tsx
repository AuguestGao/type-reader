import { IStats } from "../../types";
import { getDHMSString } from "../../utils/convert-seconds";

import styles from "./styles.module.scss";

const getFormatted = (num: number, unit: string) => {
  if (Number.isNaN(num)) {
    return "N/A";
  }

  return num.toString() + " " + unit;
};

export const Stats = ({ data }: { data: IStats }) => {
  const { wpm, netWpm, readInSec, accuracy } = data;

  return (
    <div className={styles.main}>
      <h3>Speed (no penalty): {getFormatted(wpm, "WPM")}</h3>
      <h3>Speed: {getFormatted(netWpm, "WPM")}</h3>
      <h3>Accuracy: {getFormatted(accuracy, "%")}</h3>
      <h3>Time: {getDHMSString(readInSec)}</h3>
    </div>
  );
};

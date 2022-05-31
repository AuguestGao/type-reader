import { useState, useEffect } from "react";
import Clock from "react-live-clock";

import styles from "./styles.module.scss";

export const DigitalClock = () => {
  const [showClock, toggleShowClock] = useState(false);

  useEffect(() => {
    toggleShowClock(true);
  }, []);

  return (
    <div>
      {showClock && <Clock format={"h:mm A"} className={styles.clock} />}
    </div>
  );
};

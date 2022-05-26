import { useState } from "react";

const useTimer = () => {
  const [readInSec, setReadInSec] = useState(0);
  const [startTime, setStartTime] = useState(new Date());

  const startTimer = () => {
    setStartTime(new Date());
  };

  const stopTimer = () => {
    const msecDiff = new Date().getTime() - startTime.getTime();
    const secDiff = Math.round(msecDiff / 1000);
    setReadInSec(readInSec + secDiff);
  };

  const clearTimer = () => {
    setReadInSec(0);
  };

  return { startTimer, stopTimer, clearTimer, readInSec };
};

export default useTimer;

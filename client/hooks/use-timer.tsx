import { useRef } from "react";

const useTimer = () => {
  const readInSec = useRef(0);
  const startTime = useRef(new Date());

  const startTimer = () => {
    startTime.current = new Date();
  };

  const stopTimer = () => {
    const msecDiff = new Date().getTime() - startTime.current.getTime();
    const secDiff = Math.round(msecDiff / 1000);
    readInSec.current += secDiff;
  };

  const clearTimer = () => {
    readInSec.current = 0;
  };

  const getTimerReading = () => {
    return readInSec.current;
  };

  return { startTimer, stopTimer, clearTimer, getTimerReading };
};

export default useTimer;

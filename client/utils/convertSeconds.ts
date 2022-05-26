export const getDHMS = (readInSec: number) => {
  let remains = readInSec;

  const secToDay = 60 * 60 * 24;
  const secToHour = 60 * 60;
  const secToMin = 60;

  const days = Math.floor(remains / secToDay);
  remains -= days * secToDay;

  const hours = Math.floor(remains / secToHour);
  remains -= hours * secToHour;

  const minutes = Math.floor(remains / secToMin);
  remains -= minutes * secToMin;

  return {
    days,
    hours,
    minutes,
    seconds: remains,
  };
};

export const getDHMSString = (readInSec: number) => {
  const { days, hours, minutes, seconds } = getDHMS(readInSec);

  let result = "";

  if (days !== 0) {
    result += `${days} day ${hours} hour ${minutes} minute ${seconds} second`;
  } else if (hours !== 0) {
    result += `${hours} hour ${minutes} minute ${seconds} second`;
  } else if (minutes !== 0) {
    result += `${minutes} minute ${seconds} second`;
  } else {
    result += `${seconds} second`;
  }

  return result;
};

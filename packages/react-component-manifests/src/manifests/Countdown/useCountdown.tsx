import { useEffect, useState } from "react";
export type useCountdownHookType = {
  targetDate: number;
  countDown: number;
  isFrozen: boolean;
};
const useCountdown = (
  targetDate: useCountdownHookType["targetDate"],
  isFrozen: useCountdownHookType["isFrozen"]
) => {
  const countDownDate = new Date(targetDate).getTime();

  const [countDown, setCountDown] = useState(
    countDownDate - new Date().getTime()
  );

  useEffect(() => {
    setCountDown(countDownDate - new Date().getTime());
  }, [countDownDate]);

  useEffect(() => {
    let interval: ReturnType<typeof setTimeout>;
    if (!isFrozen) {
      interval = setInterval(() => {
        setCountDown(countDownDate - new Date().getTime());
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [countDownDate, isFrozen]);

  return getReturnValues(countDown);
};

const getReturnValues = (countDown: useCountdownHookType["countDown"]) => {
  const days = Math.floor(countDown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

  return [days, hours, minutes, seconds];
};

export { useCountdown };

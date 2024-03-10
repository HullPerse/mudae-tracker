import { useState, useEffect } from "react";

export default function MudaeCountdown() {
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });
  const [resetTime, setResetTime] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();

      let remainingMinutes = 57 - currentMinutes;
      let remainingSeconds = 59 - currentSeconds;

      if (remainingSeconds < 0) {
        remainingMinutes -= 1;
        remainingSeconds = 59 + remainingSeconds;
      }

      if (remainingMinutes < 0) {
        remainingMinutes = 57;
      }

      setTime({ minutes: remainingMinutes, seconds: remainingSeconds });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();

      let remainingHours = 4 - currentTime.getHours();
      let remainingMinutes = 57 - currentMinutes;
      let remainingSeconds = 59 - currentSeconds;

      if (remainingHours < 0) {
        remainingHours = 0;
        remainingMinutes = 57 - currentMinutes;
        remainingSeconds = 59 - currentSeconds;
      }

      if (remainingSeconds < 0) {
        remainingHours -= 1;
        remainingMinutes -= 1;
        remainingSeconds = 59 + remainingSeconds;
      }

      if (remainingMinutes < 0) {
        remainingMinutes = 57;
      }

      setResetTime({
        hours: remainingHours,
        minutes: remainingMinutes,
        seconds: remainingSeconds,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row justify-center items-center gap-x-4">
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold">Время до роллов: </h1>
        <p>{`${time.minutes.toString().padStart(2, "0")}:${time.seconds
          .toString()
          .padStart(2, "0")}`}</p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold">Время до клейма: </h1>
        <p>{`${resetTime.hours.toString()}:${resetTime.minutes
          .toString()
          .padStart(2, "0")}:${resetTime.seconds
          .toString()
          .padStart(2, "0")}`}</p>
      </div>
    </div>
  );
}

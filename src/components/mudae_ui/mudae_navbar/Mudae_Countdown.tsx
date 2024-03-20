import { useState, useEffect } from "react";

export default function MudaeCountdown() {
  const [time, setTime] = useState<{ minutes: number; seconds: number }>({
    minutes: 0,
    seconds: 0,
  });
  const [resetTime, setResetTime] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();

      let remainingMinutes = 57 - currentMinutes - 1;
      let remainingSeconds = 59 - currentSeconds;

      if (remainingSeconds < 0) {
        remainingMinutes = remainingMinutes - 1;
        remainingSeconds = 59;
      }

      if (remainingMinutes < 0) {
        remainingMinutes = 59;
      }

      setTime({
        minutes: remainingMinutes,
        seconds: remainingSeconds,
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const moscowTime = new Date().toLocaleString("en-US", {
        timeZone: "Europe/Moscow",
      });

      const targetHours = [1, 5, 9, 13, 17, 21, 25];

      let targetIndex = 0;

      const currentTime = new Date(moscowTime);
      const currentHour = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();

      let remainingHours = 23 - resetTime.hours;
      let remainingMinutes = 59 - resetTime.minutes;
      let remainingSeconds = 59 - resetTime.seconds;

      for (let i = 0; i < targetHours.length; i++) {
        if (currentHour < targetHours[i]) {
          targetIndex = i;
          break;
        }
      }

      const targetHour = targetHours[targetIndex];

      remainingHours = targetHour - currentHour - 1;
      remainingMinutes = 59 - currentMinutes - 3;
      remainingSeconds = 59 - currentSeconds;

      if (remainingHours < 0) {
        remainingHours = 23;
      }

      if (remainingMinutes < 0) {
        remainingMinutes = 59;
      }

      if (remainingSeconds < 0) {
        remainingSeconds = 59;
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
        <p>
          {time.minutes
            ? `${time.minutes.toString().padStart(2, "0")}:${time.seconds
                .toString()
                .padStart(2, "0")}`
            : "00:00"}
        </p>
      </div>
      <div className="flex flex-col items-center justify-center">
        <h1 className="font-bold">Время до клейма: </h1>
        <p>
          {resetTime.hours.toString()}:
          {resetTime.minutes.toString().padStart(2, "0")}:
          {resetTime.seconds.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

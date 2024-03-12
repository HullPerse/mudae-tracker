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

      let remainingMinutes = 57 - currentMinutes;
      let remainingSeconds = 59 - currentSeconds;

      if (remainingSeconds < 0) {
        remainingMinutes -= 1;
        remainingSeconds = 59 + remainingSeconds;
      }

      if (remainingMinutes < 0) {
        remainingMinutes = 57;
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
      const currentTime = new Date(moscowTime);
      const currentHour = currentTime.getHours();

      const targetHours = [1, 5, 9, 13, 17, 21];

      let nextTargetIndex = 0;
      for (let i = 0; i < targetHours.length; i++) {
        if (currentHour < targetHours[i]) {
          nextTargetIndex = i;
          break;
        }
      }

      const targetHour = targetHours[nextTargetIndex];
      const targetTime = new Date(currentTime);
      targetTime.setHours(targetHour, 0, 0, 0);

      let remainingMilliseconds = targetTime.getTime() - currentTime.getTime();
      if (remainingMilliseconds < 0) {
        targetTime.setDate(targetTime.getDate() + 1);
        remainingMilliseconds = targetTime.getTime() - currentTime.getTime();
      }

      const remainingHours = Math.floor(
        remainingMilliseconds / (1000 * 60 * 60)
      );
      const remainingMinutes = Math.floor(
        (remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60) - 2
      );
      const remainingSeconds = Math.floor(
        (remainingMilliseconds % (1000 * 60)) / 1000 - 1
      );

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

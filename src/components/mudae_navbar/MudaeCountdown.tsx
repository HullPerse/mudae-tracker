import { useState, useEffect } from "react";

export default function MudaeCountdown() {
  const [time, setTime] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();

      let remainingMinutes = 57 - currentMinutes;
      let remainingSeconds = 60 - currentSeconds;

      if (remainingSeconds < 0) {
        remainingMinutes -= 1;
        remainingSeconds = 60 + remainingSeconds;
      }

      if (remainingMinutes < 0) {
        remainingMinutes = 57;
      }

      setTime({ minutes: remainingMinutes, seconds: remainingSeconds });
    }, 1000);

    return () => clearInterval(interval);
  });

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-bold">Время до роллов: </h1>
      <p>{`${time.minutes.toString().padStart(2, "0")}:${time.seconds
        .toString()
        .padStart(2, "0")}`}</p>
    </div>
  );
}

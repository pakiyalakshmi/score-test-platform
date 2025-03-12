
import { useState, useEffect } from 'react';

export const useTimer = (initialMinutes = 60, initialSeconds = 0) => {
  const [minutes, setMinutes] = useState(initialMinutes);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    let interval: number;

    if (isRunning) {
      interval = window.setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          setIsExpired(true);
          setIsRunning(false);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [minutes, seconds, isRunning]);

  const displayTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  const pauseTimer = () => setIsRunning(false);
  const resumeTimer = () => setIsRunning(true);
  const resetTimer = (mins = initialMinutes, secs = initialSeconds) => {
    setMinutes(mins);
    setSeconds(secs);
    setIsExpired(false);
  };

  return {
    minutes,
    seconds,
    displayTime,
    isRunning,
    isExpired,
    pauseTimer,
    resumeTimer,
    resetTimer
  };
};

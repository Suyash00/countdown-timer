import "./App.css";
import React, { useState, useEffect } from "react";

const CountdownTimer = () => {
  const defaultCountdown = 0; // Default countdown value representing "00:00:00:00"
  const [countdown, setCountdown] = useState(defaultCountdown);
  const [targetDate, setTargetDate] = useState(new Date());
  const [timerRunning, setTimerRunning] = useState(false);
  const [countdownFinished, setCountdownFinished] = useState(false);

  useEffect(() => {
    let interval;

    if (timerRunning) {
      interval = setInterval(() => {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
          clearInterval(interval);
          setCountdown(0);
          setTimerRunning(false);
          setCountdownFinished(true);
        } else {
          setCountdown(difference);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [targetDate, timerRunning]);

  const days = Math.floor(countdown / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (countdown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((countdown % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((countdown % (1000 * 60)) / 1000);

  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;
  };

  const handleStartTimer = () => {
    setTimerRunning(true);
    setCountdownFinished(false); // Reset countdown finished state
    localStorage.setItem("targetDate", targetDate.getTime());
  };

  const handleCancelTimer = () => {
    setTimerRunning(false);
    setCountdown(defaultCountdown); // Reset countdown to default value
    setCountdownFinished(false); // Reset countdown finished state
    localStorage.removeItem("targetDate");
  };

  return (
    <div>
      <h1>
        Countdown <em>Timer</em>
      </h1>
      <div className="picker">
        <input
          type="datetime-local"
          value={new Date(
            targetDate.getTime() - targetDate.getTimezoneOffset() * 60000
          )
            .toISOString()
            .slice(0, 16)}
          min={new Date().toISOString().slice(0, 16)}
          max={getMaxDateTime()}
          onChange={(e) => setTargetDate(new Date(e.target.value))}
        />
        {timerRunning ? (
          <button onClick={handleCancelTimer}>Cancel Timer</button>
        ) : (
          <button onClick={handleStartTimer}>Start Timer</button>
        )}
      </div>
      <div className="container">
        {countdownFinished ? (
          <h2>💐 Adventure is finished! What's next on your journey? 💐</h2>
        ) : countdown > 100 * 24 * 60 * 60 * 1000 ? (
          <h2>The selected time is more than 100 days.</h2>
        ) : (
          <div>
            <span className="time-box">{formatTime(days)} Days</span> :
            <span className="time-box">{formatTime(hours)} Hours</span> :
            <span className="time-box">{formatTime(minutes)} Mins</span> :
            <span className="time-box">{formatTime(seconds)} Secs</span>
          </div>
        )}
      </div>
    </div>
  );
};

const getMaxDateTime = () => {
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 99); // Set cut-off date to be maximum of 99 days from current date
  return maxDate.toISOString().slice(0, 16);
};

export default CountdownTimer;

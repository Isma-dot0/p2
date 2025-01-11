import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleIncrement = (type) => {
    if (type === "break" && breakLength < 60) {
      setBreakLength(breakLength + 1);
    } else if (type === "session" && sessionLength < 60) {
      setSessionLength(sessionLength + 1);
      if (!isRunning) {
        setTimeLeft((sessionLength + 1) * 60);
      }
    }
  };

  const handleDecrement = (type) => {
    if (type === "break" && breakLength > 1) {
      setBreakLength(breakLength - 1);
    } else if (type === "session" && sessionLength > 1) {
      setSessionLength(sessionLength - 1);
      if (!isRunning) {
        setTimeLeft((sessionLength - 1) * 60);
      }
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setTimerLabel("Session");
    const audio = document.getElementById("beep");
    audio.pause();
    audio.currentTime = 0;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  useEffect(() => {
    let timer = null;

    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) {
            const audio = document.getElementById("beep");
            audio.play();
            if (timerLabel === "Session") {
              setTimerLabel("Break");
              return breakLength * 60;
            } else {
              setTimerLabel("Session");
              return sessionLength * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [isRunning, timeLeft, timerLabel, breakLength, sessionLength]);

  return (
    <div id="app">
      <div id="drum-machine">
        <h1>25 + 5 Clock</h1>
        <div className="length-controls">
          <div>
            <h2 id="break-label">Break Length</h2>
            <button id="break-decrement" onClick={() => handleDecrement("break")}>
              -
            </button>
            <span id="break-length">{breakLength}</span>
            <button id="break-increment" onClick={() => handleIncrement("break")}>
              +
            </button>
          </div>
          <div>
            <h2 id="session-label">Session Length</h2>
            <button id="session-decrement" onClick={() => handleDecrement("session")}>
              -
            </button>
            <span id="session-length">{sessionLength}</span>
            <button id="session-increment" onClick={() => handleIncrement("session")}>
              +
            </button>
          </div>
        </div>
        <div id="timer">
          <h2 id="timer-label">{timerLabel}</h2>
          <div id="time-left">{formatTime(timeLeft)}</div>
        </div>
        <div className="controls">
          <button id="start_stop" onClick={toggleTimer}>
            Start/Stop
          </button>
          <button id="reset" onClick={resetTimer}>
            Reset
          </button>
        </div>
        <audio
          id="beep"
          src="https://www.soundjay.com/button/beep-07.wav"
        ></audio>
      </div>
    </div>
  );
}

export default App;

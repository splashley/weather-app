import React, { useState, useEffect } from "react";

export default function CurrentTime() {
  const [date, setDate] = useState(new Date());

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    let timer = setInterval(() => setDate(new Date()), 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <h4 id="current-time">
        {days[date.getDay()]} {date.toLocaleTimeString()}
      </h4>
    </div>
  );
}

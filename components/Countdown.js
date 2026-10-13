"use client";
import { useEffect, useState } from "react";

export default function Countdown({ to }) {
  const [left, setLeft] = useState(null);
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, new Date(to).getTime() - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [to]);
  const v = left ?? 0;
  const items = [
    ["Days", Math.floor(v / 864e5)],
    ["Hours", Math.floor((v / 36e5) % 24)],
    ["Minutes", Math.floor((v / 6e4) % 60)],
    ["Seconds", Math.floor((v / 1e3) % 60)],
  ];
  return (
    <div className="countdown" role="timer" aria-label="Time until the workshop">
      {items.map(([l, n]) => (
        <div key={l}><b>{String(n).padStart(2, "0")}</b><span>{l}</span></div>
      ))}
    </div>
  );
}

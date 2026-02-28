import React, { useState, useEffect } from "react";

function getTargetTime() {
  const target = new Date();
  target.setHours(target.getHours() + 23);
  target.setMinutes(target.getMinutes() + 47);
  target.setSeconds(target.getSeconds() + 33);
  return target.getTime();
}

const TARGET_TIME = getTargetTime();

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 47, seconds: 33 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, TARGET_TIME - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({ hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <div className="inline-flex flex-col gap-1">
      <p className="text-xs font-semibold text-deep-black/50 uppercase tracking-widest">
        ⚡ Limited Offer Ends In:
      </p>
      <div className="flex items-center gap-2">
        {[
          { label: "HRS", value: timeLeft.hours },
          { label: "MIN", value: timeLeft.minutes },
          { label: "SEC", value: timeLeft.seconds },
        ].map(({ label, value }, i) => (
          <React.Fragment key={label}>
            {i > 0 && <span className="text-royal-gold font-bold text-xl">:</span>}
            <div className="flex flex-col items-center bg-deep-black rounded-lg px-3 py-1.5 min-w-[52px]">
              <span className="text-royal-gold font-playfair font-bold text-xl leading-none">
                {pad(value)}
              </span>
              <span className="text-ivory-white/50 text-[9px] font-poppins tracking-widest mt-0.5">
                {label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

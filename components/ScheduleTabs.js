"use client";
import { useState } from "react";
import { agenda, agendaTitle } from "@/lib/data";

// Home page schedule: the day split into three parts. Pick a part to see its timeline.
// The ranges are positions in the agenda list (0 = first session).
const parts = [
  { label: "Morning", span: "9:30 AM – 1:00 PM", from: 0, to: 7 },
  { label: "Afternoon", span: "1:00 – 4:15 PM", from: 7, to: 11 },
  { label: "Closing", span: "4:15 – 6:00 PM", from: 11, to: 13 },
];

export default function ScheduleTabs() {
  const [active, setActive] = useState(0);
  const part = parts[active];
  const items = agenda.slice(part.from, part.to);

  return (
    <div className="stabs-wrap">
      <p className="stabs-title">{agendaTitle}</p>
      <div className="stabs" role="tablist" aria-label="Parts of the day">
        {parts.map((p, i) => (
          <button
            key={p.label}
            type="button"
            role="tab"
            aria-selected={active === i}
            className={`stab ${active === i ? "on" : ""}`}
            onClick={() => setActive(i)}
          >
            <b>{p.label}</b>
            <span>{p.span}</span>
          </button>
        ))}
      </div>

      <ol className="tline" role="tabpanel">
        {items.map((a, i) => (
          <li key={a.time} className={a.rest ? "rest" : ""}>
            <span className="tl-time">{a.time}</span>
            <span className="tl-dot" aria-hidden="true" />
            <div className="tl-body">
              <h4>
                <em>{part.from + i + 1}</em>
                {a.title}
                {a.rest && <small>Break</small>}
              </h4>
              {a.desc && <p>{a.desc}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

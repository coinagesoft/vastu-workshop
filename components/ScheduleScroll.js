"use client";
import { useState } from "react";
import styles from "./ScheduleScroll.module.css";

// Home page schedule: a vertical timeline with Full day / Morning / Afternoon tabs.
// Self-contained: the data lives here, so lib/data.js does not need to change.
// kind: "learn" (default) | "practical" (hands-on) | "break"
const TITLE = "One-Day Practical Vastu Workshop";

const SESSIONS = [
  { start: "9:30 AM", end: "10:00 AM", mins: 30, title: "Registration and Welcome Kit", desc: "Registration, welcome kits and seating." },
  { start: "10:00 AM", end: "10:30 AM", mins: 30, title: "Welcome and Introduction", desc: "Workshop overview and learning objectives." },
  { start: "10:30 AM", end: "11:00 AM", mins: 30, title: "Vastu Fundamentals", desc: "Panchmahabhuta, accuracy, positive and negative spaces, and a scientific approach to observation." },
  { start: "11:00 AM", end: "11:10 AM", mins: 10, kind: "break", title: "Quick Washroom Break", desc: "A short refreshment and washroom break before the practical session." },
  { start: "11:10 AM", end: "11:15 AM", mins: 5, title: "Mindfulness and Breathing Exercise", desc: "Close your eyes, take a deep breath and release it slowly. Repeat three times." },
  { start: "11:15 AM", end: "12:30 PM", mins: 75, kind: "practical", title: "Practical Training: Finding North and the Centre", desc: "Find north using a mobile phone and Google Maps, locate the centre, and draw and mark directions on a floor plan." },
  { start: "12:30 PM", end: "1:00 PM", mins: 30, title: "Quick Questions and Answers", desc: "Clarify the morning's concepts." },
  { start: "1:00 PM", end: "1:40 PM", mins: 40, kind: "break", title: "Lunch Break", desc: "40 minutes." },
  { start: "1:40 PM", end: "2:40 PM", mins: 60, title: "Understanding Your Home's Layout", desc: "Entrances, kitchen, bedrooms, toilets, staircase and centre." },
  { start: "2:40 PM", end: "4:00 PM", mins: 80, kind: "practical", title: "Identifying Vastu Doshas and Corrections", desc: "Study sample floor plans and discuss practical corrective approaches." },
  { start: "4:00 PM", end: "4:15 PM", mins: 15, kind: "break", title: "Tea Break" },
  { start: "4:15 PM", end: "5:45 PM", mins: 90, kind: "practical", title: "One-to-One House-Plan Review", desc: "Guided floor-plan reviews, practical suggestions and individual questions." },
  { start: "5:45 PM", end: "6:00 PM", mins: 15, title: "Recap and Closing", desc: "Key takeaways, final questions and closing remarks." },
].map((s, i) => ({ ...s, n: i + 1 }));

const TABS = [
  { id: "all", label: "Full day", filter: () => true },
  { id: "morning", label: "Morning", filter: (s) => s.n <= 7 },
  { id: "afternoon", label: "Afternoon", filter: (s) => s.n >= 8 },
];

const handsOn = SESSIONS.filter((s) => s.kind === "practical").length;

function duration(m) {
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} hr ${r} min` : `${h} hr`;
}

export default function ScheduleScroll() {
  const [tab, setTab] = useState("all");
  const active = TABS.find((t) => t.id === tab) || TABS[0];
  const items = SESSIONS.filter(active.filter);

  return (
    <div className={styles.sched}>
      <div className={styles.head}>
        <div>
          <p className={styles.title}>{TITLE}</p>
          <ul className={styles.chips} aria-label="Workshop at a glance">
            <li>9:30 AM to 6:00 PM</li>
            <li>{SESSIONS.length} sessions</li>
            <li className={styles.chipHot}>{handsOn} hands-on</li>
          </ul>
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Filter schedule">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={tab === t.id ? styles.tabOn : ""}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <ol className={styles.list} key={tab}>
        {items.map((s) => {
          const kind = s.kind || "learn";
          return (
            <li key={s.n} className={`${styles.item} ${styles[kind]}`}>
              <div className={styles.time}>
                <b>{s.start}</b>
                <span>to {s.end}</span>
              </div>
              <div className={styles.rail} aria-hidden="true"><i /></div>
              <div className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.num}>{s.n}</span>
                  {kind === "practical" && <span className={`${styles.tag} ${styles.tagHot}`}>Hands-on</span>}
                  {kind === "break" && <span className={`${styles.tag} ${styles.tagBreak}`}>Break</span>}
                  <span className={styles.dur}>{duration(s.mins)}</span>
                </div>
                <h4>{s.title}</h4>
                {s.desc && <p>{s.desc}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
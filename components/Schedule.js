import { agenda, agendaTitle } from "@/lib/data";

// Full-day schedule as numbered cards (same look as the "What you'll learn" list).
// wide = two columns on desktop (home page). Default = one column (workshop page).
export default function Schedule({ wide = false, compact = false }) {
  return (
    <div className={`schedule ${wide ? "wide" : ""} ${compact ? "compact" : ""}`}>
      <h3 className="schedule-title">{agendaTitle}</h3>
      <ol className="schedule-list">
        {agenda.map((a, i) => (
          <li key={a.time} className={a.rest ? "rest" : ""}>
            <span className="st-num">{i + 1}</span>
            <div className="st-body">
              <span className="st-time">{a.time}</span>
              <h4>{a.title}</h4>
              {a.desc && <p>{a.desc}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
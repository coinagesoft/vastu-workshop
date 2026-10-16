import { agenda, agendaTitle } from "@/lib/data";

// Home page schedule, option 2: "day at a glance" tiles grouped into three parts.
// Ranges are positions in the agenda list (0 = first session).
const parts = [
  { label: "Morning", span: "9:30 AM – 1:00 PM", from: 0, to: 7 },
  { label: "Afternoon", span: "1:00 – 4:15 PM", from: 7, to: 11 },
  { label: "Closing", span: "4:15 – 6:00 PM", from: 11, to: 13 },
];

export default function ScheduleGrid() {
  return (
    <div className="sgrid">
      <p className="sgrid-title">{agendaTitle}</p>
      {parts.map((p) => (
        <div key={p.label} className="sgrid-part">
          <div className="sgrid-head">
            <h3>{p.label}</h3>
            <span>{p.span}</span>
          </div>
          <ol className="sgrid-tiles">
            {agenda.slice(p.from, p.to).map((a, i) => (
              <li key={a.time} className={a.rest ? "rest" : ""}>
                <span className="sg-n" aria-hidden="true">{String(p.from + i + 1).padStart(2, "0")}</span>
                <span className="sg-time">{a.time}</span>
                <h4>{a.title}</h4>
                {a.desc && <p>{a.desc}</p>}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

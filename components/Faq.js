import { faqs } from "@/lib/data";
import P from "./Pending";

export default function Faq() {
  return (
    <div className="faq">
      {faqs.map((f) => (
        <details key={f.q}>
          <summary>{f.q}</summary>
          <p><P>{f.a}</P></p>
        </details>
      ))}
    </div>
  );
}

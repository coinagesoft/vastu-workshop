"use client";
import { useState } from "react";
import { faqs } from "@/lib/data";
import P from "./Pending";

// Accordion: only one answer is open at a time.
// Opening a question closes the previous one; clicking the open question closes it.
export default function Faq() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq">
      {faqs.map((f, i) => (
        <details key={f.q} open={openIndex === i}>
          <summary
            onClick={(e) => {
              e.preventDefault(); // we control open/close ourselves
              setOpenIndex(openIndex === i ? null : i);
            }}
          >
            {f.q}
          </summary>
          <p><P>{f.a}</P></p>
        </details>
      ))}
    </div>
  );
}
"use client";
// Drop-in replacement for components/Footer.js
// Self-contained: styles are included in this file (no CSS changes needed).
import Link from "next/link";
import { useState } from "react";
import { event, shortCopy } from "@/lib/data";
import P from "./Pending";

const wa = process.env.NEXT_PUBLIC_WHATSAPP;
const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(event.whatsappText)}` : "#";

// Replace the "#" links with your real social profiles.
const socials = [
  { label: "Facebook", href: "#", d: "M14 8h2V5h-2.2C11.4 5 10 6.5 10 8.7V10H8v3h2v7h3v-7h2.2l.5-3H13V8.9c0-.6.3-.9 1-.9z" },
  { label: "Instagram", href: "#", d: "M8 4h8a4 4 0 014 4v8a4 4 0 01-4 4H8a4 4 0 01-4-4V8a4 4 0 014-4zm4 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zm4.6-1.6a.9.9 0 100 1.8.9.9 0 000-1.8z" },
  { label: "YouTube", href: "#", d: "M20.5 8.2a2.4 2.4 0 00-1.7-1.7C17.3 6 12 6 12 6s-5.3 0-6.8.5A2.4 2.4 0 003.5 8.2C3 9.7 3 12 3 12s0 2.3.5 3.8a2.4 2.4 0 001.7 1.7C6.7 18 12 18 12 18s5.3 0 6.8-.5a2.4 2.4 0 001.7-1.7c.5-1.5.5-3.8.5-3.8s0-2.3-.5-3.8zM10.2 14.6V9.4l4.5 2.6z" },
  { label: "WhatsApp", href: waHref, d: "M12 4a8 8 0 00-6.9 12L4 20l4.1-1.1A8 8 0 1012 4zm4.2 11.2c-.2.5-1.1 1-1.6 1-.4.1-.9.1-2.9-.7-2.4-1-3.9-3.4-4-3.6-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.3.3.1.4.1.6-.1l.8-.9c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.2.1.8-.1 1.3z" },
];

const css = `
.fx{position:relative;background:linear-gradient(90deg,#2B7FFF 0%,#22A8C9 50%,#1ECB8F 100%);color:#fff;overflow:hidden;font-family:var(--f-body),system-ui,sans-serif}
.fx::before{content:"";position:absolute;inset:0;opacity:.35;pointer-events:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='500' fill='none' stroke='white' stroke-opacity='.22'%3E%3Cpath d='M-20 380C150 250 280 470 460 330S720 200 920 300'/%3E%3Cpath d='M-20 330C150 200 280 420 460 280S720 150 920 250'/%3E%3Cpath d='M-20 280C150 150 280 370 460 230S720 100 920 200'/%3E%3C/svg%3E");background-size:cover}
.fx-in{position:relative;width:min(100% - 40px,1100px);margin-inline:auto;padding:64px 0 40px}
.fx-top{display:flex;align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap;padding-bottom:30px;border-bottom:1px solid #ffffff40}
.fx-logo{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-family:var(--f-head),system-ui,sans-serif;font-weight:700;font-size:1.7rem;letter-spacing:-.02em}
.fx-follow{display:flex;align-items:center;gap:12px;font-weight:600;font-size:.95rem}
.fx-soc{display:flex;gap:8px}
.fx-soc a{display:grid;place-items:center;width:34px;height:34px;background:#fff;color:#1E80F2;border-radius:4px;transition:transform .15s}
.fx-soc a:hover{transform:translateY(-2px)}
.fx-grid{display:grid;grid-template-columns:1.5fr .8fr 1fr 1.4fr;gap:40px;padding-top:36px}
.fx h3{font-family:var(--f-head),system-ui,sans-serif;font-size:1.1rem;font-weight:600;color:#fff;margin:0 0 16px}
.fx p,.fx li,.fx a{font-size:.95rem;line-height:1.7;color:#ffffffe6}
.fx p{margin:0 0 10px;max-width:34ch}
.fx ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
.fx ul a{text-decoration:none}.fx ul a:hover,.fx p a:hover{text-decoration:underline}
.fx .pending{background:#ffffff26;color:#fff;border:1px dashed #fff9;border-radius:6px;padding:0 6px}
.fx-news{display:flex;background:#fff;border-radius:6px;padding:5px;margin-top:14px;max-width:360px}
.fx-news input{flex:1;min-width:0;border:0;outline:0;padding:10px 12px;font:inherit;font-size:.9rem;color:#1B1F2A;background:transparent}
.fx-news button{border:0;background:transparent;color:#1677FF;font:inherit;font-weight:600;padding:0 14px;cursor:pointer}
.fx-news:focus-within{outline:3px solid #FF6445}
.fx-ok{margin-top:14px;font-weight:600}
.fx-bar{background:#1E2124;color:#fff;text-align:center;padding:12px 20px;font-size:.8rem;font-weight:600;position:relative}
@media (max-width:900px){.fx-grid{grid-template-columns:1fr 1fr}}
@media (max-width:560px){.fx-grid{grid-template-columns:1fr}.fx-in{padding-top:48px}}
@media (prefers-reduced-motion:reduce){.fx-soc a{transition:none}}
`;

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function subscribe(e) {
    e.preventDefault();
    // TODO: send `email` to your mailing list / CRM.
    console.log("Newsletter signup:", email);
    setSent(true);
    setEmail("");
  }

  return (
    <footer className="fx">
      <style>{css}</style>
      <div className="fx-in">
        <div className="fx-top">
          <Link href="/" className="fx-logo">
            <svg width="30" height="26" viewBox="0 0 34 30" aria-hidden="true">
              <path d="M0 0h34v14C34 23 27 30 18 30H0z" fill="#fff" />
              <path d="M17 6l3 9-3 9-3-9z" fill="#2B8FE0" />
            </svg>
            DIYVastu
          </Link>
          <div className="fx-follow">
            <span>Follow Us</span>
            <div className="fx-soc">
              {socials.map((s) => (
                <a key={s.label} href={s.href} aria-label={s.label} target="_blank" rel="noopener noreferrer">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.d} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="fx-grid">
          <div>
            <h3>Contact</h3>
            <p><P>{event.venue}</P>, Maharashtra, India</p>
            <p>{event.dateLabel} | <P>{event.time}</P></p>
            <p><a href={waHref} target="_blank" rel="noopener noreferrer">Ask a question on WhatsApp</a></p>
          </div>

          <div>
            <h3>Pages</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/workshop">Workshop</Link></li>
              <li><Link href="/book">Book Seat</Link></li>
              <li><Link href="/#certificates">Certificates</Link></li>
              <li><Link href="/#testimonials">Testimonials</Link></li>
            </ul>
          </div>

          <div>
            <h3>Workshop</h3>
            <ul>
              <li><Link href="/workshop">What you&apos;ll learn</Link></li>
              <li><Link href="/workshop">How the day works</Link></li>
              <li><Link href="/workshop">What you take home</Link></li>
              <li><Link href="/workshop">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h3>Newsletter</h3>
            <p>Get seat alerts and updates on the next DIY Vastu Workshop.</p>
            {sent ? (
              <p className="fx-ok" role="status">Thanks! You&apos;re on the list.</p>
            ) : (
              <form className="fx-news" onSubmit={subscribe}>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" aria-label="Email address" />
                <button type="submit">Send</button>
              </form>
            )}
          </div>
        </div>
      </div>
      <div className="fx-bar">© 2026 DIY Vastu Workshop with {event.teacher}. All Rights Reserved. | {shortCopy.adHeadline}</div>
    </footer>
  );
}
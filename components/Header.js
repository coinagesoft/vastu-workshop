"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/workshop", label: "Workshop" },
  { href: "/#certificates", label: "Certificates" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/book", label: "Book Seat" },
];

export function Arrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 11L11 3M5 3h6v6" />
    </svg>
  );
}

export default function Header() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="wrap bar">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <svg width="34" height="30" viewBox="0 0 34 30" aria-hidden="true">
            <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: "var(--blue)" }} /><stop offset="1" style={{ stopColor: "var(--green)" }} /></linearGradient></defs>
            <path d="M0 0h34v14C34 23 27 30 18 30H0z" fill="url(#lg)" />
            <path d="M17 6l3 9-3 9-3-9z" fill="#fff" />
          </svg>
          <b>DIY<em>Vastu</em></b>
        </Link>
        <button className="menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
          <span /><span /><span />
        </button>
        <nav className={open ? "nav open" : "nav"}>
          {links.map((l) => (
            <Link key={l.label} href={l.href} className={path === l.href ? "active" : ""} onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <Link href="/book" className="btn blue" onClick={() => setOpen(false)}>Book Seat <Arrow /></Link>
        </nav>
      </div>
    </header>
  );
}
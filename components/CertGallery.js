"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CertGallery.module.css";

// Images live in /public/certificates/. Order = order shown in the scroller.
const CERTS = [
  
  { file: "04-vedhvidhi-vedic-vastu-adhyeta.jpg", title: "Vedic Vastu Adhyeta, Level 1", issuer: "Vedhvidhi", year: "2021" },
  { file: "03-designnopolis-vaastu-shastra.jpg", title: "Vaastu Shastra Course", issuer: "Designnopolis", year: "" },
  { file: "02-designers-class-residential-design.jpg", title: "Residential Design", issuer: "The Designer's Class", year: "2022" },
  { file: "12-ikigai-reiki-crystal-healing.jpg", title: "Crystal Healing, Basic Level", issuer: "India Reiki Foundation", year: "2020" },
  { file: "05-astrolok-numerology.jpg", title: "Learn Numerology, Part 1", issuer: "Astrolok (Udemy)", year: "2020" },
  { file: "10-harvard-hbx-credentials-of-readiness.jpg", title: "Credentials of Readiness", issuer: "Harvard Business School Online", year: "2018" },
  { file: "09-pune-university-mba.jpg", title: "MBA, International Business", issuer: "Savitribai Phule Pune University", year: "2016" },
  { file: "08-highgate-business-management.jpg", title: "PG Diploma, Business Management", issuer: "Highgate Academy, University of Sussex", year: "2010" },
  { file: "07-ibmi-problem-solving-skills.jpg", title: "Problem Solving Skills", issuer: "International Business Management Institute", year: "2020" },
  { file: "06-harappa-embracing-change.jpg", title: "Embracing Change", issuer: "Harappa", year: "2020" },
  { file: "13-pinnacle-vastu-siddhi-course.jpg", title: "Vastu Siddhi Course '24: Vastu Acharya", issuer: "Pinnacle Vastu, Rishikesh", year: "2024" },
  { file: "11-sahasra-mahavaastu-remedial-vaastu.jpg", title: "Remedial Vaastu Visharad Course", issuer: "Sahasra Mahavaastu, Pune", year: "2021" },
  { file: "01-shubh-sanket-maha-vastu.jpg", title: "Maha Vastu Course (A grade)", issuer: "Shubhsanket Maha Vastu", year: "2021" },
];

export default function CertGallery() {
  const track = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [bar, setBar] = useState({ left: 0, width: 100 });
  const [open, setOpen] = useState(null);

  const update = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    const width = Math.min(100, (el.clientWidth / el.scrollWidth) * 100);
    setBar({ width, left: max > 0 ? (el.scrollLeft / max) * (100 - width) : 0 });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  // Draggable / clickable scrollbar: click the line to jump, drag the blue thumb to scroll
  const barEl = useRef(null);
  const drag = useRef(null);

  function scrollToPointer(clientX, offset) {
    const el = track.current, b = barEl.current;
    if (!el || !b) return;
    const r = b.getBoundingClientRect();
    const thumb = (r.width * bar.width) / 100;
    const room = r.width - thumb;
    if (room <= 0) return;
    const pos = Math.min(Math.max(clientX - r.left - offset, 0), room);
    el.scrollLeft = (pos / room) * (el.scrollWidth - el.clientWidth);
  }
  function onBarDown(e) {
    const r = barEl.current.getBoundingClientRect();
    const thumb = (r.width * bar.width) / 100;
    const thumbLeft = (r.width * bar.left) / 100;
    const x = e.clientX - r.left;
    const onThumb = x >= thumbLeft && x <= thumbLeft + thumb;
    drag.current = { offset: onThumb ? x - thumbLeft : thumb / 2 };
    e.currentTarget.setPointerCapture(e.pointerId);
    scrollToPointer(e.clientX, drag.current.offset);
  }
  function onBarMove(e) { if (drag.current) scrollToPointer(e.clientX, drag.current.offset); }
  function onBarUp() { drag.current = null; }

  function move(dir) {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * Math.max(320, el.clientWidth * 0.8), behavior: "smooth" });
  }

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + CERTS.length) % CERTS.length)), []);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close, step]);

  const cur = open === null ? null : CERTS[open];

  return (
    <div className={styles.wrap}>
      <button type="button" className={`${styles.arrow} ${styles.aPrev}`} aria-label="Previous certificates" disabled={!canPrev} onClick={() => move(-1)}>&larr;</button>
      <button type="button" className={`${styles.arrow} ${styles.aNext}`} aria-label="More certificates" disabled={!canNext} onClick={() => move(1)}>&rarr;</button>

      <div id="cert-track" className={styles.track} ref={track} onScroll={update} tabIndex={0} aria-label="Certificates, scroll sideways">
        {CERTS.map((c, i) => (
          <figure key={c.file} className={styles.cert}>
            <button type="button" className={styles.frame} onClick={() => setOpen(i)} aria-label={`View certificate: ${c.title}`}>
              <img src={`/certificates/${c.file}`} alt={`${c.title}, ${c.issuer}`} loading="lazy" draggable="false" />
            </button>
            <figcaption>
              <strong>{c.title}</strong>
              <span>{c.issuer}{c.year ? `, ${c.year}` : ""}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <div
        className={styles.progress}
        ref={barEl}
        role="scrollbar"
        aria-orientation="horizontal"
        aria-controls="cert-track"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(bar.width < 100 ? (bar.left / (100 - bar.width)) * 100 : 0)}
        onPointerDown={onBarDown}
        onPointerMove={onBarMove}
        onPointerUp={onBarUp}
        onPointerCancel={onBarUp}
      >
        <i style={{ width: `${bar.width}%`, left: `${bar.left}%` }} />
      </div>

      {cur && (
        <div className={styles.lb} role="dialog" aria-modal="true" aria-label={cur.title} onClick={close}>
          <button type="button" className={styles.x} onClick={close} aria-label="Close">&times;</button>
          <button type="button" className={`${styles.nav} ${styles.prev}`} onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous certificate">&larr;</button>
          <figure className={styles.big} onClick={(e) => e.stopPropagation()}>
            <img src={`/certificates/${cur.file}`} alt={`${cur.title}, ${cur.issuer}`} />
            <figcaption>{cur.title} &middot; {cur.issuer}{cur.year ? `, ${cur.year}` : ""}</figcaption>
          </figure>
          <button type="button" className={`${styles.nav} ${styles.next}`} onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next certificate">&rarr;</button>
        </div>
      )}
    </div>
  );
}
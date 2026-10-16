"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./CertGallery.module.css";

// Images live in /public/certificates_new/. Order = order shown in the scroller.
const CERTS = [
  { file: "10_Vedhvidhi_Vedic_Vastu.jpg", title: "Vedic Vastu Adhyeta, Level 1", issuer: "Vedhvidhi", year: "2021" },
  { file: "01_Three_Pillars_Celestial_Secrets.jpg", title: "Celestial Secrets, Certificate of Achievement", issuer: "Three Pillars", year: "2025" },
  { file: "08_Counselling_Master_Course.jpg", title: "Counselling Master Course, Advanced", issuer: "12-month programme", year: "2024" },
  { file: "05_IBM_Problem_Solving_Skills.jpg", title: "Problem Solving Skills", issuer: "International Business Management Institute", year: "2020" },
  { file: "06_Google_Digital_Marketing.jpg", title: "Fundamentals of Digital Marketing", issuer: "Google Digital Garage", year: "2020" },
  { file: "03_Sahasra_Astro_Vaastu_Visharad.jpg", title: "Astro-Vaastu Visharad Course", issuer: "Sahasra Mahavaastu, Pune", year: "2022" },
  { file: "07_Sahasra_Remedial_Vaastu_Visharad.jpg", title: "Remedial Vaastu Visharad Course", issuer: "Sahasra Mahavaastu, Pune", year: "2021" },
  { file: "09_Vastu_Raviraj_Skill_Development.jpg", title: "Vastushastra Skill Development Course", issuer: "Vastu Raviraj, Thane", year: "2021" },
  { file: "13_MahaVastu_Course.jpg", title: "MahaVastu Course (A grade)", issuer: "Shubha Sanket MahaVastu", year: "2021" },
  
  { file: "02_Designers_Class_Interior_Design.jpg", title: "Introduction to Interior Design", issuer: "The Designer's Class", year: "2023" },
  { file: "11_SPPU_MBA.jpg", title: "Master of Business Administration", issuer: "Savitribai Phule Pune University", year: "2012" },
  { file: "04_HBX_Business_Analytics.jpg", title: "Business Analytics", issuer: "Harvard Business School (HBX)", year: "2018" },
  { file: "12_HBS_Leadership_Management.jpg", title: "Specialization in Leadership and Management", issuer: "Harvard Business School Online", year: "2022" },
  
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
              <img src={`/certificates_new/${c.file}`} alt={`${c.title}, ${c.issuer}`} loading="lazy" draggable="false" />
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
            <img src={`/certificates_new/${cur.file}`} alt={`${cur.title}, ${cur.issuer}`} />
            <figcaption>{cur.title} &middot; {cur.issuer}{cur.year ? `, ${cur.year}` : ""}</figcaption>
          </figure>
          <button type="button" className={`${styles.nav} ${styles.next}`} onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next certificate">&rarr;</button>
        </div>
      )}
    </div>
  );
}
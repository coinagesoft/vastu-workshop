import Link from "next/link";
import Countdown from "@/components/Countdown";
import CompassWheel from "@/components/CompassWheel";
import VideoCard from "@/components/VideoCard";
import * as V from "@/components/VastuIcons";
import P from "@/components/Pending";
import { Arrow } from "@/components/Header";
import {
  event, problem, learn, agenda, agendaNote, teacher, certificates,
  videoTestimonials, tickets, depositText, closing, inr,
} from "@/lib/data";

const wa = process.env.NEXT_PUBLIC_WHATSAPP;
const waHref = wa ? `https://wa.me/${wa}?text=${encodeURIComponent(event.whatsappText)}` : "#";

const learnIcons = [V.compass(), V.elements5(), V.defect(), V.diya(), V.houseCheck()];
const statIcons = [V.sunrise(), V.zones16(), V.elements5()];

function Eyebrow({ children }) { return <p className="eyebrow"><i />{children}</p>; }
function Squiggle() {
  return (
    <svg className="squiggle" width="110" height="46" viewBox="0 0 110 46" fill="none" style={{ stroke: "var(--green)" }} strokeWidth="9" strokeLinecap="round" aria-hidden="true">
      <path d="M6 30c6-24 14-24 18-4s12 20 20-6 12-24 20-4 12 20 20-4" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow light"><i /><span>{event.dateLabel} | <P>{event.venue}</P> | <P>{event.time}</P></span></p>
            <h1>{event.headline}<br />{event.headline2}</h1>
            <Countdown to={event.start} />
            <p className="lead">{event.subtitle}</p>
            <div className="actions">
              <Link href="/book" className="btn coral">Reserve My Seat <Arrow /></Link>
              <a href={waHref} className="btn white" target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
            </div>
            <p className="note">Limited to <P>{event.seats}</P> seats. {event.bring}</p>
          </div>

          <div className="hero-art">
            <div className="blob"><CompassWheel className="wheel" /></div>
          </div>
        </div>
      </section>

      {/* ABOUT / PROBLEM */}
      <section className="section about">
        <div className="wrap about-grid">
          <div>
            <Eyebrow>The problem</Eyebrow>
            <h2>What if you could <span className="g">understand it yourself?</span></h2>
            <p className="body-lg">{problem.text}</p>
            <Link href="/workshop" className="btn blue">See what happens on the day <Arrow /></Link>
          </div>
          <div className="stat-list">
            {[
              ["1", "Day, Hands-on", statIcons[0], "green"],
              ["16", "Zones explained", statIcons[1], "blue"],
              ["5", "Elements in your space", statIcons[2], "coral"],
            ].map(([n, label, icon, color]) => (
              <div key={label} className="stat-card">
                <span className={`ico ${color}`}>{icon}</span>
                <div><b>{n}</b><span>{label}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEARN */}
      <section className="section tint">
        <div className="wrap">
          <p className="eyebrow c"><i />What you&apos;ll learn</p>
          <h2 className="center">In one day, you will <span className="g">learn how to</span></h2>
          <div className="why">
            {learn.map((l, i) => (
              <div key={l} className="why-card">
                <span className={`ico ${["green", "blue", "coral"][i % 3]}`}>{learnIcons[i]}</span>
                <p>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section className="section">
        <div className="wrap">
          <Eyebrow>Schedule</Eyebrow>
          <h2>How the <span className="g">day works</span></h2>
          <ol className="timeline">
            {agenda.map((a) => (
              <li key={a.session}><h3>{a.session}</h3><p>{a.what}</p></li>
            ))}
          </ol>
          <p className="muted"><P>{agendaNote}</P></p>
        </div>
      </section>

      {/* TEACHER */}
      <section className="section tint">
        <div className="wrap teacher">
          <div className="portrait">
            {(teacher.photo || "/Shilratna-shilwant.webp") ? <img src={teacher.photo || "/Shilratna-shilwant.webp"} alt={event.teacher} /> : <span className="initials">AS</span>}
          </div>
          <div>
            <Eyebrow>Meet your teacher</Eyebrow>
            <h2>{event.teacher}</h2>
            <p className="body-lg">{teacher.bio}</p>
            <div className="tstats">
              {teacher.stats.map((s) => (<div key={s.l}><b>{s.n}</b><span>{s.l}</span></div>))}
            </div>
          </div>
        </div>
      </section>

      {/* CERTIFICATES */}
      <section id="certificates" className="section">
        <div className="wrap">
          <Eyebrow>Credentials</Eyebrow>
          <h2>Certificates and <span className="g">recognition</span></h2>
          <div className="certs">
            {certificates.map((c, i) => (
              <figure key={i} className="cert">
                <div className="cert-frame">
                  {c.image ? <img src={c.image} alt={c.title} /> : <div className="cert-mock"><small>Certificate of Completion</small><b>{c.title}</b><span>{c.issuer}</span><i className="seal" /></div>}
                </div>
                <figcaption>
                  <strong><P>{c.title}</P></strong>
                  <span><P>{`${c.issuer}, ${c.year}`}</P></span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* VIDEO TESTIMONIALS */}
      <section id="testimonials" className="section tint">
        <div className="wrap">
          <Eyebrow>Video testimonials</Eyebrow>
          <h2>Hear it from people <span className="g">who learned it</span></h2>
          <div className="videos">
            {videoTestimonials.map((v, i) => (<VideoCard key={i} {...v} />))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {/* COMPLETION CERTIFICATE */}
      <section className="section about">
        <div className="wrap two-col cert-show">
          <div>
            <Eyebrow>Your certificate</Eyebrow>
            <h2>Leave with a <span className="g">certificate of participation</span></h2>
            <p className="body-lg">Every participant receives a certificate for completing the One Day Practical Home Vastu Workshop, signed by {event.teacher}.</p>
            <ul className="learn small">
              <li>Awarded to each participant at the end of the workshop</li>
              <li>Issued in your name, with the workshop date and venue</li>
              <li>Yours to keep, frame or share</li>
            </ul>
          </div>
          <figure className="cert-img">
            <img src="/completion%20certificate.jpeg" alt="Vedratnna certificate of participation, One Day Practical Home Vastu Workshop" loading="lazy" />
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Eyebrow>Pricing</Eyebrow>
          <h2>Choose your <span className="g">ticket</span></h2>
          <div className="tickets">
            {tickets.map((t) => (
              <div key={t.id} className={`ticket ${t.id === "regular" ? "feature" : ""}`}>
                <h3>{t.name}</h3>
                <p className="mrp"><s>{inr(t.mrp)}</s></p>
                <p className="price">{inr(t.price)}</p>
                <p className="save-chip">Save {inr(t.mrp - t.price)}</p>
                <p className="muted" style={{fontSize:"16.8px"}}><P>{t.note || "1 person"}</P></p>
                <Link href="/book" className={`btn full ${t.id === "regular" ? "coral" : "blue"}`}>Reserve My Seat <Arrow /></Link>
              </div>
            ))}
          </div>
          <p className="muted center">{depositText}</p>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section className="cta">
        <div className="wrap narrow center">
          <p className="note"><P>{closing.line1}</P></p>
          <h2>{closing.line2}</h2>
          <div className="actions center">
            <Link href="/book" className="btn coral">Reserve My Seat <Arrow /></Link>
            <a href={waHref} className="btn white" target="_blank" rel="noopener noreferrer">Ask a Question on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
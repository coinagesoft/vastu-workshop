"use client";
import { useEffect, useState } from "react";
import { tickets, deposit, depositText, event, inr } from "@/lib/data";
import P from "./Pending";

// Early bird stays open through 20 Oct (ends at midnight IST)
const EARLY_END = new Date("2026-10-21T00:00:00+05:30").getTime();

export default function BookingForm() {
  const [earlyOpen, setEarlyOpen] = useState(true);
  const [ticket, setTicket] = useState("regular");
  const [pay, setPay] = useState("deposit");
  const [form, setForm] = useState({ name: "", email: "", phone: "", guest: "", city: "", note: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    const open = Date.now() < EARLY_END;
    setEarlyOpen(open);
    if (open) setTicket("early");
  }, []);

  const t = tickets.find((x) => x.id === ticket);
  const payNow = pay === "deposit" ? deposit : t.price;
  const balance = t.price - payNow;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ticket: t.id, payNow, total: t.price }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setStatus("done");
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "done") {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP;
    const msg = `Hi, I'm ${form.name}. I reserved a ${t.name} ticket (${inr(t.price)}) for the DIY Vastu Workshop on 1 November. Please share the payment details.`;
    return (
      <div className="panel done">
        <h2>Seat request received</h2>
        <p>Thank you, {form.name}. We will contact you on {form.phone} to confirm your seat and share the payment link for {inr(payNow)}.</p>
        {wa && <a className="btn coral" href={`https://wa.me/${wa}?text=${encodeURIComponent(msg)}`} target="_blank" rel="noopener noreferrer">Confirm on WhatsApp</a>}
      </div>
    );
  }

  return (
    <form className="booking" onSubmit={submit}>
      <div className="panel">
        <h2>1. Choose your ticket</h2>
        <div className="ticket-pick" role="radiogroup" aria-label="Ticket">
          {tickets.map((x) => {
            const disabled = x.id === "early" && !earlyOpen;
            return (
              <label key={x.id} className={`pick ${ticket === x.id ? "on" : ""} ${disabled ? "off" : ""}`}>
                <input type="radio" name="ticket" value={x.id} checked={ticket === x.id} disabled={disabled} onChange={() => setTicket(x.id)} />
                <span className="pn">{x.name}</span>
                <span className="pp"><s className="pp-old">{inr(x.mrp)}</s> {inr(x.price)}</span>
                <span className="pm"><P>{disabled ? "Early bird has ended" : x.note || "1 person"}</P></span>
              </label>
            );
          })}
        </div>

        <h2>2. Your details</h2>
        <div className="fields">
          <label>Full name<input required value={form.name} onChange={set("name")} autoComplete="name" /></label>
          <label>Phone (WhatsApp)<input required type="tel" inputMode="tel" pattern="[0-9+\s\-]{10,15}" value={form.phone} onChange={set("phone")} autoComplete="tel" /></label>
          <label>Email<input required type="email" value={form.email} onChange={set("email")} autoComplete="email" /></label>
          <label>City<input value={form.city} onChange={set("city")} autoComplete="address-level2" /></label>
          {t.people === 2 && <label className="wide">Second attendee&apos;s name<input required value={form.guest} onChange={set("guest")} /></label>}
          <label className="wide">Anything you want covered? (optional)<textarea rows="3" value={form.note} onChange={set("note")} placeholder="e.g. south-west facing flat, planning a renovation" /></label>
        </div>

        <h2>3. Payment</h2>
        <div className="ticket-pick two">
          <label className={`pick ${pay === "deposit" ? "on" : ""}`}>
            <input type="radio" name="pay" checked={pay === "deposit"} onChange={() => setPay("deposit")} />
            <span className="pn">Pay {inr(deposit)} now</span>
            <span className="pm">Balance later</span>
          </label>
          <label className={`pick ${pay === "full" ? "on" : ""}`}>
            <input type="radio" name="pay" checked={pay === "full"} onChange={() => setPay("full")} />
            <span className="pn">Pay in full</span>
            <span className="pm">{inr(t.price)}</span>
          </label>
        </div>
        <p className="muted">{depositText}</p>
      </div>

      <aside className="panel summary">
        <h2>Your booking</h2>
        <dl>
          <dt>Workshop</dt><dd>{event.name}</dd>
          <dt>Date</dt><dd>{event.dateLabel}</dd>
          <dt>Venue</dt><dd><P>{event.venue}</P></dd>
          <dt>Time</dt><dd><P>{event.time}</P></dd>
          <dt>Ticket</dt><dd>{t.name}</dd>
          <dt>Total</dt><dd>{inr(t.price)}</dd>
          <dt>Pay now</dt><dd><b>{inr(payNow)}</b></dd>
          {balance > 0 && (<><dt>Balance</dt><dd>{inr(balance)}</dd></>)}
        </dl>
        {error && <p className="error" role="alert">{error}</p>}
        <button className="btn coral full" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Reserve my seat"}</button>
        <p className="muted small">Limited to <P>{event.seats}</P> seats. {event.bring}</p>
      </aside>
    </form>
  );
}
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
  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    const open = Date.now() < EARLY_END;
    setEarlyOpen(open);
    if (open) setTicket("early");
  }, []);

  const t = tickets.find((x) => x.id === ticket);
  const payNow = pay === "deposit" ? deposit : t.price;
  const balance = t.price - payNow;
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function loadCheckout() {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) return resolve();
      const el = document.createElement("script");
      el.src = "https://checkout.razorpay.com/v1/checkout.js";
      el.onload = resolve;
      el.onerror = () => reject(new Error("Could not load the payment window. Check your connection and try again."));
      document.body.appendChild(el);
    });
  }

  async function submit(e) {
    e.preventDefault();
    setError("");
    setStatus("loading");
    try {
      await loadCheckout();
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, ticket: t.id, pay }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        ...(data.orderId ? { order_id: data.orderId } : {}),
        name: "DIY Vastu Workshop",
        description: `${t.name} ticket, ${event.dateLabel}`,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        notes: { ticket: t.id },
        theme: { color: "#e8590c" },
        modal: { ondismiss: () => setStatus("idle") },
        handler: async (r) => {
          if (!data.orderId) {
            // test-only mode: no secret, so no signature check
            setPaymentId(r.razorpay_payment_id);
            setStatus("done");
            return;
          }
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(r),
            });
            const vd = await v.json();
            if (!v.ok) throw new Error(vd.error || "Payment could not be verified.");
            setPaymentId(r.razorpay_payment_id);
            setStatus("done");
          } catch (err) {
            setError(`${err.message} If money was deducted, contact us with payment ID ${r.razorpay_payment_id}.`);
            setStatus("idle");
          }
        },
      });
      rzp.on("payment.failed", (resp) => {
        setError(resp?.error?.description || "Payment failed. Please try again.");
        setStatus("idle");
      });
      rzp.open();
    } catch (err) {
      setError(err.message);
      setStatus("idle");
    }
  }

  if (status === "done") {
    const wa = process.env.NEXT_PUBLIC_WHATSAPP;
    const msg = `Hi, I'm ${form.name}. I booked a ${t.name} ticket (${inr(t.price)}) and paid ${inr(payNow)} for the DIY Vastu Workshop on 1 November. My payment ID is ${paymentId}.`;
    return (
      <div className="panel done">
        <h2>Payment successful. Your seat is booked!</h2>
        <p>Thank you, {form.name}. We received {inr(payNow)} (payment ID: {paymentId}).{balance > 0 ? ` The balance of ${inr(balance)} can be paid later.` : ""} We will contact you on {form.phone} with the final details.</p>
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
        <button className="btn coral full" disabled={status === "loading"}>{status === "loading" ? "Opening payment…" : `Pay ${inr(payNow)} & reserve`}</button>
        <p className="muted small">Limited to <P>{event.seats}</P> seats. {event.bring}</p>
      </aside>
    </form>
  );
}
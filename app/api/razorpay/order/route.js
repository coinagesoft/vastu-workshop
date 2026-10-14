import { NextResponse } from "next/server";
import { tickets, deposit } from "@/lib/data";
import { rzpRequest, razorpayKeys } from "@/lib/razorpay";
import { savePending } from "@/lib/sheets";

export const runtime = "nodejs";

// Early bird stays open through 20 Oct 2026 (IST). Keep in sync with components/BookingForm.js
const EARLY_END = new Date("2026-10-21T00:00:00+05:30").getTime();

// Creates a Razorpay order. The amount is calculated here on the server,
// so the browser cannot change the price.
export async function POST(req) {
  try {
    const b = await req.json();
    if (!b.name || !b.email || !b.phone || !b.ticket) {
      return NextResponse.json({ error: "Please fill in your name, phone and email." }, { status: 400 });
    }
    const t = tickets.find((x) => x.id === b.ticket);
    if (!t) return NextResponse.json({ error: "Invalid ticket." }, { status: 400 });
    if (t.id === "early" && Date.now() >= EARLY_END) {
      return NextResponse.json({ error: "The early bird offer has ended. Please choose another ticket." }, { status: 400 });
    }
    if (t.people === 2 && !b.guest) {
      return NextResponse.json({ error: "Please enter the second attendee's name." }, { status: 400 });
    }

    const payFull = b.pay === "full";
    const payNow = payFull ? t.price : Math.min(deposit, t.price);

    // TEST-ONLY fallback: no secret configured, so open Checkout with just the Key ID.
    // No server-side order or signature check happens in this mode.
    if (process.env.RAZORPAY_KEY_ID && !process.env.RAZORPAY_KEY_SECRET) {
      return NextResponse.json({
        keyId: process.env.RAZORPAY_KEY_ID,
        orderId: null,
        amount: payNow * 100,
        currency: "INR",
        payNow,
        total: t.price,
      });
    }

    const { keyId } = razorpayKeys();

    const order = await rzpRequest("/orders", {
      method: "POST",
      body: JSON.stringify({
        amount: payNow * 100, // paise
        currency: "INR",
        receipt: `vastu_${Date.now()}`.slice(0, 40),
        notes: {
          name: String(b.name).slice(0, 100),
          email: String(b.email).slice(0, 100),
          phone: String(b.phone).slice(0, 20),
          city: String(b.city || "").slice(0, 100),
          guest: String(b.guest || "").slice(0, 100),
          note: String(b.note || "").slice(0, 200),
          ticket: t.id,
          total: String(t.price),
          paid_now: String(payNow),
          balance: String(t.price - payNow),
        },
      }),
    });

    // Save the registration as "pending" so it shows in the admin panel even if payment is not completed.
    // A database problem must never block the payment, so it is only logged.
    try {
      await savePending({
        orderId: order.id,
        name: b.name, email: b.email, phone: b.phone, city: b.city, guest: b.guest, note: b.note,
        ticket: t.id, total: t.price, paidNow: payNow, balance: t.price - payNow,
      });
    } catch (e) {
      console.error("Sheet savePending error:", e.message);
    }

    return NextResponse.json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      payNow,
      total: t.price,
    });
  } catch (err) {
    console.error("Razorpay order error:", err);
    return NextResponse.json({ error: err.message || "Could not start the payment." }, { status: 500 });
  }
}
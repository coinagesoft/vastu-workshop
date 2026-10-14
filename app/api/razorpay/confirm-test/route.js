import { NextResponse } from "next/server";
import { tickets, deposit } from "@/lib/data";
import { sendConfirmation } from "@/lib/notify";
import { markPaid } from "@/lib/sheets";

export const runtime = "nodejs";

// LOCAL TESTING ONLY. Used when RAZORPAY_KEY_SECRET is not set, so the payment cannot be
// verified. It is disabled in production and whenever a secret exists, because anyone could
// otherwise call it and make your MSG91 account send messages.
export async function POST(req) {
  if (process.env.NODE_ENV === "production" || process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Not available." }, { status: 404 });
  }
  try {
    const b = await req.json();
    const t = tickets.find((x) => x.id === b.ticket);
    if (!t || !b.name || !b.paymentId) return NextResponse.json({ error: "Bad request." }, { status: 400 });
    const paidNow = b.pay === "full" ? t.price : Math.min(deposit, t.price);
    // Local testing: store the booking so it appears in the admin panel.
    try {
      await markPaid({
        orderId: null,
        paymentId: String(b.paymentId),
        name: b.name, email: b.email, phone: b.phone, city: b.city, guest: b.guest, note: b.note,
        ticket: t.id, total: t.price, paidNow, balance: t.price - paidNow,
      });
    } catch (e) {
      console.error("Sheet markPaid (test) error:", e.message);
    }
    await sendConfirmation({
      name: String(b.name).slice(0, 100),
      email: String(b.email || ""),
      phone: String(b.phone || ""),
      ticket: t.id,
      paid_now: paidNow,
      balance: t.price - paidNow,
      paymentId: String(b.paymentId),
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("confirm-test error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
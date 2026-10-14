import { NextResponse } from "next/server";
import { tickets, deposit } from "@/lib/data";
import { sendConfirmation } from "@/lib/notify";
import { markPaid } from "@/lib/sheets";

export const runtime = "nodejs";

// TEST-ONLY confirmation, used while RAZORPAY_KEY_SECRET is not set (payment cannot be verified).
// - On your own computer (npm run dev) it is always available.
// - On Vercel it stays OFF unless you set ALLOW_TEST_CONFIRM=true AND the Razorpay key is a test key
//   (rzp_test_...). It is never available once RAZORPAY_KEY_SECRET is set.
// While it is on, anyone who knows the URL could add fake rows or trigger MSG91 messages,
// so use it for testing only and remove ALLOW_TEST_CONFIRM before going live.
function testConfirmAllowed(env = process.env) {
  if (env.RAZORPAY_KEY_SECRET) return false;
  if (env.NODE_ENV !== "production") return true;
  return env.ALLOW_TEST_CONFIRM === "true" && String(env.RAZORPAY_KEY_ID || "").startsWith("rzp_test_");
}

export async function POST(req) {
  if (!testConfirmAllowed()) {
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
import { NextResponse } from "next/server";
import { rzpRequest, verifySignature } from "@/lib/razorpay";
import { sendConfirmation } from "@/lib/notify";
import { markPaid } from "@/lib/sheets";

export const runtime = "nodejs";

// Confirms the payment signature after checkout. Only a verified payment counts as a booking.
export async function POST(req) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment details." }, { status: 400 });
    }
    if (!verifySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
      return NextResponse.json({ error: "Payment could not be verified." }, { status: 400 });
    }

    // Trusted booking details come from the order we created, not from the browser.
    const order = await rzpRequest(`/orders/${razorpay_order_id}`);

    // The console line stays as a backup record in case the database is down.
    console.log("PAID booking:", { paymentId: razorpay_payment_id, orderId: razorpay_order_id, ...order.notes });

    // Store the booking in the Google Sheet (the admin panel reads from here).
    try {
      const n = order.notes || {};
      await markPaid({
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        name: n.name, email: n.email, phone: n.phone, city: n.city, guest: n.guest, note: n.note,
        ticket: n.ticket, total: n.total, paidNow: n.paid_now, balance: n.balance,
      });
    } catch (e) {
      console.error("Sheet markPaid error:", e.message);
    }

    // Confirmation by SMS / email / WhatsApp (channels without env settings are skipped).
    await sendConfirmation({ ...order.notes, paymentId: razorpay_payment_id }).catch((e) =>
      console.error("Confirmation error:", e.message)
    );

    return NextResponse.json({ ok: true, paymentId: razorpay_payment_id });
  } catch (err) {
    console.error("Razorpay verify error:", err);
    return NextResponse.json({ error: err.message || "Could not verify the payment." }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { rzpRequest, verifySignature } from "@/lib/razorpay";
import { sendConfirmation } from "@/lib/notify";

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

    // TODO: store this booking (email, Google Sheet, CRM, database) before going live.
    console.log("PAID booking:", { paymentId: razorpay_payment_id, orderId: razorpay_order_id, ...order.notes });

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
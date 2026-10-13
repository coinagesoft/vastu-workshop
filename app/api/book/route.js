import { NextResponse } from "next/server";

// Receives seat requests. Replace the console.log with your own storage,
// email, Google Sheet, CRM or payment-gateway call.
export async function POST(req) {
  try {
    const b = await req.json();
    if (!b.name || !b.email || !b.phone || !b.ticket) {
      return NextResponse.json({ error: "Please fill in your name, phone and email." }, { status: 400 });
    }
    console.log("New seat request:", b);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Could not read the request." }, { status: 400 });
  }
}

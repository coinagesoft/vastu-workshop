import crypto from "crypto";

const API = "https://api.razorpay.com/v1";

export function razorpayKeys() {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error("Razorpay keys are not configured on the server.");
  return { keyId, keySecret };
}

function authHeader() {
  const { keyId, keySecret } = razorpayKeys();
  return "Basic " + Buffer.from(`${keyId}:${keySecret}`).toString("base64");
}

export async function rzpRequest(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: authHeader() },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.description || "Razorpay request failed.");
  return data;
}

// Checks the signature Razorpay returns after a successful payment.
export function verifySignature(orderId, paymentId, signature) {
  const { keySecret } = razorpayKeys();
  const expected = crypto.createHmac("sha256", keySecret).update(`${orderId}|${paymentId}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature || ""));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
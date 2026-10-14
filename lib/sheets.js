import crypto from "crypto";
import { tickets } from "@/lib/data";

// Saves registrations into a Google Sheet using a service account.
// No extra npm package is needed: it signs the Google login token with Node's built-in crypto.
//
// Column order (A to P): Created, Order ID, Payment ID, Status, Name, Email, Phone, City,
// Second attendee, Note, Ticket, People, Total, Paid now, Balance, Paid at.

const SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const TAB = () => process.env.GOOGLE_SHEET_TAB || "Registrations";
const HEADERS = [
  "Created (UTC)", "Order ID", "Payment ID", "Status", "Name", "Email", "Phone", "City",
  "Second attendee", "Note", "Ticket", "People", "Total", "Paid now", "Balance", "Paid at (UTC)",
];

let tokenCache = { token: "", exp: 0 };
let headerChecked = false;

async function getToken() {
  if (tokenCache.token && tokenCache.exp > Date.now() + 60_000) return tokenCache.token;
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!email || !key || !process.env.GOOGLE_SHEET_ID) {
    throw new Error("Google Sheet settings are missing (GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_SHEET_ID).");
  }
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned =
    b64({ alg: "RS256", typ: "JWT" }) + "." +
    b64({ iss: email, scope: SCOPE, aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 });
  const signature = crypto.createSign("RSA-SHA256").update(unsigned).sign(key).toString("base64url");
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${signature}` }),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error_description || data.error || "Google sign-in failed.");
  tokenCache = { token: data.access_token, exp: Date.now() + (data.expires_in || 3600) * 1000 };
  return tokenCache.token;
}

async function sheetsApi(path, { method = "GET", body } = {}) {
  const token = await getToken();
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error?.message || `Google Sheets request failed (${res.status}).`);
  return data;
}

const range = (r) => encodeURIComponent(`'${TAB()}'!${r}`);

// Writes the header row the first time, if row 1 is empty.
async function ensureHeader() {
  if (headerChecked) return;
  const d = await sheetsApi(`/values/${range("A1:P1")}`);
  if (!d.values || !d.values.length) {
    await sheetsApi(`/values/${range("A1:P1")}?valueInputOption=RAW`, { method: "PUT", body: { values: [HEADERS] } });
  }
  headerChecked = true;
}

const clip = (v, n) => String(v ?? "").slice(0, n);
const peopleFor = (ticketId) => tickets.find((t) => t.id === ticketId)?.people || 1;
const num = (v) => Number(v) || 0;

function rowFor(f, status, paidAt) {
  return [
    new Date().toISOString(), f.orderId || "", f.paymentId || "", status,
    clip(f.name, 100), clip(f.email, 150), clip(f.phone, 25), clip(f.city, 100),
    clip(f.guest, 100), clip(f.note, 255), clip(f.ticket, 20), peopleFor(f.ticket),
    num(f.total), num(f.paidNow), num(f.balance), paidAt || "",
  ];
}

async function appendRow(row) {
  await sheetsApi(`/values/${range("A:P")}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
    method: "POST",
    body: { values: [row] },
  });
}

// Called when the Razorpay order is created: the person filled the form but has not paid yet.
export async function savePending(f) {
  await ensureHeader();
  await appendRow(rowFor(f, "pending"));
}

// Called after the payment is verified: marks the pending row as paid, or adds a full paid row.
export async function markPaid(f) {
  await ensureHeader();
  const d = await sheetsApi(`/values/${range("B:C")}`);
  const rows = d.values || [];
  const idx = rows.findIndex((r, i) => i > 0 && ((f.orderId && r[0] === f.orderId) || (f.paymentId && r[1] === f.paymentId)));
  const paidAt = new Date().toISOString();
  if (idx === -1) {
    await appendRow(rowFor(f, "paid", paidAt));
    return;
  }
  const n = idx + 1; // sheet row number
  await sheetsApi(`/values:batchUpdate`, {
    method: "POST",
    body: {
      valueInputOption: "RAW",
      data: [
        { range: `'${TAB()}'!C${n}:D${n}`, values: [[clip(f.paymentId, 64), "paid"]] },
        { range: `'${TAB()}'!P${n}`, values: [[paidAt]] },
      ],
    },
  });
}

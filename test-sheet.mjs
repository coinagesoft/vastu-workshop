// Checks the Google Sheet connection step by step and prints the exact problem.
// Put this file in the Vastu project folder (next to .env.local) and run:
//     node test-sheet.mjs
import crypto from "crypto";
import fs from "fs";

// --- read .env.local (or .env) ---
const file = [".env.local", ".env"].find((f) => fs.existsSync(f));
if (!file) {
  console.log("FAIL: no .env.local file found in this folder. It must sit next to package.json and be named exactly .env.local");
  process.exit(1);
}
const env = {};
for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)$/);
  if (!m) continue;
  let v = m[2].trim();
  if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
  env[m[1]] = v;
}
console.log(`Reading ${file}`);

const missing = ["GOOGLE_SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY"].filter((k) => !env[k]);
if (missing.length) {
  console.log("FAIL: these lines are missing or empty in", file + ":", missing.join(", "));
  process.exit(1);
}
const ID = env.GOOGLE_SHEET_ID.trim();
const TAB = (env.GOOGLE_SHEET_TAB || "Registrations").trim();
const EMAIL = env.GOOGLE_SERVICE_ACCOUNT_EMAIL.trim();
const KEY = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

// --- 1. sign in ---
let token;
try {
  const now = Math.floor(Date.now() / 1000);
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
  const unsigned =
    b64({ alg: "RS256", typ: "JWT" }) + "." +
    b64({ iss: EMAIL, scope: "https://www.googleapis.com/auth/spreadsheets", aud: "https://oauth2.googleapis.com/token", iat: now, exp: now + 3600 });
  const sig = crypto.createSign("RSA-SHA256").update(unsigned).sign(KEY).toString("base64url");
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${unsigned}.${sig}` }),
  });
  const d = await r.json();
  if (!r.ok) {
    console.log("1. FAIL: Google refused the login:", d.error, "-", d.error_description);
    console.log("   Usually the key or the service account email is wrong, or the key was deleted in Google Cloud.");
    process.exit(1);
  }
  token = d.access_token;
  console.log("1. OK   signed in to Google as", EMAIL);
} catch (e) {
  console.log("1. FAIL: the private key could not be read:", e.message);
  console.log("   GOOGLE_PRIVATE_KEY must be copied exactly from the JSON file, inside double quotes, on one line.");
  process.exit(1);
}

const api = (path, opts = {}) =>
  fetch(`https://sheets.googleapis.com/v4/spreadsheets/${ID}${path}`, {
    ...opts,
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  });

// --- 2. open the sheet and look at the tab names ---
let r = await api("?fields=properties.title,sheets.properties.title");
let d = await r.json();
if (!r.ok) {
  const msg = d?.error?.message || r.status;
  console.log("2. FAIL: could not open the Sheet:", msg);
  if (/has not been used|disabled/i.test(msg)) console.log("   Fix: Google Cloud > APIs & Services > Library > Google Sheets API > Enable (in the project that owns the service account).");
  else if (r.status === 404) console.log("   Fix: GOOGLE_SHEET_ID is wrong (copy only the part between /d/ and /edit).");
  else console.log(`   Fix: open the Sheet > Share > add ${EMAIL} as Editor.`);
  process.exit(1);
}
const tabs = (d.sheets || []).map((s) => s.properties.title);
console.log(`2. OK   opened "${d.properties.title}". Tabs found: ${tabs.join(", ")}`);
if (!tabs.includes(TAB)) {
  console.log(`   FAIL: there is no tab named "${TAB}". Rename the bottom tab to exactly ${TAB} (or set GOOGLE_SHEET_TAB to one of the names above).`);
  process.exit(1);
}

// --- 3. make sure row 1 is the header, then write a test row ---
const HEADERS = ["Created (UTC)", "Order ID", "Payment ID", "Status", "Name", "Email", "Phone", "City", "Second attendee", "Note", "Ticket", "People", "Total", "Paid now", "Balance", "Paid at (UTC)"];
r = await api(`/values/${encodeURIComponent(`'${TAB}'!A1:P1`)}`);
d = await r.json();
if (r.ok && (!d.values || !d.values.length)) {
  await api(`/values/${encodeURIComponent(`'${TAB}'!A1:P1`)}?valueInputOption=RAW`, { method: "PUT", body: JSON.stringify({ values: [HEADERS] }) });
  console.log("   Added the header row (titles) in row 1.");
}
r = await api(`/values/${encodeURIComponent(`'${TAB}'!A:P`)}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
  method: "POST",
  body: JSON.stringify({ values: [[new Date().toISOString(), "", "TEST", "test", "Test row (delete me)", "test@example.com", "0000000000", "", "", "", "regular", 1, 0, 0, 0, ""]] }),
});
d = await r.json();
if (!r.ok) {
  console.log("3. FAIL: could not write:", d?.error?.message || r.status);
  console.log(`   Fix: the Sheet must be shared with ${EMAIL} as Editor (not Viewer).`);
  process.exit(1);
}
console.log(`3. OK   wrote a test row to "${TAB}". Open the Sheet and you should see it. You can delete that row.`);
console.log("\nThe Google connection works. If the form still adds nothing, the problem is in the booking flow, not Google.");

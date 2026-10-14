// Sends ONE test email through MSG91 exactly the way the website does, and prints MSG91's answer.
// Put this file in the Vastu project folder (next to .env.local) and run:
//     node test-email.mjs your-own-email@gmail.com
import fs from "fs";

const to = process.argv[2];
if (!to || !to.includes("@")) {
  console.log("Usage: node test-email.mjs your-own-email@gmail.com");
  process.exit(1);
}
const file = [".env.local", ".env"].find((f) => fs.existsSync(f));
if (!file) {
  console.log("FAIL: no .env.local found in this folder (it must sit next to package.json).");
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

const need = ["MSG91_AUTHKEY", "MSG91_EMAIL_DOMAIN", "MSG91_EMAIL_FROM", "MSG91_EMAIL_TEMPLATE_CONFIRM"];
const missing = need.filter((k) => !env[k]);
if (missing.length) {
  console.log("FAIL: missing or empty in", file + ":", missing.join(", "));
  console.log("      (a line starting with # is ignored)");
  process.exit(1);
}
if (!env.MSG91_EMAIL_FROM.toLowerCase().endsWith("@" + env.MSG91_EMAIL_DOMAIN.toLowerCase())) {
  console.log(`WARNING: the From address (${env.MSG91_EMAIL_FROM}) should end with @${env.MSG91_EMAIL_DOMAIN}`);
}

const vars = {
  name: "Test User", date: "1 November 2026", time: "9:30 AM to 6:00 PM", venue: "Keys Hotel",
  ticket: "Regular", amount: "₹2,000", balance: "₹7,999", paymentid: "pay_TEST", payment_id: "pay_TEST",
};
const body = {
  recipients: [{ to: [{ name: "Test User", email: to }], variables: vars }],
  from: { name: env.MSG91_EMAIL_FROM_NAME || "DIY Vastu Workshop", email: env.MSG91_EMAIL_FROM },
  domain: env.MSG91_EMAIL_DOMAIN,
  template_id: env.MSG91_EMAIL_TEMPLATE_CONFIRM,
};

const res = await fetch("https://control.msg91.com/api/v5/email/send", {
  method: "POST",
  headers: { "Content-Type": "application/json", accept: "application/json", authkey: env.MSG91_AUTHKEY },
  body: JSON.stringify(body),
});
const text = await res.text();
console.log("HTTP status:", res.status);
console.log("MSG91 answer:", text);

let data = {};
try { data = JSON.parse(text); } catch {}
const failed = !res.ok || data.type === "error" || data.hasError === true || data.status === "fail";
const msg = text.toLowerCase();
if (!failed) {
  console.log(`\nMSG91 accepted the email for ${to}. Check the inbox AND the spam folder.`);
  console.log("If it never arrives, open MSG91 > Email > Logs / Reports and look at the delivery status of this email.");
} else {
  console.log("\nMSG91 REFUSED the email. Likely reason:");
  if (/ip/.test(msg) && /(block|whitelist|not allowed|security)/.test(msg))
    console.log("- IP security: in MSG91 > API / Authkey settings, switch off IP whitelisting (Vercel has no fixed IP) or add the IP.");
  else if (/auth/.test(msg) || res.status === 401)
    console.log("- The auth key is wrong or has been regenerated. Copy the current one from MSG91.");
  else if (/domain/.test(msg))
    console.log(`- The domain "${env.MSG91_EMAIL_DOMAIN}" is not verified in MSG91 > Email > Domains (the DNS records must show verified).`);
  else if (/template/.test(msg))
    console.log(`- Template "${env.MSG91_EMAIL_TEMPLATE_CONFIRM}" not found or not active. Use the Template ID shown in MSG91 > Email > Templates.`);
  else if (/variable/.test(msg))
    console.log("- The template variables do not match. Variable names in the template must be among: " + Object.keys(vars).join(", "));
  else
    console.log("- See the MSG91 answer above. Send it to me if you need help reading it.");
}

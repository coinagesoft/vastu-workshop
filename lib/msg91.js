// MSG91 helpers: SMS (Flow API), Email, WhatsApp. Server-side only.
// Each channel is skipped automatically if its env variables are not set,
// so you can switch them on one at a time as your templates get approved.

const BASE = "https://control.msg91.com/api/v5";

function authkey() {
  const k = process.env.MSG91_AUTHKEY;
  if (!k) throw new Error("MSG91_AUTHKEY is not set");
  return k;
}

// 9876543210 / +91 98765 43210 / 09876543210 -> 919876543210
export function normalizePhone(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length === 10) d = "91" + d;
  return d;
}

async function post(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", accept: "application/json", authkey: authkey() },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data?.type === "error") {
    throw new Error(`MSG91 ${path} failed: ${JSON.stringify(data)}`);
  }
  return data;
}

// SMS via Flow. Variable names must match the ##placeholders## in your approved template.
export function sendSms({ templateId, phone, vars = {} }) {
  const body = {
    template_id: templateId,
    short_url: "0",
    recipients: [{ mobiles: normalizePhone(phone), ...vars }],
  };
  return post("/flow/", body);
}

// Email via template. Variable names must match the variables in your MSG91 email template.
export function sendEmail({ templateId, to, name, vars = {} }) {
  return post("/email/send", {
    recipients: [{ to: [{ name, email: to }], variables: vars }],
    from: { name: process.env.MSG91_EMAIL_FROM_NAME || "DIY Vastu Workshop", email: process.env.MSG91_EMAIL_FROM },
    domain: process.env.MSG91_EMAIL_DOMAIN,
    template_id: templateId,
  });
}

// WhatsApp template. `values` fill {{1}}, {{2}}... of the template body, in order.
export function sendWhatsApp({ templateName, phone, values = [], language = "en" }) {
  const components = {};
  values.forEach((v, i) => { components[`body_${i + 1}`] = { type: "text", value: String(v) }; });
  return post("/whatsapp/whatsapp-outbound-message/bulk/", {
    integrated_number: process.env.MSG91_WA_NUMBER,
    content_type: "template",
    payload: {
      messaging_product: "whatsapp",
      type: "template",
      template: {
        name: templateName,
        language: { code: language, policy: "deterministic" },
        namespace: process.env.MSG91_WA_NAMESPACE || null,
        to_and_components: [{ to: [normalizePhone(phone)], components }],
      },
    },
  });
}
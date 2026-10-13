import { event, tickets, inr } from "@/lib/data";
import { sendSms, sendEmail, sendWhatsApp } from "@/lib/msg91";

const env = (k) => process.env[k];

// Sends the booking confirmation on every channel that is configured.
// One channel failing never blocks the others or the booking itself.
export async function sendConfirmation(b) {
  const t = tickets.find((x) => x.id === b.ticket);
  const v = {
    name: b.name,
    date: event.dateLabel,
    time: event.time,
    venue: event.venue,
    ticket: t ? t.name : b.ticket,
    amount: String(b.paid_now),
    balance: String(b.balance),
    paymentid: b.paymentId,
  };

  const jobs = [];

  if (env("MSG91_SMS_TEMPLATE_CONFIRM") && b.phone) {
    jobs.push(["sms", sendSms({ templateId: env("MSG91_SMS_TEMPLATE_CONFIRM"), phone: b.phone, vars: v })]);
  }
  // Email via MSG91 template
  if (env("MSG91_EMAIL_TEMPLATE_CONFIRM") && env("MSG91_EMAIL_DOMAIN") && env("MSG91_EMAIL_FROM") && b.email) {
    jobs.push(["email", sendEmail({
      templateId: env("MSG91_EMAIL_TEMPLATE_CONFIRM"), to: b.email, name: b.name,
      vars: { ...v, payment_id: b.paymentId, amount: inr(Number(b.paid_now)), balance: inr(Number(b.balance)) },
    })]);
  }
  if (env("MSG91_WA_TEMPLATE_CONFIRM") && env("MSG91_WA_NUMBER") && env("MSG91_WA_NAMESPACE") && b.phone) {
    // Template body order: {{1}} name, {{2}} date, {{3}} venue, {{4}} amount, {{5}} payment ID
    jobs.push(["whatsapp", sendWhatsApp({
      templateName: env("MSG91_WA_TEMPLATE_CONFIRM"), phone: b.phone,
      values: [v.name, v.date, v.venue, v.amount, v.paymentid],
    })]);
  }

  const results = await Promise.allSettled(jobs.map(([, p]) => p));
  results.forEach((r, i) => {
    if (r.status === "fulfilled") console.log(`MSG91 ${jobs[i][0]} sent for ${b.paymentId}`);
    else console.error(`MSG91 ${jobs[i][0]} FAILED for ${b.paymentId}:`, r.reason?.message);
  });
}

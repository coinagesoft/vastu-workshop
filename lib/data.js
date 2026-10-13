// All page content lives here. Text in [square brackets] is shown as a
// "needs confirmation" highlight until you replace it.
export const event = {
  name: "DIY Vastu Workshop",
  teacher: "Acharya Shilratna Shilwant",
  headline: "Learn to Read Your Own Vastu Plan.",
  headline2: "Fix It Yourself.",
  subtitle: "A 1-day hands-on DIY Vastu Workshop with Acharya Shilratna Shilwant",
  dateLabel: "1 November 2026",
  start: "2026-11-01T09:00:00+05:30", // update once the time is confirmed
  venue: "[Hotel name], Pune",
  time: "[Time]",
  seats: "[40]",
  bring: "Bring your home or office floor plan.",
  whatsappText: "Hi, I have a question about the DIY Vastu Workshop on 1 November in Pune.",
};

export const problem = {
  text: "Every time you have a Vastu doubt, you wait for a consultant. You pay for each visit, and you still don't fully understand why a remedy was suggested.",
  question: "What if you could understand it yourself?",
};

export const learn = [
  "Read your floor plan and mark the directions correctly",
  "Understand the 16 zones and the 5 elements in your own space",
  "Spot common Vastu defects in flats, bungalows and offices",
  "Apply simple, practical remedies, without demolition or major changes",
  "Decide what to check before you buy, rent or renovate",
];

export const agenda = [
  { session: "Morning", what: "Vastu basics, directions and zones" },
  { session: "Mid-day", what: "Reading a floor plan, with live examples" },
  { session: "Afternoon", what: "Work on your own plan with guidance" },
  { session: "Closing", what: "Remedy checklist and your questions answered" },
];
export const agendaNote = "[Confirm the final agenda with Shilratna]";

export const takeHome = [
  "Workshop workbook",
  "DIY remedy checklist",
  "Floor plan grid / compass template",
  "Lunch and refreshments",
  "30-day WhatsApp support group for follow-up questions",
];
export const takeHomeNote = "[Confirm inclusions]";

export const teacher = {
  bio: "Acharya Shilratna Shilwant is a Vastu and astrology consultant who has guided clients across the world toward calmer, more balanced homes and workplaces. In this workshop, he shares his method in simple language so you can apply it yourself.",
  note: "[Add years of experience, number of clients and a photo]",
  photo: "", // e.g. "/teacher.jpg" after you add the file to /public
};

export const audience = [
  "Homeowners and families",
  "Anyone buying, renting or building a home",
  "Business owners and office managers",
  "Architects, interior designers and real estate professionals",
  "Anyone curious about Vastu who wants clear steps, not confusion",
];

// Certificates: add images to /public/certificates and set `image`, e.g. "/certificates/one.jpg".
export const certificates = [
  { title: "[Certificate 1 title]", issuer: "[Issuing body]", year: "[Year]", image: "" },
  { title: "[Certificate 2 title]", issuer: "[Issuing body]", year: "[Year]", image: "" },
  { title: "[Certificate 3 title]", issuer: "[Issuing body]", year: "[Year]", image: "" },
];

// Video testimonials: paste the YouTube video ID into `youtubeId`.
export const videoTestimonials = [
  { name: "[Name]", area: "[Area]", youtubeId: "" },
  { name: "[Name]", area: "[Area]", youtubeId: "" },
  { name: "[Name]", area: "[Area]", youtubeId: "" },
];

export const quotes = [
  { text: "[Testimonial 1]", who: "Name, area" },
  { text: "[Testimonial 2]", who: "Name, area" },
  { text: "[Testimonial 3]", who: "Name, area" },
];

export const tickets = [
  { id: "early", name: "Early Bird", note: "until [18 Oct]", price: 7999, people: 1 },
  { id: "regular", name: "Regular", note: "", price: 9999, people: 1 },
  { id: "couple", name: "Couple / Family", note: "2 people", price: 15999, people: 2 },
];
export const deposit = 2000;
export const depositText = "Book your seat with just ₹2,000 and pay the balance later.";

export const faqs = [
  { q: "Do I need to know Vastu already?", a: "No. We start from the basics." },
  { q: "What should I bring?", a: "Your home or office floor plan, a notebook and a pen. [Add: no plan? We will help you sketch one.]" },
  { q: "Will I be able to do the remedies myself?", a: "Yes. The workshop focuses on simple, practical remedies you can apply without a consultant." },
  { q: "Can I bring my spouse or a family member?", a: "Yes. Choose the Couple / Family ticket." },
  { q: "What if I can't attend?", a: "[Refund / transfer policy, e.g. full refund up to 7 days before]" },
  { q: "Is parking available at the hotel?", a: "[Confirm]" },
];

export const closing = {
  line1: "Only [40] seats. 1 November. Pune.",
  line2: "Stop depending on others for your own home. Learn it once, use it for life.",
};

export const shortCopy = {
  metaTitle: "DIY Vastu Workshop in Pune | 1 Nov | Acharya Shilratna Shilwant",
  metaDescription: "A 1-day hands-on workshop in Pune. Learn to read your floor plan and apply Vastu remedies yourself. Limited seats.",
  adHeadline: "Learn Vastu Yourself. One Day, Pune, 1 Nov.",
  whatsapp: "Join Acharya Shilratna Shilwant's DIY Vastu Workshop in Pune on 1 Nov. Learn to read your own floor plan. Limited seats: [link]",
};

export const inr = (n) => "₹" + n.toLocaleString("en-IN");

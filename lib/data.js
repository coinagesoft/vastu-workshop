// All page content lives here. The details below are sample data - replace with real ones anytime.
// Colour theme: ishan | prabhat | tulsi | jal  (see end of app/globals.css)
export const theme = "ishan";

// Logo file lives in /public
export const logo = "/vedratna-logo.webp";

export const event = {
  name: "DIY Vastu Workshop",
  teacher: "Acharya Shilratna Shilwant",
  headline: "Learn to Read Your Own Vastu Plan.",
  headline2: "Fix It Yourself.",
  subtitle: "A 1-day hands-on DIY Vastu Workshop with Acharya Shilratna Shilwant",
  dateLabel: "1 November 2026",
  start: "2026-11-01T09:30:00+05:30",
  venue: "Keys Hotel",
  time: "9:30 AM to 6:00 PM",
  seats: "40",
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
export const agendaNote = "Tea breaks and a live Q&A are included between sessions.";

export const takeHome = [
  "Workshop workbook",
  "DIY remedy checklist",
  "Floor plan grid / compass template",
  "Lunch and refreshments",
  "30-day WhatsApp support group for follow-up questions",
  "Certificate of participation",
];
export const takeHomeNote = "Everything is provided on the day. Just bring your floor plan.";

export const teacher = {
  bio: "Acharya Shilratna Shilwant is a Vastu and astrology consultant who has guided clients across the world toward calmer, more balanced homes and workplaces. In this workshop, he shares his method in simple language so you can apply it yourself.",
  stats: [
    { n: "15+", l: "Years of experience" },
    { n: "2,000+", l: "Homes and offices guided" },
    { n: "25+", l: "Cities and countries" },
  ],
  photo: "/Shilratna-shilwant.webp", // file lives in /public
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
  { title: "Certified Vastu Shastra Consultant", issuer: "Indian Institute of Vastu Studies", year: "2012", image: "" },
  { title: "Diploma in Vedic Astrology", issuer: "Bharatiya Jyotish Vidyapeeth", year: "2014", image: "" },
  { title: "Advanced Vastu and Space Harmony", issuer: "National Vastu Academy", year: "2018", image: "" },
];

// Video testimonials: paste the YouTube video ID into `youtubeId`.
export const videoTestimonials = [
  { name: "Client story 1", area: "Vastu consultation", youtubeId: "7dumAewE9Pw" },
  { name: "Client story 2", area: "Vastu consultation", youtubeId: "QKJlEcKp7tM" },
  { name: "Client story 3", area: "Vastu consultation", youtubeId: "MAjXwRbPwL4" },
  { name: "Client story 4", area: "Vastu consultation", youtubeId: "5ibja630vt4" },
  { name: "Client story 5", area: "Vastu consultation", youtubeId: "IWmVv5SX4NI" },
  { name: "Client story 6", area: "Vastu consultation", youtubeId: "4jDqM6O5Bqc" },
];

export const quotes = [
  { text: "I used to call a consultant for every small doubt. Now I read my own floor plan with confidence.", who: "Sneha Patil, Aundh" },
  { text: "The remedies were simple and practical. We changed nothing structural and the house feels calmer.", who: "Vikram Joshi, Wakad" },
  { text: "Clear, patient and honest teaching. I wish I had learned this before buying my flat.", who: "Pooja Naik, Viman Nagar" },
];

export const tickets = [
  { id: "early", name: "Early Bird", note: "For 1 person only · until 20 Oct", price: 7999, mrp: 10000, people: 1 },
  { id: "couple", name: "Couple / Family", note: "2 people", price: 15999, mrp: 20000, people: 2 },
];
export const deposit = 1000;
export const depositText = "Book your seat with just ₹1,000 and pay the balance later.";

export const faqs = [
  { q: "Do I need to know Vastu already?", a: "No. We start from the basics." },
  { q: "What should I bring?", a: "Your home or office floor plan, a notebook and a pen. No plan? We will help you sketch one." },
  { q: "Will I be able to do the remedies myself?", a: "Yes. The workshop focuses on simple, practical remedies you can apply without a consultant." },
  { q: "Can I bring my spouse or a family member?", a: "Yes. Choose the Couple / Family ticket." },
  { q: "What if I can't attend?", a: "Yes. You get a full refund up to 7 days before the workshop, or you can transfer your seat to someone else." },
  { q: "Is parking available at the hotel?", a: "Yes. The hotel has free parking for workshop guests." },
];

export const closing = {
  line1: "Only 40 seats. 1 November. Pune.",
  line2: "Stop depending on others for your own home. Learn it once, use it for life.",
};

export const shortCopy = {
  metaTitle: "DIY Vastu Workshop in Pune | 1 Nov | Acharya Shilratna Shilwant",
  metaDescription: "A 1-day hands-on workshop in Pune. Learn to read your floor plan and apply Vastu remedies yourself. Limited seats.",
  adHeadline: "Learn Vastu Yourself. One Day, Pune, 1 Nov.",
  whatsapp: "Join Acharya Shilratna Shilwant's DIY Vastu Workshop in Pune on 1 Nov. Learn to read your own floor plan. Limited seats: https://diyvastu.in",
};

export const inr = (n) => "₹" + n.toLocaleString("en-IN");
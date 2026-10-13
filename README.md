# DIY Vastu Workshop: Next.js site

Pages: `/` (home), `/workshop` (details + FAQ), `/book` (seat booking).
The home page has the Certificates section (`#certificates`) and Video Testimonials section (`#testimonials`).

## Run
```bash
npm install
cp .env.example .env.local   # add the WhatsApp number
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
```

## Edit content
Everything is in `lib/data.js`. Items in [square brackets] show as red "needs confirmation" tags
until you replace them.

- Certificates: add images to `public/certificates/` and set `image: "/certificates/name.jpg"`.
- Video testimonials: paste the YouTube video ID into `youtubeId`.
- Teacher photo: add `public/teacher.jpg` and set `photo: "/teacher.jpg"`.
- Event time: update `event.start` (countdown) and `event.time`.
- Early bird closes 18 Oct 2026 (set in `components/BookingForm.js`, `EARLY_END`).

## Bookings
`app/api/book/route.js` currently logs seat requests to the server console. Connect it to email,
Google Sheets, a CRM or a payment gateway (Razorpay etc.) before going live.

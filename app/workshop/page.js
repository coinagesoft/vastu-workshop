import Link from "next/link";
import Faq from "@/components/Faq";
import Schedule from "@/components/Schedule";
import P from "@/components/Pending";
import PageBanner from "@/components/PageBanner";
import IconList, { takeHomeIcons, audienceIcons } from "@/components/IconList";
import { Arrow } from "@/components/Header";
import {
  event, learn, takeHome, audience, quotes, shortCopy, closing,
} from "@/lib/data";

export const metadata = { title: "Workshop details | DIY Vastu Workshop", description: shortCopy.metaDescription };

function Eyebrow({ children }) { return <p className="eyebrow"><i />{children}</p>; }

export default function Workshop() {
  return (
    <>
      <PageBanner title="Workshop Details" crumb="Workshop" />

      <section className="section">
        <div className="wrap two-col">
          <div className="stick-col">
            <Eyebrow>{event.dateLabel}</Eyebrow>
            <h2>What you&apos;ll <span className="g">learn</span></h2>
            <ul className="learn">{learn.map((l) => (<li key={l}>{l}</li>))}</ul>
          </div>
          <div>
            <Eyebrow>Schedule</Eyebrow>
            <h2>How the <span className="g">day works</span></h2>
            <Schedule />
          </div>
        </div>
      </section>

      <section className="section tint">
        <div className="wrap two-col">
          <div>
            <Eyebrow>Included</Eyebrow>
            <h2>What you <span className="g">take home</span></h2>
            <IconList items={takeHome} icons={takeHomeIcons} />
          </div>
          <div>
            <Eyebrow>Audience</Eyebrow>
            <h2>Who it&apos;s <span className="g">for</span></h2>
            <IconList items={audience} icons={audienceIcons} />
            <p className="no-prior"><strong>No prior knowledge needed.</strong></p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <Eyebrow>Testimonials</Eyebrow>
          <h2>What people <span className="g">say</span></h2>
          <div className="quotes">
            {quotes.map((q, i) => (
              <blockquote key={i}>
                <p>“<P>{q.text}</P>”</p>
                <cite>{q.who}</cite>
              </blockquote>
            ))}
          </div>
          <p><Link href="/#testimonials" className="link">Watch video testimonials</Link></p>
        </div>
      </section>

      <section className="section tint">
        <div className="wrap narrow">
          <Eyebrow>FAQ</Eyebrow>
          <h2>Frequently asked <span className="g">questions</span></h2>
          <Faq />
        </div>
      </section>

      <section className="cta">
        <div className="wrap narrow center">
          <p className="note"><P>{closing.line1}</P></p>
          <h2>{closing.line2}</h2>
          <Link href="/book" className="btn coral">Reserve My Seat <Arrow /></Link>
        </div>
      </section>
    </>
  );
}
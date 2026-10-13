import BookingForm from "@/components/BookingForm";
import PageBanner from "@/components/PageBanner";
import P from "@/components/Pending";
import { event } from "@/lib/data";

export const metadata = { title: "Book your seat | DIY Vastu Workshop", description: "Reserve your seat for the DIY Vastu Workshop in Pune on 1 November 2026." };

export default function Book() {
  return (
    <>
      <PageBanner title="Book Your Seat" crumb="Book Seat" />
      <section className="section tight">
        <div className="wrap">
          <p className="body-lg center">{event.dateLabel} | <P>{event.venue}</P> | <P>{event.time}</P>. {event.bring} Only <P>{event.seats}</P> seats.</p>
          <BookingForm />
        </div>
      </section>
    </>
  );
}

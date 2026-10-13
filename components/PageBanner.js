import Link from "next/link";

export default function PageBanner({ title, crumb }) {
  return (
    <section className="banner">
      <div className="wrap center">
        <h1>{title}</h1>
        <p className="crumb"><Link href="/">Home</Link> <span>&gt;</span> {crumb}</p>
      </div>
    </section>
  );
}

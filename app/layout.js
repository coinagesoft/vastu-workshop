import { Outfit, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { shortCopy, theme } from "@/lib/data";

const outfit = Outfit({ subsets: ["latin"], variable: "--f-head", display: "swap" });
const dm = DM_Sans({ subsets: ["latin"], variable: "--f-body", display: "swap" });

export const metadata = { title: shortCopy.metaTitle, description: shortCopy.metaDescription };

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme={theme} className={`${outfit.variable} ${dm.variable}`}>
      <body>
        <a href="#main" className="skip">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
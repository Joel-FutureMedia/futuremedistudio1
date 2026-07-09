import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Services from "../components/Services";
import OurWorkShowcase from "../components/OurWorkShowcase";
import Work from "../components/Work";
import Stats from "../components/Stats";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-brand">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <OurWorkShowcase />
        <Work />
        <Stats />
      </main>
      <Footer />
    </div>
  );
}

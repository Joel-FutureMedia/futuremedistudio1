import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Services from "../components/Services";
import Work from "../components/Work";
import Stats from "../components/Stats";
import Sets from "../components/Sets";
import Booking from "../components/Booking";
import VideoProductionRequest from "../components/VideoProductionRequest";
import Footer from "../components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-brand">
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <Services />
        <Work />
        <Stats />
        <Sets />
        <Booking />
        <VideoProductionRequest />
      </main>
      <Footer />
    </div>
  );
}

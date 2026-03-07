import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import StatsBar from "@/components/home/StatsBar";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import AIPackagePlanner from "@/components/home/AIPackagePlanner";
import PersonasSection from "@/components/home/PersonasSection";
import Testimonials from "@/components/home/Testimonials";
import AppDownload from "@/components/home/AppDownload";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <HowItWorks />
        <FeaturedDestinations />
        <AIPackagePlanner />
        <PersonasSection />
        <Testimonials />
        <AppDownload />
      </main>
      <Footer />
    </>
  );
}

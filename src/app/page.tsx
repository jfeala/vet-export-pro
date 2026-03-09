import { NavBar } from "@/components/landing/nav-bar";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Benefits } from "@/components/landing/benefits";
import { Destinations } from "@/components/landing/destinations";
import { LeadForm } from "@/components/landing/lead-form";
import { FAQ } from "@/components/landing/faq";
import { Footer } from "@/components/landing/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f4f7f5] font-sans">
      <NavBar />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Benefits />
      <Destinations />
      <LeadForm />
      <FAQ />
      <Footer />
    </div>
  );
}

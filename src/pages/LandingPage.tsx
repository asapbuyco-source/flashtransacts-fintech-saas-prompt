import ParticleBackground from "@/components/ParticleBackground";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ModulesSection from "@/components/landing/ModulesSection";
import DashboardPreview from "@/components/landing/DashboardPreview";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import FAQSection from "@/components/landing/FAQSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="premium-page-bg relative min-h-screen overflow-hidden">
      <div className="premium-grid pointer-events-none fixed inset-0 z-0 opacity-45" />
      <ParticleBackground />
      <div className="relative z-10">
        <HeroSection />
        <DashboardPreview />
        <FeaturesSection />
        <ModulesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <Footer />
      </div>
    </div>
  );
}

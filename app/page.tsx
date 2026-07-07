import { HeroSection } from "@/components/home/hero-section";
import { PopularHallsSection } from "@/components/home/popular-halls";
import { FeaturedHallsSection } from "@/components/home/featured-halls";
import { HowItWorksSection } from "@/components/home/how-it-works";
import { WhyChooseSection } from "@/components/home/why-choose";
import { TestimonialsSection } from "@/components/home/testimonials";
import { FAQSection } from "@/components/home/faqs";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularHallsSection />
      <FeaturedHallsSection />
      <HowItWorksSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}

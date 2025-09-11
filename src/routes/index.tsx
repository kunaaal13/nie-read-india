import { createFileRoute } from "@tanstack/react-router";
import AboutSection from "~/components/AboutSection";
import HeroSection from "~/components/HeroSection";
import { Navbar } from "~/components/Navbar";
import RegisterSection from "~/components/RegisterSection";
export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <RegisterSection />
    </>
  );
}

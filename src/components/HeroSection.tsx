import InfoBubble from "./InfoBubble";

const HeroSection = () => {
  return (
    <div className="relative w-100">
      <div
        className="absolute inset-0 bg-[url('/images/hero-bg.svg')] bg-cover bg-center bg-no-repeat"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 70%, 0 70%)",
        }}
      />

      <div className="relative z-10">
        <img
          src="/images/nie-hero-section.svg"
          alt="nie | Read India 2025 (september 15 - october 17)"
          className="max-w-[80%] md:max-w-[60%] mx-auto py-10 pointer-events-none select-none"
        />
        <img
          src="/images/hero-bottom.svg"
          alt="childrens"
          className="w-full pointer-events-none select-none"
        />
      </div>
      <InfoBubble />
    </div>
  );
};

export default HeroSection;

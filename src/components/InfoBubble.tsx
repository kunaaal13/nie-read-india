const InfoBubble = () => {
  return (
    <div className="absolute bottom-[-6%] md:bottom-[0%] left-[2%] md:left-[5%] z-10 w-full max-w-[70dvw] md:w-[800px] flex items-end">
      {/* Content Container */}

      <div className="hidden md:block rotate-[316deg] w-[93px]">
        <img
          src="/images/black-sparks.svg"
          alt=""
          className="rotate-180 md:h-[70px] pointer-events-none select-none"
        />
      </div>

      <div
        className="pointer-events-none select-none md:shadow-[10px_10px_0px_0px_#F2BA2F] shadow-[6px_6px_0px_0px_#F2BA2F] bg-[#FFE5A6] scale-[0.9] md:scale-1 text-xs md:text-2xl px-8 md:px-16 py-1 md:py-4 flex items-center justify-center"
        style={{
          borderRadius: "40px 50px 60px 40px",
        }}
      >
        <p className="text-gray-800 text-center w-full">
          Join students across India for a 25-day reading adventure! Read daily,
          enjoy stories, and win prizes!
        </p>
      </div>

      <div className="hidden md:block rotate-[360deg] w-[93px]">
        <img
          src="/images/black-sparks.svg"
          alt=""
          className="pointer-events-none select-none md:h-[70px] "
        />
      </div>
      <div className="block md:hidden ">
        <img
          src="/images/orange-sparks.svg"
          alt=""
          className="h-[36px] w-[54px] pointer-events-none select-none"
        />
      </div>
    </div>
  );
};

export default InfoBubble;

const pointers = [
  {
    icon: "/images/point1.svg",
    text: "Read 2,025 words daily",
  },
  {
    icon: "/images/point2.svg",
    text: "Track your progress on the trackers on the RECESS PAGE",
  },
  {
    icon: "/images/point3.svg",
    text: (
      <span>
        Take part in the quiz every friday on <b>@timesnie</b> on Instagram
      </span>
    ),
  },
];

const AboutSection = () => {
  return (
    <div className="relative w-full py-10">
      <img
        src="/images/orange-spark.svg"
        className="absolute z-0 pointer-events-none select-none right-0 md:top-[-40%] w-[100px] top-[-5%] md:w-[300px] "
        alt=""
      />
      <div className="container relative">
        <h2 className="font-dina-text text-xl md:text-5xl font-bold mb-2 z-10">
          About The <span className="text-[#EC8724]">Challenge</span>
        </h2>
        <div className="ml-auto max-w-[80%] md:max-w-[900px]">
          <p className="font-dreaming text-sm md:text-4xl font-normal mb-4 z-10">
            Here's how to participate
          </p>
          <ul>
            {pointers.map((pointer, i) => (
              <li
                className={`flex items-center gap-2 mb-2 ${i == 2 ? "relative" : ""}`}
                key={pointer.icon}
              >
                <img
                  src={pointer.icon}
                  alt={`${i + 1}`}
                  className="h-[20px] md:h-[36px] z-10 w-[20px] md:w-[36px] pointer-events-none select-none"
                />
                <p className="font-epilogue text-xs md:text-xl z-10">
                  {pointer.text}
                </p>
                {i == 2 && (
                  <div className="absolute right-[40%] md:right-[10%] bottom-[-2rem] md:bottom-[-4rem] z-0">
                    <a
                      className="block md:hidden"
                      href="https://www.instagram.com/timesnie"
                      target="_blank"
                    >
                      <img
                        src="/images/insta-icon-sm.svg"
                        alt="Instagram"
                        className=" w-[56px] h-auto"
                      />
                    </a>
                    <a
                      className="hidden md:block"
                      href="https://www.instagram.com/timesnie"
                      target="_blank"
                    >
                      <img
                        src="/images/insta-icon.svg"
                        alt="Instagram"
                        className=" w-[180px] h-auto"
                      />
                    </a>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;

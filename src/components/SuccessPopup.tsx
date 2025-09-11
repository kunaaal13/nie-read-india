const SuccessPopup = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div
        className="relative bg-white p-8 max-w-md w-full shadow-lg"
        style={{
          border: "3px solid #EC8724",
          borderRadius: "25px 30px 20px 35px",
          transform: "rotate(-0.5deg)",
        }}
      >
        {/* Main content */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span style={{ color: "#EC8724" }}>Thank you for</span>
            <br />
            <span className="text-black text-4xl">signing up!</span>
          </h1>

          <p className="text-gray-700 text-lg mb-6 leading-relaxed">
            You're in! Start reading now –<br />
            your first 2,025 words await!
          </p>

          {/* Thumbs up placeholder */}
          <div className="flex justify-end mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: "#EC8724" }}
            >
              👍
            </div>
          </div>

          {/* Continue button */}
          <button
            className="text-white font-semibold py-3 px-8 text-lg transition-all hover:opacity-90 transform hover:scale-105"
            style={{
              backgroundColor: "#EC8724",
              borderRadius: "12px 8px 15px 10px",
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopup;

import React, { useEffect } from "react";
import { createPortal } from "react-dom";

const SuccessModal: React.FC<any> = ({ isOpen, onClose }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: any) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  // Handle backdrop click
  const handleBackdropClick = (event: any) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-white p-2 pt-4 md:pt-2 max-w-md w-full shadow-lg"
        style={{
          border: "3px solid #EC8724",
          borderRadius: "100px 80px 50px 60px",
          transform: "rotate(-0.5deg)",
        }}
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        {/* Main content */}
        <div className="text-center pb-10 md:pb-8">
          <h1 className="text-3xl md:text-5xl font-dina-text font-black mb-2">
            <span style={{ color: "#EC8724" }}>Thank you for</span>
            <br />
            <span className="text-black">signing up!</span>
          </h1>

          <p className="text-black font-epilogue text-lg md:text-xl  ">
            You're in! Start reading now –<br />
            your first 2,025 words await!
          </p>

          {/* Thumbs up placeholder */}
          <div className="flex justify-end mb-6 absolute right-0 bottom-[-24px] md:bottom-4">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl">
              <img
                src="/images/orange-thumbs-up.svg"
                alt=""
                className=" h-10 w-10 md:h-20 md:w-20"
              />
            </div>
          </div>
        </div>
        {/* Continue button */}
        <button
          className="absolute rounded-2xl font-epilogue left-[-25%] md:left-[33%] -bottom-8 text-white font-semibold py-3 px-8 md:px-10 text-xl md:text-xl transition-all transform hover:scale-105"
          style={{
            backgroundColor: "#EC8724",
          }}
          onClick={onClose}
        >
          Continue
        </button>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default SuccessModal;

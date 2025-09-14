import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useBlocker } from "@tanstack/react-router";

interface NavigationConfirmModalProps {
  shouldBlock: boolean; // Control when to show the confirmation
  message?: string;
}

const NavigationConfirmModal: React.FC<NavigationConfirmModalProps> = ({
  shouldBlock,
  message = "Are you sure you want to exit?",
}) => {

    const [isOpen, setIsOpen] = useState(false);
    const onClose = () => setIsOpen(false);
    
  const router = useRouter();

  // Use TanStack Router's useBlocker hook to intercept navigation
  const blocker = useBlocker({
        condition: shouldBlock && !isOpen, // Only block if we should block and modal isn't already open
        blockerFn: () => {
            if (shouldBlock && !isOpen){
                setIsOpen(true);
                return false;
            }
            return true;
        }
    });

  // Handle the blocker state
  useEffect(() => {
    if (blocker.status === "blocked") {
      // Modal should open when navigation is blocked
      // You'll need to call a function to open the modal from parent component
    }
  }, [blocker.status]);

  // Handle escape key press
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleNo();
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
  }, [isOpen]);

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleNo();
    }
  };

  // Handle "Yes" - confirm navigation
  const handleYes = () => {
    if (blocker.status === "blocked") {
      blocker.proceed(); // Allow the navigation to continue
    }
    onClose();
  };

  // Handle "No" - cancel navigation
  const handleNo = () => {
    if (blocker.status === "blocked") {
      blocker.reset(); // Cancel the navigation
    }
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div
        className="relative bg-white p-6 pt-8 max-w-md w-full shadow-lg"
        style={{
          border: "3px solid #EC8724",
          borderRadius: "100px 80px 50px 60px",
          transform: "rotate(-0.5deg)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main content */}
        <div className="text-center pb-16">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span>All done?</span>
          </h1>

          <p className="text-black text-lg md:text-xl">{message}</p>
        </div>

        {/* Button container */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
          {/* No button */}
          <button
            className="rounded-2xl font-semibold py-3 px-8 text-xl transition-all transform hover:scale-105 bg-gray-500 text-white"
            onClick={handleNo}
          >
            No
          </button>

          {/* Yes button */}
          <button
            className="rounded-2xl font-semibold py-3 px-8 text-xl transition-all transform hover:scale-105 text-white"
            style={{
              backgroundColor: "#EC8724",
            }}
            onClick={handleYes}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default NavigationConfirmModal;

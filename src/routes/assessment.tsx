import React, { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, FileText, CheckCircle } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  url: z.string(),
  duration: z
    .number()
    .optional()
    .transform((val) => (val ? val : 1800)), // Default 30 minutes
});

type SearchParams = z.infer<typeof searchSchema>;

export const Route = createFileRoute("/assessment")({
  component: RouteComponent,
  validateSearch: searchSchema,
});

function RouteComponent() {
  const { url, duration } = Route.useSearch();

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(true);
  const [showThankYou, setShowThankYou] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time: number) => {
          if (time <= 1) {
            setIsTimerActive(false);
            setShowThankYou(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimerColor = (): string => {
    const halfTime = duration / 2;
    const quarterTime = duration / 4;

    if (timeLeft > halfTime) return "text-green-600";
    if (timeLeft > quarterTime) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressWidth = (): number => {
    return (timeLeft / duration) * 100;
  };

  const getProgressColor = (): string => {
    const halfTime = duration / 2;
    const quarterTime = duration / 4;

    if (timeLeft > halfTime) return "bg-green-500";
    if (timeLeft > quarterTime) return "bg-yellow-500";
    return "bg-red-500";
  };

  const isLowTime = (): boolean => {
    return timeLeft <= Math.max(300, duration * 0.1); // 5 minutes or 10% of total time
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation Bar */}
      <nav className=" ">
        <div className="max-w-7xl mx-auto px-4 sm:px-0 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/images/nie-logo.svg"
                alt="nie"
                className="md:w-[100px] w-[58px] h-auto pointer-events-none select-none"
              />
            </div>

            {/* Timer Display */}
            {!showThankYou && (
              <div className="flex items-center space-x-3 50 px-4 py-2 ">
                <Clock className={`h-5 w-5 ${getTimerColor()}`} />
                <span
                  className={`text-lg font-mono font-bold ${getTimerColor()}`}
                >
                  {formatTime(timeLeft)}
                </span>
                <span
                  className="text-sm text-gray-600"
                  style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
                >
                  remaining
                </span>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto md:px-4 sm:px-6 lg:px-8 py-8">
        {!showThankYou ? (
          <div className="overflow-hidden">
            {/* Google Form Container */}
            <div className="md:p-6">
              {timeLeft > 0 ? (
                <div className="relative">
                  {/* <iframe
                    src={decodeURIComponent(url)}
                    width="100%"
                    height="800"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                    className="rounded-lg  "
                  >
                    Loading assessment form...
                  </iframe> */}
                  <iframe
                    src={`https://app.youform.com/forms/${url}`}
                    loading="lazy"
                    width="100%"
                    height="700"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                  ></iframe>

                  {/* Overlay warning when time is low */}
                  {isLowTime() && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse z-10">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="text-sm font-bold">
                          {Math.ceil(timeLeft / 60)} minutes left!
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Clock className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3
                    className="text-2xl font-dreaming font-bold text-red-600 mb-2"
                    style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
                  >
                    Time Expired
                  </h3>
                  <p className="text-gray-600 font-epilogue ">
                    The assessment time has ended. Thank you for your
                    participation.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Thank You Message */
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-xl shadow-xl p-12">
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />

              <h2 className="text-4xl font-bold text-gray-800 mb-4 font-dreaming">
                Assessment Completed
              </h2>

              <p className="text-lg text-gray-600 mb-6 font-epilogue">
                Thank you for submitting your assessment. Your responses have
                been recorded successfully.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

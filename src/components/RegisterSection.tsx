import { useForm } from "@tanstack/react-form";
import React, { useState, useCallback, useMemo } from "react";
import { z } from "zod";
import type { FormEvent, ChangeEvent } from "react";

// ============ GOOGLE SHEETS CONFIGURATION ============
// Replace these with your actual values
const GOOGLE_SHEETS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_SHEETS_API_KEY || "your-google-sheets-api-key";
const GOOGLE_SPREADSHEET_ID =
  process.env.NEXT_PUBLIC_GOOGLE_SPREADSHEET_ID || "your-spreadsheet-id";
const GOOGLE_SHEET_NAME = process.env.NEXT_PUBLIC_GOOGLE_SHEET_NAME || "Sheet1"; // Name of the sheet tab
const GOOGLE_SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SPREADSHEET_ID}/values/${GOOGLE_SHEET_NAME}:append`;

// Google Sheets API response types
interface GoogleSheetsResponse {
  spreadsheetId: string;
  tableRange: string;
  updates: {
    spreadsheetId: string;
    updatedRange: string;
    updatedRows: number;
    updatedColumns: number;
    updatedCells: number;
  };
}

interface GoogleSheetsError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}

// Define form data interface
interface FormData {
  fullName: string;
  email: string;
  class: string;
  section: string;
  school: string;
  city: string;
  schoolAddr: string;
}

// Zod schema for validation
const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  class: z.string().min(1, "Class is required"),
  section: z.string().min(1, "Section is required"),
  school: z.string().min(1, "School name is required"),
  city: z.string().min(1, "City is required"),
  schoolAddr: z.string().min(1, "School address is required"),
});

// Custom error interface for API errors
interface ApiError extends Error {
  status?: number;
  code?: string;
}

// Submit message type
type SubmitMessageType = {
  message: string;
  type: "success" | "error" | "info";
} | null;

// ============ GOOGLE SHEETS INTEGRATION ============
const submitToGoogleSheets = async (
  formData: FormData
): Promise<GoogleSheetsResponse> => {
  // Prepare data in the same order as form fields
  const rowData = [
    formData.fullName,
    formData.email,
    formData.class,
    formData.section,
    formData.school,
    formData.city,
    formData.schoolAddr,
    new Date().toISOString(), // Add timestamp
  ];

  const requestBody = {
    values: [rowData],
    majorDimension: "ROWS",
  };

  const response = await fetch(
    `${GOOGLE_SHEETS_API_URL}?valueInputOption=USER_ENTERED&key=${GOOGLE_SHEETS_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData: GoogleSheetsError = await response.json();
    const error = new Error(
      `Google Sheets API Error: ${errorData.error.message}`
    ) as ApiError;
    error.status = response.status;
    error.code = errorData.error.status;
    throw error;
  }

  const data: GoogleSheetsResponse = await response.json();
  return data;
};

// Helper function to initialize Google Sheet with headers (call this once manually)
const initializeGoogleSheetHeaders = async (): Promise<void> => {
  const headers = [
    "Full Name",
    "Email",
    "Class",
    "Section",
    "School",
    "City",
    "School Address",
    "Submission Date",
  ];

  const requestBody = {
    values: [headers],
    majorDimension: "ROWS",
  };

  const response = await fetch(
    `${GOOGLE_SHEETS_API_URL}?valueInputOption=USER_ENTERED&key=${GOOGLE_SHEETS_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    }
  );

  if (!response.ok) {
    const errorData: GoogleSheetsError = await response.json();
    throw new Error(`Failed to initialize headers: ${errorData.error.message}`);
  }
};

// Component for handling images with error fallback
interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className: string;
  fallbackText?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = React.memo(
  ({ src, alt, className, fallbackText = "IMG" }) => {
    const [hasError, setHasError] = useState(false);

    const handleImageError = useCallback(() => {
      setHasError(true);
      console.error(`Failed to load image: ${src}`);
    }, [src]);

    const handleImageLoad = useCallback(() => {
      setHasError(false);
    }, []);

    if (hasError) {
      return (
        <div
          className={`${className} bg-gray-200 flex items-center justify-center text-gray-500 text-xs border border-gray-300 rounded`}
          title={`Failed to load: ${src}`}
        >
          {fallbackText}
        </div>
      );
    }

    return (
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    );
  }
);

ImageWithFallback.displayName = "ImageWithFallback";

// Helper component for form fields with error display
interface FormFieldProps {
  name: keyof FormData;
  label: string;
  type?: "text" | "email" | "textarea";
  sublabel?: string;
  required?: boolean;
  rows?: number;
}

const FormField: React.FC<FormFieldProps> = React.memo(
  ({ name, label, type = "text", sublabel, required = true, rows = 3 }) => {
    return (
      <div
        className={`w-full grid grid-cols-[5rem_1fr] md:grid-cols-[15rem_1fr] gap-4 ${type === "textarea" ? "items-start" : "items-center"} my-2`}
      >
        <label
          htmlFor={name}
          className={`font-epilogue text-xs md:text-xl ${type === "textarea" ? "mt-2" : ""}`}
        >
          <p>{label}</p>
          {sublabel && (
            <span className="text-[10px] md:text-sm">{sublabel}</span>
          )}
        </label>
        <div className="w-full">
          {type === "textarea" ? (
            <textarea
              id={name}
              name={name}
              className="font-epilogue w-full rounded-md text-xs py-2 px-6 bg-[#FFFFFF80] min-h-[60px] resize-y transition-colors border border-gray-200 focus:border-blue-500"
              required={required}
              rows={rows}
            />
          ) : (
            <input
              type={type}
              id={name}
              name={name}
              className="font-epilogue w-full rounded-md text-xs py-2 px-6 bg-[#FFFFFF80] transition-colors border border-gray-200 focus:border-blue-500"
              required={required}
            />
          )}
        </div>
      </div>
    );
  }
);

FormField.displayName = "FormField";

const RegisterSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitMessage, setSubmitMessage] = useState<SubmitMessageType>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Memoize form configuration to prevent unnecessary re-renders
  const formConfig = useMemo(
    () => ({
      defaultValues: {
        fullName: "",
        email: "",
        class: "",
        section: "",
        school: "",
        city: "",
        schoolAddr: "",
      } as FormData,
      onSubmit: async (values: { value: FormData }) => {
        setIsSubmitting(true);
        setSubmitMessage(null);
        setFormErrors({});

        try {
          // Validate data before submission
          const validatedData = schema.parse(values.value);

          // Submit to Google Sheets
          console.log("Submitting to Google Sheets:", validatedData);
          const result = await submitToGoogleSheets(validatedData);

          console.log("Google Sheets submission successful:", result);

          setSubmitMessage({
            message:
              "Registration successful! Welcome to the 2025 Words-a-Day Challenge!",
            type: "success",
          });

          // Reset form after successful submission
          const form = document.getElementById(
            "registration-form"
          ) as HTMLFormElement;
          if (form) {
            form.reset();
          }
        } catch (error: unknown) {
          console.error("Submission error:", error);

          if (error instanceof z.ZodError) {
            const fieldErrors: Record<string, string> = {};
            error.errors.forEach((err) => {
              if (err.path.length > 0) {
                fieldErrors[err.path[0]] = err.message;
              }
            });
            setFormErrors(fieldErrors);
            setSubmitMessage({
              message: "Please check all required fields and try again.",
              type: "error",
            });
          } else {
            let errorMessage = "Something went wrong. Please try again.";

            if (error instanceof Error) {
              if (error.message.includes("Google Sheets API Error")) {
                errorMessage =
                  "Failed to save registration. Please try again or contact support.";
              } else if (error.message.includes("Network")) {
                errorMessage =
                  "Network error. Please check your connection and try again.";
              } else if (error.message.includes("timeout")) {
                errorMessage = "Request timed out. Please try again.";
              } else {
                errorMessage = error.message;
              }
            }

            setSubmitMessage({
              message: errorMessage,
              type: "error",
            });
          }
        } finally {
          setIsSubmitting(false);
        }
      },
    }),
    []
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const values: FormData = {
        fullName: formData.get("fullName")?.toString() || "",
        email: formData.get("email")?.toString() || "",
        class: formData.get("class")?.toString() || "",
        section: formData.get("section")?.toString() || "",
        school: formData.get("school")?.toString() || "",
        city: formData.get("city")?.toString() || "",
        schoolAddr: formData.get("schoolAddr")?.toString() || "",
      };

      await formConfig.onSubmit({ value: values });
    },
    [formConfig]
  );

  return (
    <section className="container relative">
      <header className="w-full relative">
        <ImageWithFallback
          src="/images/interested-text.svg"
          alt="Interested in joining? Share your details"
          className="md:w-[600px] w-[70dvw]"
          fallbackText="Interested in joining?"
        />
        <ImageWithFallback
          src="/images/black-arrow.svg"
          alt="arrow"
          className="md:h-[100px] h-[40px] scale-x-[-1] md:scale-x-[1] mb-2 ml-[80%] md:ml-0"
          fallbackText="→"
        />
      </header>

      <main className="w-full flex flex-col items-center mt-16 mb-20 md:mb-40">
        <div className="relative mt-[-2rem] z-10 bg-[#A3DCE6] pt-10 md:pt-20 px-4 md:px-10 pb-12 w-full max-w-6xl mx-auto rounded-3xl flex flex-col items-center">
          <header>
            <ImageWithFallback
              src="/images/register-text.svg"
              alt="Register for 2025 words-a-day challenge"
              className="z-10 absolute top-[-2%] md:top-[-10%] left-[calc(50%-min(30dvw,200px))] md:left-[calc(50%-300px)] md:w-[600px] w-[min(400px,60dvw)]"
              fallbackText="Register"
            />
          </header>

          <ImageWithFallback
            src="/images/orange-flower.svg"
            alt=""
            className="absolute top-0 right-[-1rem] h-[50px] md:h-[150px] w-auto object-contain"
            fallbackText=""
          />

          <h3 className="text-center font-dreaming md:text-4xl text-base mb-4 md:mb-8">
            Please fill in your details carefully:
          </h3>

          <form
            id="registration-form"
            onSubmit={handleSubmit}
            className="w-full"
          >
            {/* Form Fields */}
            <div className="space-y-2">
              <FormField name="fullName" label="Full Name" />
              {formErrors.fullName && (
                <div className="text-red-600 text-xs font-epilogue ml-[5rem] md:ml-[15rem]">
                  {formErrors.fullName}
                </div>
              )}

              <FormField
                name="email"
                label="Email"
                type="email"
                sublabel="(student/parent)"
              />
              {formErrors.email && (
                <div className="text-red-600 text-xs font-epilogue ml-[5rem] md:ml-[15rem]">
                  {formErrors.email}
                </div>
              )}

              <FormField name="class" label="Class" />
              {formErrors.class && (
                <div className="text-red-600 text-xs font-epilogue ml-[5rem] md:ml-[15rem]">
                  {formErrors.class}
                </div>
              )}

              <FormField name="section" label="Section" />
              {formErrors.section && (
                <div className="text-red-600 text-xs font-epilogue ml-[5rem] md:ml-[15rem]">
                  {formErrors.section}
                </div>
              )}

              <FormField name="school" label="School" />
              {formErrors.school && (
                <div className="text-red-600 text-xs font-epilogue ml-[5rem] md:ml-[15rem]">
                  {formErrors.school}
                </div>
              )}

              <FormField name="city" label="City" />
              {formErrors.city && (
                <div className="text-red-600 text-xs font-epilogue ml-[5rem] md:ml-[15rem]">
                  {formErrors.city}
                </div>
              )}

              <FormField
                name="schoolAddr"
                label="School Address"
                type="textarea"
                rows={3}
              />
              {formErrors.schoolAddr && (
                <div className="text-red-600 text-xs font-epilogue ml-[5rem] md:ml-[15rem]">
                  {formErrors.schoolAddr}
                </div>
              )}
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div
                className={`mt-4 p-3 rounded-md text-center font-epilogue text-sm transition-all duration-300 ${
                  submitMessage.type === "success"
                    ? "bg-green-100 text-green-800 border border-green-300"
                    : submitMessage.type === "error"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-blue-100 text-blue-800 border border-blue-300"
                }`}
                role="alert"
              >
                {submitMessage.message}
              </div>
            )}

            <button
              className={`font-epilogue font-bold text-sm md:text-3xl rounded-xl absolute md:py-3 py-2 md:px-6 px-2 md:bottom-[-2rem] bottom-[-12px] left-[13%] md:left-[30%] transition-all duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed transform scale-95"
                  : "bg-[#0E87C6] hover:bg-[#0d7bb3] hover:transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              } text-white shadow-lg`}
              type="submit"
              disabled={isSubmitting}
              aria-label={
                isSubmitting
                  ? "Submitting form..."
                  : "Submit and join the challenge"
              }
            >
              {isSubmitting ? "Submitting..." : "Submit & Join the Challenge"}
            </button>
          </form>
        </div>
      </main>

      {/* Orange spark image positioned at bottom left */}
      <ImageWithFallback
        src="/images/orange-spark.svg"
        alt=""
        className="absolute z-0 md:bottom-[-170px] md:left-[-34px] bottom-[-60px] left-[-15px] h-[100px] md:h-[300px] w-auto object-contain -rotate-45"
        fallbackText=""
      />
    </section>
  );
};

export default RegisterSection;

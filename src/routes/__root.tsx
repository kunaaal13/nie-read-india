/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";
import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import appCss from "~/styles/app.css?url";
import { seo } from "~/utils/seo";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "NIE | Read India 2025",
        description: `Join students across India for a 25-day reading adventure! Read daily, enjoy stories, and win prizes!`,
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
    // scripts: [
    //   {
    //     src: "/customScript.js",
    //     type: "text/javascript",
    //   },
    // ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

interface GoogleSheetsError {
  error: {
    code: number;
    message: string;
    status: string;
  };
}
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
  const GOOGLE_SHEETS_API_KEY =
    import.meta.env.VITE_API_URLGOOGLE_SHEETS_API_KEY ||
    "your-google-sheets-api-key";
  const GOOGLE_SPREADSHEET_ID =
    import.meta.env.VITE_API_URLGOOGLE_SPREADSHEET_ID || "your-spreadsheet-id";
  const GOOGLE_SHEET_NAME =
    import.meta.env.VITE_API_URLGOOGLE_SHEET_NAME || "Sheet1"; // Name of the sheet tab
  const GOOGLE_SHEETS_API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SPREADSHEET_ID}/values/${GOOGLE_SHEET_NAME}:append`;

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

function RootDocument({ children }: { children: React.ReactNode }) {
  // initializeGoogleSheetHeaders()
  //   .then(() => {
  //     console.log("Headers set up successfully");
  //   })
  //   .catch(console.error);
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}

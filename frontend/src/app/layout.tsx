import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "HORIZON NCR — AI Development Impact & Future Simulation Platform",
  description: "Spatial Digital Twin and AI Development Impact Simulator for Delhi-NCR",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

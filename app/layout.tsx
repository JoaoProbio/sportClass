import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SportProvider } from "./providers/SportContext";
import ErrorBoundary from "./components/ErrorBoundary";
import NetworkStatus from "./components/NetworkStatus";
import AnimatePresenceWrapper from "./components/AnimatePresenceWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = {
  title: "Jogos Interclasse IFNMG Januária 2025",
  description: "Interclasse IFNMG Januária 2025",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ErrorBoundary>
          <SportProvider>
            <NetworkStatus />
            <AnimatePresenceWrapper>
              {children}
            </AnimatePresenceWrapper>
          </SportProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

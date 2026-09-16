import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "./Hedear";
import Rodape from "./_components/Rodape";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans",
        geist.variable
      )}
    >
      <body className="min-h-full flex flex-col">
        <Header />

        {children}

        <Rodape />
      </body>
    </html>
  );
}
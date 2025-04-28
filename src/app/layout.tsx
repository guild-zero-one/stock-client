import type { Metadata } from "next";
import { Lexend, Nunito } from "next/font/google";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "SimLady",
  description: "SimLady - Gestão de Estoque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className={`${lexend.variable} ${nunito.variable} font-nunito text-text-default bg-white-default`}>{children}</body>
    </html>
  );
}

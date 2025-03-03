import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Diagrama do Cerrado - Ferramenta de Investimentos",
  description:
    "Ferramenta para cálculo de distribuição de investimentos usando o método do Diagrama do Cerrado",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={clsx(inter.className, "antialiased")}>{children}</body>
    </html>
  );
}

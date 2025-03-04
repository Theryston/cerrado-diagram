import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { GoogleTagManager } from "@next/third-parties/google";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title:
    "Ferramenta Diagrama do Cerrado - Calcule quanto você deve investir em cada ativo automaticamente",
  description:
    "Informe os seus ativos e a ferramente irá te falar quanto deve investir em cada um usando o método do Diagrama do Cerrado. A ferramenta é totalmente gratuita e não requer cadastro!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GMT_ID || ""} />

      <body className={clsx(inter.className, "antialiased")}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

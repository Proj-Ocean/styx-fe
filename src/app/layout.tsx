import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Styx Casino",
  description: "The premier virtual casion built with Aptos Move.",
};


const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className={inter.className}>
      <Providers>
        <Header />
        <div>{children}</div>
      </Providers>
      </body>
    </html>
  );
}

export default RootLayout

import { Bricolage_Grotesque, Figtree } from "next/font/google";
import "./globals.css";
import SetupGate from "@/components/SetupGate";
const d = Bricolage_Grotesque({ subsets: ["latin"], variable: "--display" });
const b = Figtree({ subsets: ["latin"], variable: "--body" });
export const metadata = { title: "GH School", description: "School website, dashboard and portal" };
export default function RootLayout({ children }) {
  return (<html lang="en"><body className={`${d.variable} ${b.variable}`}><SetupGate>{children}</SetupGate></body></html>);
}

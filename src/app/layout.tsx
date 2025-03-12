import { Geist } from "next/font/google";
import { AuthProvider } from "@/lib/auth-context"; // Corrected path
import { CapTableProvider } from "@/context/CapTableContext";
import TopNav from "@/components/TopNav";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "StockAI | AI-Powered Cap Table Management",
  description: "Simplify your cap table management with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        <AuthProvider>
          <CapTableProvider>
            <TopNav />
            <main className="pt-16">{children}</main>
          </CapTableProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
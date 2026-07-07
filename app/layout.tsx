import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/providers/toaster";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getAuthenticatedUser } from "@/lib/api/auth";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    default: "HallFinder - Premium Function Halls in Bidar",
    template: "%s | HallFinder",
  },
  description:
    "Find and book premium function halls in Bidar, Karnataka. Search by date, area, and capacity for weddings, receptions, and celebrations.",
  keywords: [
    "function hall",
    "banquet hall",
    "Bidar",
    "wedding venue",
    "Karnataka",
    "marriage hall",
  ],
  openGraph: {
    title: "HallFinder - Premium Function Halls in Bidar",
    description: "Discover elegant function halls for your special celebrations in Bidar.",
    type: "website",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthenticatedUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar user={user} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

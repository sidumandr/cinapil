import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { MovieProvider } from "@/context/movie-context";
import { ThemeProvider } from "@/context/theme-context";
import { SearchProvider } from "@/context/search-context";
import { AuthProvider } from "@/context/auth-context";
import { SearchResults } from "@/components/search-results";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Cinapil - Film Takip Uygulaması",
  description:
    "İzleyeceklerinizi ve izlediklerinizi takip edin. TMDB destekli film keşif platformu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" data-theme="black" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans antialiased min-h-screen bg-base-100 text-base-content">
        <ThemeProvider>
          <AuthProvider>
            <SearchProvider>
              <MovieProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <SearchResults />
              </MovieProvider>
            </SearchProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

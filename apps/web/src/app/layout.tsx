import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";

export const metadata: Metadata = {
  title: "Información que Nutre",
  description:
    "Nutriendo nuestra comunidad con conocimiento y recetas al alcance de todos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-surface text-on-surface font-body">
        <AuthProvider>
          <Navbar />
          <main className="flex-grow pt-20">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

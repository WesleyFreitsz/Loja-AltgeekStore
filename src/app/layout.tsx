import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import CartSidebar from "@/components/CartSidebar";
import FavoritesSidebar from "@/components/FavoritesSidebar";
import { Toaster } from "react-hot-toast";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AltGeekStore - Kawaii Gear & Geek Fashion",
  description: "Level up your wardrobe with our latest drops. Cyber-aesthetics meets high-quality gear.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans selection:bg-secondary/30">
        <CartProvider>
          <AuthProvider>
            {children}
            <CartSidebar />
            <FavoritesSidebar />
            <Toaster
              position="bottom-center"
              toastOptions={{
                style: {
                  borderRadius: '16px',
                  background: '#1d1c16',
                  color: '#fef9f0',
                  fontWeight: 'bold',
                  fontSize: '14px',
                },
              }}
            />
          </AuthProvider>
        </CartProvider>
      </body>
    </html>
  );
}

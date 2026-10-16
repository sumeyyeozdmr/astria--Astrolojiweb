import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AstriaProvider } from "@/context/AstriaContext";
import InteractiveCosmicBackground from "@/components/InteractiveCosmicBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ASTRIA — Yıldızlarında Yazılı Hikâyeyi Keşfet",
  description:
    "Doğduğun anda gökyüzünün sana anlattığı hikâyeyi keşfet. Kişisel doğum haritası, kader haritası, günlük sembolik kartlar, ilişkilerde uyum ve içsel potansiyelini keşfetme platformu.",
  keywords: [
    "ASTRIA",
    "doğum haritası",
    "kader haritası",
    "astroloji",
    "günlük kart",
    "ay takvimi",
    "ilişki uyumu",
    "kendini keşfet",
    "sembolik astroloji",
  ],
  authors: [{ name: "ASTRIA" }],
  openGraph: {
    title: "ASTRIA — Yıldızlarında Yazılı Hikâyeyi Keşfet",
    description:
      "Gökyüzünün doğduğun anda sana anlattığı hikâyeyi keşfet. Bir kehanet değil, sembolik farkındalık ve kişisel keşif yolculuğu.",
    url: "https://astria.app",
    siteName: "ASTRIA",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="tr"
      className={`${cormorantGaramond.variable} ${plusJakartaSans.variable} dark scroll-smooth`}
    >
      <body className="min-h-screen bg-[#070609] text-[#f4eee5] font-sans antialiased selection:bg-[#dfbe9630] selection:text-[#edd2ad] overflow-x-hidden">
        <AstriaProvider>
          {/* Yıldız tozu, kayan yıldızlar ve altın simlerle dolu etkileşimli kozmik arka plan */}
          <InteractiveCosmicBackground />

          {/* Açılır menülü ve logolu üst navigasyon çubuğu */}
          <Navbar />

          {/* Ana sayfa içerik alanı */}
          <main className="relative z-10 pt-24 md:pt-32 pb-16 px-6 md:px-10 max-w-7xl mx-auto min-h-[85vh]">
            {children}
          </main>

          {/* Genel alt bilgi (Footer) alanı */}
          <Footer />
        </AstriaProvider>
      </body>
    </html>
  );
}

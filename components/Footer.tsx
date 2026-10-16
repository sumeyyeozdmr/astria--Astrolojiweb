"use client";

import Link from "next/link";
import AstriaLogo from "./AstriaLogo";

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-[#dfbe9620] bg-[#06040cf0] backdrop-blur-xl pt-16 pb-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand & Slogans */}
          <div className="md:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="ASTRIA ana sayfa"
            >
              <AstriaLogo size="md" />
            </Link>

            <p className="font-serif text-lg text-[#dfbe96] italic font-light leading-snug">
              &quot;Gökyüzünün doğduğun anda sana anlattığı hikâyeyi keşfet.&quot;
            </p>

            <p className="text-xs text-[#9a8e81] font-light leading-relaxed max-w-sm">
              Yıldızlarında yazılı hikâyeyi keşfet. ASTRIA bir kehanet veya mutlak gelecek tahmini platformu değildir; sembolik astroloji diliyle kişisel farkındalık ve içsel potansiyeli anlama yolculuğudur.
            </p>
          </div>

          {/* Haritalarım Links */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium block mb-2">
              Haritalarım
            </span>
            <ul className="space-y-2.5 text-xs text-[#a99e91]">
              <li>
                <Link href="/haritalarim/dogum-haritasi" className="hover:text-[#f4eee5] transition-colors">
                  Doğum Haritası
                </Link>
              </li>
              <li>
                <Link href="/haritalarim/kader-haritasi" className="hover:text-[#f4eee5] transition-colors">
                  Kader Haritası
                </Link>
              </li>
              <li>
                <Link href="/haritalarim/profilim" className="hover:text-[#f4eee5] transition-colors">
                  Astrolojik Profilim
                </Link>
              </li>
              <li>
                <Link href="/ask-ve-uyum" className="hover:text-[#f4eee5] transition-colors">
                  Aşk ve Uyum
                </Link>
              </li>
            </ul>
          </div>

          {/* Günlük Deneyim Links */}
          <div className="md:col-span-2 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium block mb-2">
              Günlük Deneyim
            </span>
            <ul className="space-y-2.5 text-xs text-[#a99e91]">
              <li>
                <Link href="/gunluk/kart" className="hover:text-[#f4eee5] transition-colors">
                  Günlük Kart
                </Link>
              </li>
              <li>
                <Link href="/gunluk/gokyuzu" className="hover:text-[#f4eee5] transition-colors">
                  Günlük Gökyüzü
                </Link>
              </li>
              <li>
                <Link href="/gunluk/ay-takvimi" className="hover:text-[#f4eee5] transition-colors">
                  Ay Takvimi
                </Link>
              </li>
            </ul>
          </div>

          {/* Ethical Principles */}
          <div className="md:col-span-3 space-y-3">
            <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium block mb-2">
              ASTRIA Yaklaşımı
            </span>
            <div className="space-y-2 text-xs text-[#8e8276] font-light leading-relaxed">
              <p>
                <strong className="text-[#c9bdb0] font-normal block mb-0.5">
                  ✦ Korkusuz & Bilinçli:
                </strong>
                Korkutucu iddialar veya kehanet içermez.
              </p>
              <p>
                <strong className="text-[#c9bdb0] font-normal block mb-0.5">
                  ✦ Üyelik Zorunluluğu Yok:
                </strong>
                Doğrudan deneyimlenebilir kişisel alan.
              </p>
              <p>
                <strong className="text-[#c9bdb0] font-normal block mb-0.5">
                  ✦ Sembolik & Yaratıcı:
                </strong>
                İçsel potansiyelin sembolik aynası.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#786e63]">
          <p>© 2026 ASTRIA. Tüm hakları saklıdır.</p>
          <p className="italic text-[#8e8276]">
            Bir kehanet değil, kendini keşfetme yolculuğu.
          </p>
        </div>
      </div>
    </footer>
  );
}

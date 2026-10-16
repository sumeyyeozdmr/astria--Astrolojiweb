"use client";

import React from "react";

interface UtopianCardArtProps {
  cardId: number;
  roman: string;
  className?: string;
}

export default function UtopianCardArt({
  cardId,
  roman,
  className = "",
}: UtopianCardArtProps) {
  const cardData =
    cardId === 1
      ? {
          img: "/tarot-cosmic-moon.png",
          alt: "Kozmik Denge - Göksel Gece ve Altın Hilal Tarot Sanatı",
          glow: "rgba(56, 189, 248, 0.4)",
          accent: "#38bdf8",
        }
      : cardId === 2
      ? {
          img: "/tarot-botanical-moth.png",
          alt: "İçsel Pusula - Botanik Gece Güvesi Tarot Sanatı",
          glow: "rgba(192, 132, 252, 0.4)",
          accent: "#c084fc",
        }
      : {
          img: "/tarot-sun-golden.png",
          alt: "Yıldız Işığı - İhtişamlı Altın Güneş Tarot Sanatı",
          glow: "rgba(251, 191, 36, 0.45)",
          accent: "#fbbf24",
        };

  return (
    <div
      className={`relative w-full h-full overflow-hidden bg-[#06040a] flex items-center justify-center select-none ${className}`}
    >
      {/* Yüksek Çözünürlüklü Başyapıt Tarot Sanat Görseli */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cardData.img}
        alt={cardData.alt}
        className="w-full h-full object-cover object-center scale-[1.02] hover:scale-105 transition-transform duration-700 filter brightness-[0.98] contrast-[1.08]"
      />

      {/* Atmosferik Ortam Işıltıları */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-screen opacity-50"
        style={{
          background: `radial-gradient(circle at 50% 40%, ${cardData.glow} 0%, transparent 65%)`,
        }}
      />

      {/* Zarif Karartma ve Metne Doğru Geçiş Gradyanı */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0c091a] via-transparent to-black/30 pointer-events-none" />

      {/* İç Altın Yaldızlı Filigran Çerçeve */}
      <div className="absolute inset-2 sm:inset-2.5 rounded-lg border border-[#dfbe9670] pointer-events-none shadow-[inset_0_0_12px_rgba(223,190,150,0.25)]" />

      {/* Romen Rakamı Rozeti */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-[#07050e]/85 backdrop-blur-md border border-[#dfbe9660] shadow-[0_4px_12px_rgba(0,0,0,0.6)]">
        <span className="font-serif text-[10px] tracking-[0.2em] text-[#dfbe96] font-medium">
          {roman}
        </span>
      </div>

      {/* Köşelerdeki Altın Kıvılcım Noktaları */}
      <div className="absolute top-4 left-4 w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] pointer-events-none" />
      <div className="absolute top-4 right-4 w-1.5 h-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] pointer-events-none" />
    </div>
  );
}

"use client";

import React from "react";

interface UtopianCardBackProps {
  cardId: number;
  roman: string;
  accentColor?: string;
}

export default function UtopianCardBack({
  cardId,
  roman,
}: UtopianCardBackProps) {
  // Kart ID'sine göre özel kırpılmış gösterişli tarot görselini eşleştir
  const cardImage =
    cardId === 1
      ? "/tarot-cosmic-moon.png"
      : cardId === 2
      ? "/tarot-botanical-moth.png"
      : "/tarot-sun-golden.png";

  const theme =
    cardId === 1
      ? {
          primaryGlow: "#60a5fa",
          bgOverlay: "rgba(5, 12, 30, 0.72)",
          ringColor: "#93c5fd",
          coreSymbol: "☽",
        }
      : cardId === 2
      ? {
          primaryGlow: "#c084fc",
          bgOverlay: "rgba(10, 20, 16, 0.72)",
          ringColor: "#d8b4fe",
          coreSymbol: "✧",
        }
      : {
          primaryGlow: "#fbbf24",
          bgOverlay: "rgba(35, 18, 5, 0.70)",
          ringColor: "#fde68a",
          coreSymbol: "☼",
        };

  return (
    <div
      className="relative w-full h-full rounded-2xl flex flex-col justify-between items-center text-center overflow-hidden select-none border-2 border-[#dfbe9680] shadow-[0_20px_50px_rgba(0,0,0,0.85),inset_0_1px_rgba(255,255,255,0.2)] bg-[#07050e]"
    >
      {/* Arka Plandaki Gösterişli Tarot Sanatı */}
      <div className="absolute inset-0 w-full h-full">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cardImage}
          alt="Gösterişli Tarot Kartı Arkası"
          className="w-full h-full object-cover object-center scale-[1.03] transition-transform duration-700 group-hover:scale-110 filter brightness-[0.75] contrast-[1.12]"
        />
        {/* Zengin Kozmik ve Altın Ton Katmanları */}
        <div
          className="absolute inset-0 backdrop-blur-[0.5px]"
          style={{ background: theme.bgOverlay }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05030a] via-transparent to-[#05030a]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.7)_90%)]" />
      </div>

      {/* Üzerine Gelindiğinde Kayan Altın Işıltı Dalgası */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-gradient-to-tr from-transparent via-[#ffd70020] to-transparent" />
      {/* Kutsal Geometri & Astrolap Filigran SVG Çizimi */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-85"
        viewBox="0 0 280 440"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`goldGradBack_${cardId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fff2db" />
            <stop offset="35%" stopColor="#dfbe96" />
            <stop offset="70%" stopColor="#b48554" />
            <stop offset="100%" stopColor="#f5deb3" />
          </linearGradient>
          <radialGradient id={`coreGlowBack_${cardId}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={theme.primaryGlow} stopOpacity="0.8" />
            <stop offset="45%" stopColor="#dfbe96" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#dfbe96" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Dış Altın Yaldızlı Çift Çerçeve */}
        <rect
          x="10"
          y="10"
          width="260"
          height="420"
          rx="14"
          stroke={`url(#goldGradBack_${cardId})`}
          strokeWidth="1.2"
          strokeOpacity="0.5"
        />
        <rect
          x="16"
          y="16"
          width="248"
          height="408"
          rx="10"
          stroke={`url(#goldGradBack_${cardId})`}
          strokeWidth="0.7"
          strokeDasharray="4 3"
          strokeOpacity="0.35"
        />

        {/* 4 Köşedeki Barok Altın Filigran Motifleri */}
        {/* Sol Üst */}
        <g transform="translate(18, 18)">
          <path d="M 0 0 L 24 0 M 0 0 L 0 24 M 4 4 L 18 4 M 4 4 L 4 18" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="1" />
          <circle cx="12" cy="12" r="2.5" fill={`url(#goldGradBack_${cardId})`} />
        </g>
        {/* Sağ Üst */}
        <g transform="translate(262, 18) scale(-1, 1)">
          <path d="M 0 0 L 24 0 M 0 0 L 0 24 M 4 4 L 18 4 M 4 4 L 4 18" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="1" />
          <circle cx="12" cy="12" r="2.5" fill={`url(#goldGradBack_${cardId})`} />
        </g>
        {/* Sol Alt */}
        <g transform="translate(18, 422) scale(1, -1)">
          <path d="M 0 0 L 24 0 M 0 0 L 0 24 M 4 4 L 18 4 M 4 4 L 4 18" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="1" />
          <circle cx="12" cy="12" r="2.5" fill={`url(#goldGradBack_${cardId})`} />
        </g>
        {/* Sağ Alt */}
        <g transform="translate(262, 422) scale(-1, -1)">
          <path d="M 0 0 L 24 0 M 0 0 L 0 24 M 4 4 L 18 4 M 4 4 L 4 18" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="1" />
          <circle cx="12" cy="12" r="2.5" fill={`url(#goldGradBack_${cardId})`} />
        </g>

        {/* Kutsal Geometri: Birbirine Geçen Üçgenler */}
        <polygon
          points="140,85 210,210 70,210"
          stroke={`url(#goldGradBack_${cardId})`}
          strokeWidth="0.75"
          strokeOpacity="0.25"
        />
        <polygon
          points="140,335 210,210 70,210"
          stroke={`url(#goldGradBack_${cardId})`}
          strokeWidth="0.75"
          strokeOpacity="0.25"
        />
        <polygon
          points="140,95 195,190 85,190"
          stroke={theme.primaryGlow}
          strokeWidth="0.6"
          strokeDasharray="2 3"
          strokeOpacity="0.3"
        />
        <polygon
          points="140,325 195,230 85,230"
          stroke={theme.primaryGlow}
          strokeWidth="0.6"
          strokeDasharray="2 3"
          strokeOpacity="0.3"
        />

        {/* Çapraz Kozmik Enerji Çizgileri */}
        <line x1="26" y1="26" x2="254" y2="414" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="0.5" strokeOpacity="0.15" />
        <line x1="254" y1="26" x2="26" y2="414" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="0.5" strokeOpacity="0.15" />

        {/* Merkezdeki Büyük Astrolap Eşmerkezli Halkaları */}
        <circle cx="140" cy="210" r="92" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="0.8" strokeOpacity="0.3" />
        <circle cx="140" cy="210" r="80" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="1" strokeDasharray="4 3" strokeOpacity="0.45" />
        <circle cx="140" cy="210" r="68" stroke={theme.primaryGlow} strokeWidth="0.8" strokeOpacity="0.4" />
        <circle cx="140" cy="210" r="54" stroke={`url(#goldGradBack_${cardId})`} strokeWidth="1.2" strokeOpacity="0.6" />
        <circle cx="140" cy="210" r="42" stroke={theme.primaryGlow} strokeWidth="0.8" strokeDasharray="2 3" strokeOpacity="0.5" />

        {/* 16 Işınlı Astrolap Şuaları */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 22.5 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={140 + 44 * Math.cos(angle)}
              y1={210 + 44 * Math.sin(angle)}
              x2={140 + 78 * Math.cos(angle)}
              y2={210 + 78 * Math.sin(angle)}
              stroke={`url(#goldGradBack_${cardId})`}
              strokeWidth={i % 4 === 0 ? "1.2" : "0.6"}
              strokeOpacity={i % 4 === 0 ? "0.7" : "0.3"}
            />
          );
        })}

        {/* Merkezdeki Işıltılı Portal Aurası */}
        <circle cx="140" cy="210" r="38" fill={`url(#coreGlowBack_${cardId})`} />

        {/* 8 Köşeli Kutsal Altın Yıldız Çekirdeği */}
        <polygon
          points="140,178 147,203 172,210 147,217 140,242 133,217 108,210 133,203"
          fill={`url(#goldGradBack_${cardId})`}
        />
        <polygon
          points="140,186 145,205 164,210 145,215 140,234 135,215 116,210 135,205"
          fill="#ffffff"
          fillOpacity="0.85"
        />

        {/* Merkezdeki Parlak Taş */}
        <circle cx="140" cy="210" r="5.5" fill={theme.primaryGlow} />
        <circle cx="140" cy="210" r="2" fill="#ffffff" />

        {/* Astrolap Halkasındaki Altın Elmas Düğümleri */}
        {[0, 90, 180, 270].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const cx = 140 + 80 * Math.cos(rad);
          const cy = 210 + 80 * Math.sin(rad);
          return (
            <polygon
              key={deg}
              points={`${cx},${cy - 4} ${cx + 4},${cy} ${cx},${cy + 4} ${cx - 4},${cy}`}
              fill={`url(#goldGradBack_${cardId})`}
            />
          );
        })}

        {/* Kuzey ve Güney Göksel Tepe Motifleri */}
        <path
          d="M 140 45 L 143 53 L 151 56 L 143 59 L 140 67 L 137 59 L 129 56 L 137 53 Z"
          fill={`url(#goldGradBack_${cardId})`}
        />
        <path
          d="M 140 373 L 143 381 L 151 384 L 143 387 L 140 395 L 137 387 L 129 384 L 137 381 Z"
          fill={`url(#goldGradBack_${cardId})`}
        />
      </svg>

      {/* Üst Başlık Bilgisi */}
      <div className="relative z-10 w-full flex items-center justify-between text-[#dfbe96] px-1">
        <span className="text-xs">✦</span>
        <div className="flex flex-col items-center">
          <span className="font-serif text-[11px] tracking-[0.28em] uppercase text-[#f5ebd8] font-light">
            ASTRIA · ARCANUM
          </span>
          <span className="text-[9px] tracking-[0.24em] uppercase text-[#dfbe96] font-mono mt-0.5">
            {roman}
          </span>
        </div>
        <span className="text-xs">✦</span>
      </div>

      {/* Merkezdeki Mistik Mühür Başlığı ve Detayı */}
      <div className="relative z-10 my-auto flex flex-col items-center py-2">
        <div className="w-16 h-16 rounded-full border border-[#dfbe9645] bg-[#0c091a90] backdrop-blur-md flex items-center justify-center mb-3 shadow-[0_0_25px_rgba(223,190,150,0.25)] group-hover:scale-110 group-hover:shadow-[0_0_35px_rgba(223,190,150,0.45)] transition-all duration-300">
          <span
            className="text-2xl drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]"
            style={{ color: theme.primaryGlow }}
          >
            {theme.coreSymbol}
          </span>
        </div>

        <span className="font-serif text-sm tracking-[0.2em] text-[#fff6ec] uppercase font-light">
          {cardId === 1
            ? "Kozmik Denge"
            : cardId === 2
            ? "İçsel Pusula"
            : "Yıldız Işığı"}
        </span>

        <div className="flex items-center gap-2 mt-1">
          <span className="w-4 h-[1px] bg-[#dfbe9650]" />
          <span className="text-[9px] tracking-[0.2em] uppercase text-[#dfbe96] font-medium">
            KAPALI MÜHÜR
          </span>
          <span className="w-4 h-[1px] bg-[#dfbe9650]" />
        </div>
      </div>

      {/* Alt Etkileşim İpucu */}
      <div className="relative z-10 text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] flex items-center gap-2 group-hover:text-[#fff4e3] group-hover:tracking-[0.28em] transition-all font-medium py-1">
        <span>Kartı Çevirmek İçin Dokun</span>
        <span className="text-xs animate-pulse">✦</span>
      </div>
    </div>
  );
}

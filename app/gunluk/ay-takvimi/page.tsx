"use client";

import { useState } from "react";
import Link from "next/link";

interface MoonPhaseEvent {
  date: string;
  day: string;
  phaseName: string;
  symbol: string;
  illumination: string;
  zodiacSign: string;
  theme: string;
  intentionAdvice: string;
  isKey: boolean;
}

const MOON_PHASES: MoonPhaseEvent[] = [
  {
    date: "4 Ekim",
    day: "Cuma",
    phaseName: "Yeni Ay",
    symbol: "🌑",
    illumination: "%0",
    zodiacSign: "Terazi 10°",
    theme: "Sıfırlanma, Tohum Ekme & İlişkilerde Denge",
    intentionAdvice:
      "Zihnini geçmişin yüklerinden arındır. Yeni başlangıçlar için niyetlerini sessizce belirle ve tohumları ek.",
    isKey: true,
  },
  {
    date: "8 Ekim",
    day: "Salı",
    phaseName: "Büyüyen Hilal",
    symbol: "🌒",
    illumination: "%24",
    zodiacSign: "Yay 02°",
    theme: "İnanç, Girişim & İlk Adımlar",
    intentionAdvice:
      "Tohum ektiğin niyetleri küçük ama somut adımlarla besle. Kendine olan inancını pekiştir.",
    isKey: false,
  },
  {
    date: "11 Ekim",
    day: "Cuma",
    phaseName: "İlk Dördün",
    symbol: "🌓",
    illumination: "%50",
    zodiacSign: "Oğlak 18°",
    theme: "Kararlılık, Karşılaşmalar & Disiplin",
    intentionAdvice:
      "Engellerle karşılaştığında geri adım atmak yerine stratejini gözden geçir ve sabırla devam et.",
    isKey: true,
  },
  {
    date: "14 Ekim",
    day: "Pazartesi",
    phaseName: "Şişkin Ay (Gibbous)",
    symbol: "🌔",
    illumination: "%78",
    zodiacSign: "Balık 06°",
    theme: "İnce Ayar, Sezgi & Olgunlaşma",
    intentionAdvice:
      "Detayları mükemmelleştir; sezgilerine kulak ver ve yaklaşan hasat için enerjini topla.",
    isKey: false,
  },
  {
    date: "17 Ekim",
    day: "Perşembe",
    phaseName: "Süper Dolunay",
    symbol: "🌕",
    illumination: "%100",
    zodiacSign: "Koç 24°",
    theme: "Tam Aydınlanma, Görünürlük & Cesur Hasat",
    intentionAdvice:
      "Ektiğin tohumların meyvelerini gör. İçindeki cesareti ve özgün liderliği dünyaya yansıt.",
    isKey: true,
  },
  {
    date: "21 Ekim",
    day: "Pazartesi",
    phaseName: "Küçülen Ay",
    symbol: "🌖",
    illumination: "%82",
    zodiacSign: "İkizler 15°",
    theme: "Şükran, Bilgi Paylaşımı & Dağıtım",
    intentionAdvice:
      "Elde ettiğin kazanımlar için şükran duy; öğrendiğin deneyimleri başkalarıyla cömertçe paylaş.",
    isKey: false,
  },
  {
    date: "24 Ekim",
    day: "Perşembe",
    phaseName: "Son Dördün",
    symbol: "🌗",
    illumination: "%50",
    zodiacSign: "Aslan 01°",
    theme: "Bırakma, Arınma & Affetme",
    intentionAdvice:
      "Sana artık hizmet etmeyen alışkanlıkları, korkuları ve gerginlikleri sevgiyle geride bırak.",
    isKey: true,
  },
  {
    date: "29 Ekim",
    day: "Salı",
    phaseName: "Balzamik Hilal",
    symbol: "🌘",
    illumination: "%12",
    zodiacSign: "Başak 27°",
    theme: "Dinlenme, İçsel Sessizlik & Şifa",
    intentionAdvice:
      "Geri çekil, uykunu ve ruhunu dinlendir. Bir sonraki yeni döngüye zihinsel dinginlikle hazırlan.",
    isKey: false,
  },
];

export default function AyTakvimiPage() {
  const [selectedPhase, setSelectedPhase] = useState<MoonPhaseEvent>(MOON_PHASES[4]); // Default to Super Full Moon

  return (
    <div className="space-y-12 animate-in fade-in zoom-in-95 duration-500">
      {/* Header Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#dfbe9635] bg-[#120f20c0] hover:bg-[#dfbe9618] hover:border-[#dfbe96] text-xs text-[#dfbe96] transition-all cursor-pointer shadow-[0_0_15px_rgba(223,190,150,0.1)]"
        >
          <span>←</span>
          <span>Ana Sayfaya Dön</span>
        </Link>
        <span className="text-[11px] text-[#867b70] uppercase tracking-widest hidden sm:inline-block">
          GÜNLÜK DENEYİM · 03 AY TAKVİMİ
        </span>
      </div>

      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#dfbe9630] bg-[#dfbe960a] backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium">
            ✦ AY EVRELERİ VE NİYET REHBERİ ✦
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#f4eee5] font-light leading-tight">
          Ay{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffdca8] via-[#dfbe96] to-[#b88c58] drop-shadow-[0_0_35px_rgba(223,190,150,0.45)]">
            Takvimi
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#b8ada2] font-light leading-relaxed max-w-2xl mx-auto">
          Ay&apos;ın büyüme ve küçülme döngüleri, niyetlerin tohumlanmasından hasadına kadar içsel ritmini düzenler.
          Önemli Ay evrelerini takip et ve enerjini gökyüzüyle hizala.
        </p>
      </div>

      {/* Interactive Lunar Phase Selector Strip */}
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {MOON_PHASES.map((phase, idx) => {
            const isSelected = selectedPhase.date === phase.date;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedPhase(phase)}
                className={`p-3.5 rounded-2xl border text-center transition-all duration-300 cursor-pointer flex flex-col justify-between items-center min-h-[130px] ${
                  isSelected
                    ? "border-[#dfbe96] bg-[#181329f8] shadow-[0_0_20px_rgba(223,190,150,0.25)] scale-[1.03]"
                    : phase.isKey
                    ? "border-[#dfbe9640] bg-[#120f20d0] hover:border-[#dfbe96]"
                    : "border-white/[0.06] bg-[#0d0a17a0] text-[#867b70] hover:text-[#f4eee5] hover:border-white/20"
                }`}
              >
                <span className="text-[10px] text-[#867b70] block font-mono">{phase.date}</span>
                <span className="text-2xl my-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  {phase.symbol}
                </span>
                <div>
                  <span className="text-[11px] font-serif font-medium text-[#f4eee5] block leading-tight">
                    {phase.phaseName}
                  </span>
                  <span className="text-[9px] text-[#dfbe96] block mt-0.5">
                    {phase.illumination}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Moon Phase Deep Reading Banner */}
        <div className="rounded-2xl border border-[#dfbe9635] bg-[#100d1df8] backdrop-blur-2xl p-7 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,rgba(223,190,150,0.15),transparent_70%)] pointer-events-none" />

          {/* Phase Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
            <div className="flex items-center gap-4">
              <span className="text-4xl text-[#dfbe96] drop-shadow-[0_0_15px_rgba(223,190,150,0.5)]">
                {selectedPhase.symbol}
              </span>
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#dfbe96] font-medium block">
                  {selectedPhase.date} · {selectedPhase.day}
                </span>
                <h2 className="font-serif text-2xl md:text-3xl text-[#f4eee5] font-light">
                  {selectedPhase.phaseName} in {selectedPhase.zodiacSign}
                </h2>
              </div>
            </div>

            <div className="px-3.5 py-1.5 rounded-full border border-[#dfbe9640] bg-[#dfbe9612] text-xs text-[#dfbe96] font-medium">
              Işık Oranı: {selectedPhase.illumination}
            </div>
          </div>

          {/* Theme & Advice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium block">
                ✦ Kozmik Tema ve Enerji
              </span>
              <p className="text-sm text-[#cfc2b3] font-light leading-relaxed">
                {selectedPhase.theme}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#dfbe9625] bg-[#14102680] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#dfbe96] font-medium block">
                Niyet ve Eylem Tavsiyesi
              </span>
              <p className="text-xs text-[#f4eee5] italic font-light leading-relaxed">
                &quot;{selectedPhase.intentionAdvice}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

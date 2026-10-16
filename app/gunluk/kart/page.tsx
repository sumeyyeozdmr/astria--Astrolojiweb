"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAstria } from "@/context/AstriaContext";
import UtopianCardArt from "@/components/UtopianCardArt";
import UtopianCardBack from "@/components/UtopianCardBack";

interface CardData {
  id: number;
  roman: string;
  name: string;
  subtitle: string;
  symbol: string;
  theme: string;
  element: string;
  image?: string;
  accentColor: string;
  backTitle: string;
  backDescription: string;
  meaning: string;
  question: string;
  affirmation: string;
}

const CARDS: CardData[] = [
  {
    id: 1,
    roman: "I",
    name: "Kozmik Denge",
    subtitle: "Uyum, Adalet ve Akış",
    symbol: "⚖",
    theme: "Element: Hava · Zihinsel Berraklık",
    element: "Hava",
    image: "/card-balance.jpg",
    accentColor: "#dfbe96",
    backTitle: "GECE SAFİRİ VE TERAZİ",
    backDescription: "Kozmik dengenin ve zihinsel uyumun kapalı mührü.",
    meaning:
      "Bugün karşıtlıklar arasında çatışma değil, bir uyum yakalama daveti alıyorsun. Vermek ile almak, düşünmek ile hissetmek arasındaki teraziyi hafifçe dengele.",
    question: "Hayatının hangi alanında aşırı çaba sarf etmek yerine akışa teslim olmaya ihtiyacın var?",
    affirmation: "Merkezimdeyim; dinginlik, berraklık ve denge içindeyim.",
  },
  {
    id: 2,
    roman: "II",
    name: "İçsel Pusula",
    subtitle: "Sezgi, Hakikat ve Yön",
    symbol: "✧",
    theme: "Element: Su · Derin Bilgelik",
    element: "Su",
    image: "/card-compass.jpg",
    accentColor: "#c99aff",
    backTitle: "AMETİST VE SEZGİ GÖZÜ",
    backDescription: "Görünmeyen içsel pusulanın ve ruhsal yönün kapalı mührü.",
    meaning:
      "Dış dünyanın gürültüsünden uzaklaştığında en doğru yönü fısıldayan bir iç sesin var. Mantığın henüz açıklayamadığı sezgilerine şans ver.",
    question: "Hangi kararı verirken başkalarının beklentilerini bir kenara bırakıp kendi hakikatine güvenebilirsin?",
    affirmation: "Kendi içsel ışığıma ve sezgilerimin rehberliğine güveniyorum.",
  },
  {
    id: 3,
    roman: "III",
    name: "Yıldız Işığı",
    subtitle: "Uyanış, İlham ve Potansiyel",
    symbol: "☼",
    theme: "Element: Ateş · Yaratıcı Kıvılcım",
    element: "Ateş",
    accentColor: "#ffd27d",
    backTitle: "GÜNEŞ MANDALASI VE IŞIK",
    backDescription: "İçindeki uyanışı ve yaratıcı kıvılcımı saklayan kapalı mühür.",
    meaning:
      "İçinde henüz açığa çıkmamış kıvılcımlar taşıyorsun. Ertelediğin bir niyet ya da yaratıcı fikir bugün harekete geçmek için uygun bir alan arıyor.",
    question: "Kendini saklamayı bıraktığında dünyaya hangi özgün yeteneğini sunabilirsin?",
    affirmation: "Kendi potansiyelimi cesaretle ve neşeyle yaşamaya hazırım.",
  },
];

export default function GunlukKartPage() {
  const { dailyCard, selectDailyCard, resetDailyCard, profile } = useAstria();
  const [selectedId, setSelectedId] = useState<number | null>(dailyCard.cardId);

  const handleCardClick = (id: number) => {
    if (selectedId === id) {
      setSelectedId(null);
      resetDailyCard();
    } else {
      setSelectedId(id);
      selectDailyCard(id);
    }
  };

  const [todayStr, setTodayStr] = useState<string>("Bugün");

  useEffect(() => {
    setTodayStr(
      new Date().toLocaleDateString("tr-TR", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

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
          GÜNLÜK DENEYİM · 01 GÜNLÜK KART
        </span>
      </div>

      {/* Sayfa Başlığı */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#dfbe9630] bg-[#dfbe960a] backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium">
            ✦ GÜNLÜK MİSTİK TEFEKKÜR · {todayStr} ✦
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#f4eee5] font-light leading-tight">
          Günün Kartını{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffdca8] via-[#dfbe96] to-[#b88c58] drop-shadow-[0_0_35px_rgba(223,190,150,0.45)]">
            Seç
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#b8ada2] font-light leading-relaxed max-w-xl mx-auto">
          Gözlerini bir anlığına dinlendir, derin bir nefes al ve seni en çok çeken kapalı karta dokun.
          {profile.isSet && ` ${profile.sunSign} enerjine özel günün tefekkürünü keşfet.`}
        </p>
      </div>

      {/* 3 Boyutlu Çevrilebilen 3 Özel Mistik Tarot Kartı */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-8 lg:gap-10 max-w-sm sm:max-w-xl md:max-w-5xl mx-auto">
        {CARDS.map((card) => {
          const isSelected = selectedId === card.id;

          return (
            <div
              key={card.id}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={`${card.name} kartını seç veya çevir`}
              onClick={() => handleCardClick(card.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(card.id);
                }
              }}
              className="group relative cursor-pointer focus:outline-none perspective-1000 w-[250px] sm:w-[280px] md:w-full max-w-[315px] h-[410px] sm:h-[455px] md:h-[490px] mx-auto select-none"
            >
              {/* 3D Kart Çevirme Sarmalayıcısı */}
              <div
                className={`relative w-full h-full rounded-2xl transition-transform duration-700 preserve-3d shadow-[0_15px_40px_rgba(0,0,0,0.6)] ${
                  isSelected
                    ? "rotate-y-180"
                    : "group-hover:-translate-y-2 group-hover:shadow-[0_25px_60px_rgba(223,190,150,0.25)]"
                }`}
              >
                {/* KARTIN ARKA YÜZÜ (Kapalı Durum - Kutsal Geometri ve Mistik Tarot Mührü) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl backface-hidden">
                  <UtopianCardBack
                    cardId={card.id}
                    roman={card.roman}
                    accentColor={card.accentColor}
                  />
                </div>

                {/* KARTIN ÖN YÜZÜ (Açılmış Durum - Tarot Sanat Görseli ve Günün Tefekkürü) */}
                <div className="absolute inset-0 w-full h-full rounded-2xl border-2 border-[#dfbe9680] bg-[#0c091af5] backdrop-blur-xl rotate-y-180 backface-hidden shadow-[0_0_40px_rgba(223,190,150,0.35)] flex flex-col justify-between overflow-hidden">
                  {/* Kart Sanat Görseli Alanı */}
                  <div className="relative w-full h-44 sm:h-50 md:h-56 overflow-hidden border-b border-[#dfbe9635]">
                    <UtopianCardArt cardId={card.id} roman={card.roman} />
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#0c091a] to-transparent pointer-events-none" />
                  </div>

                  <div className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-0.5">
                        <h2 className="font-serif text-lg sm:text-xl md:text-2xl text-[#f4eee5] font-light">
                          {card.name}
                        </h2>
                        <span className="text-[10px] sm:text-[11px] text-[#dfbe96] px-2 py-0.5 rounded-full bg-[#dfbe9618] border border-[#dfbe9640]">
                          {card.element}
                        </span>
                      </div>
                      <span className="text-[8px] sm:text-[9px] uppercase tracking-wider text-[#dfbe96] block mb-1.5 font-medium">
                        {card.subtitle}
                      </span>
                      <p className="text-[10px] sm:text-xs text-[#cfc2b3] leading-relaxed font-light mb-2">
                        {card.meaning}
                      </p>
                    </div>

                    <div className="p-2 sm:p-2.5 rounded-xl border border-[#dfbe9625] bg-[#dfbe960e] space-y-0.5">
                      <span className="text-[7.5px] sm:text-[8.5px] uppercase tracking-wider text-[#dfbe96] font-medium block">
                        Günün Tefekkürü:
                      </span>
                      <p className="text-[9.5px] sm:text-[10.5px] text-[#f4eee5] italic">
                        &quot;{card.question}&quot;
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[8.5px] sm:text-[9.5px] text-[#a99e91]">
                      <span className="truncate max-w-[170px] sm:max-w-[210px]">Olumlama: {card.affirmation}</span>
                      <span className="text-[#dfbe96] underline underline-offset-2 shrink-0 cursor-pointer">Kapat ✕</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

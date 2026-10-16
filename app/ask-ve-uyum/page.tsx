"use client";

import { useState } from "react";
import Link from "next/link";
import { useAstria } from "@/context/AstriaContext";

type ElementType = "fire" | "earth" | "air" | "water";

interface ElementInfo {
  type: ElementType;
  name: string;
  symbol: string;
  signs: string;
  color: string;
}

const ELEMENTS: Record<ElementType, ElementInfo> = {
  fire: {
    type: "fire",
    name: "Ateş",
    symbol: "△",
    signs: "Koç, Aslan, Yay",
    color: "#ffa07a",
  },
  earth: {
    type: "earth",
    name: "Toprak",
    symbol: "▽",
    signs: "Boğa, Başak, Oğlak",
    color: "#90ee90",
  },
  air: {
    type: "air",
    name: "Hava",
    symbol: "🜁",
    signs: "İkizler, Terazi, Kova",
    color: "#87ceeb",
  },
  water: {
    type: "water",
    name: "Su",
    symbol: "🜄",
    signs: "Yengeç, Akrep, Balık",
    color: "#c8a2c8",
  },
};

const SYNERGIES: Record<string, {
  title: string;
  theme: string;
  chemistry: string;
  communication: string;
  emotionalNeeds: string;
  growth: string;
  harmonyTag: string;
}> = {
  "fire-fire": {
    title: "Ateş & Ateş: Çifte Kıvılcım",
    theme: "Yüksek Tutku ve Yaratıcı Macera",
    chemistry:
      "Birbirinizin cesaretini körükler, hayata coşkuyla sarılırsınız. Durağanlık bu ilişkide nadiren barınır; ortak hedefler ve yaratıcı projeler sizi kenetler.",
    communication: "Doğrudan, dürüst ve hızlı. Fikir ayrılıklarında sesler yükselebilir ancak kin tutulmaz.",
    emotionalNeeds: "Özgürlük, takdir edilme ve ilham alma ihtiyacı her iki taraf için de esastır.",
    growth: "Her iki tarafın da liderlik dürtüsü yüksek olduğundan dinleme ve sakinleşme alanları yaratmak bağı besler.",
    harmonyTag: "Dinamik Rezonans",
  },
  "fire-earth": {
    title: "Ateş & Toprak: Vizyon ve İnşa",
    theme: "İlhamın Somut Meyvelere Dönüşmesi",
    chemistry:
      "Ateş rüyaları ve ateşi getirirken, Toprak bu ateşi ısıya ve güvenli bir yuvaya dönüştürür. Biri başlangıçları sever, diğeri sürdürülebilirliği.",
    communication: "Ateş büyük resmi anlatırken, Toprak ayrıntıları planlar; dengelendiğinde mükemmel bir ortaklık doğar.",
    emotionalNeeds: "Ateş ilham ve hareket ararken, Toprak güven ve öngörülebilirlik talep eder.",
    growth: "Ateş sabırsızlanmamayı, Toprak ise değişime karşı direnç göstermemeyi deneyimlediğinde eşsiz bir güç doğar.",
    harmonyTag: "Köklenen Vizyon",
  },
  "fire-air": {
    title: "Ateş & Hava: Körüklenen Işık",
    theme: "Zihinsel Kıvılcım ve Sonsuz Heyecan",
    chemistry:
      "Hava Ateş'i körükler, Ateş ise Hava'nın zihnindeki fikirleri hayata geçirmesi için cesaret verir. Birlikte saatlerce konuşabilir ve yeni dünyalar hayal edebilirsiniz.",
    communication: "Kelimeler hızlı, esprili ve entelektüel. Zihinsel uyum en güçlü çekim alanıdır.",
    emotionalNeeds: "Birlikte eğlenme, yenilikler deneme ve baskı hissetmeme arzusu ön plandadır.",
    growth: "Fikirlerin uçuştuğu yerde pratik sorumlulukları da hatırlamak ve sakinleşme anları yaratmak ilişkiyi korur.",
    harmonyTag: "Işıldayan Uyum",
  },
  "fire-water": {
    title: "Ateş & Su: Buharın Dansı",
    theme: "Duygusal Yoğunluk ve Manyetik Çekim",
    chemistry:
      "Karşıt gibi görünen ama birbirini derinden dönüştüren bir kimya. Ateş Su'ya cesaret ve eylem getirirken; Su Ateş'e incelik ve merhamet katar.",
    communication: "Biri doğrudan ve net konuşurken, diğeri hisleriyle satır aralarını okur. Anlayış köprüsü zamanla olgunlaşır.",
    emotionalNeeds: "Ateş güvenli bir onay isterken, Su derin bir şefkat ve kırılganlık alanı arar.",
    growth: "Ateşin sözleri doğrudan, Suyun kalbi derindir. İletişimde nazik bir özen birbirinizi büyütür.",
    harmonyTag: "Dönüştürücü Manyetizma",
  },
  "earth-earth": {
    title: "Toprak & Toprak: Sarsılmaz Güven",
    theme: "Sessiz Sadakat ve Huzur",
    chemistry:
      "Birbirinizin varlığında derin bir emniyet hissedersiniz. Vaatler tutulur, ortak hayat adım adım, sağlam taşlarla inşa edilir.",
    communication: "Pratik, dingin ve yapıcı. Sözlerden çok eylemler sevgi dilini yansıtır.",
    emotionalNeeds: "Düzen, somut güvence ve sadakat temel ihtiyaçtır.",
    growth: "Aşırı konfor alanına çekilmeden hayatınıza hafiflik, sürprizler ve spontane anlar katmak enerjinizi tazeler.",
    harmonyTag: "Kadim Huzur",
  },
  "earth-air": {
    title: "Toprak & Hava: Yapı ve Fikir",
    theme: "Pratik Zeka ve Entelektüel Uyum",
    chemistry:
      "Hava yeni teoriler ve perspektifler sunar, Toprak ise bunları uygulanabilir stratejilere çevirir. Birbirinize dünyayı farklı gözlerle gösterirsiniz.",
    communication: "Biri mantıksal analiz yaparken, diğeri gerçekçi sınırları çizer; yapıcı fikir alışverişi yüksektir.",
    emotionalNeeds: "Hava zihinsel özgürlük isterken, Toprak somut bağ ve tutarlılık arar.",
    growth: "Toprak duygusal yakınlıkta temas ararken, Hava zihinsel bağ arar. Ortak ritüeller oluşturmak bağı derinleştirir.",
    harmonyTag: "Berrak Mantık",
  },
  "earth-water": {
    title: "Toprak & Su: Bereketli Toprak",
    theme: "Doğal Şefkat ve Besleyicilik",
    chemistry:
      "Doğanın en uyumlu döngülerinden biridir; su toprağı besler, toprak suya yatak olur. Birbirinizi yargılamadan dinler ve içten bir şefkat sunarsınız.",
    communication: "Sıcak, empatik ve dinlemeye açık. Sözsüz anlaşma seviyesi yüksektir.",
    emotionalNeeds: "Ev ortamında huzur, duygusal aidiyet ve karşılıklı özen.",
    growth: "Bazen geçmiş kırgınlıklara takılmadan affedicilik ve geleceğe umutla bakma pratiği yapmak bağı tazeler.",
    harmonyTag: "Doğal Rezonans",
  },
  "air-air": {
    title: "Hava & Hava: Ruh İkizi Zihinler",
    theme: "Sonsuz Sohbet ve Entelektüel Özgürlük",
    chemistry:
      "Birbirinizin zihnine aşık olursunuz. Kitaplar, felsefe, sanat ve insan doğası üzerine bitmeyen sohbetler bu ilişkinin can damarıdır.",
    communication: "Hızlı, kıvrak, esprili ve açık fikirli. Asla birbirinizden sıkılmazsınız.",
    emotionalNeeds: "Zihinsel uyarım, sosyal çevre ve karşılıklı kişisel alan.",
    growth: "Duyguları sadece analiz etmek yerine onları hissetmeye ve bedensel temasa alan açmak ilişkiyi derinleştirir.",
    harmonyTag: "Zihinsel İkizler",
  },
  "air-water": {
    title: "Hava & Su: Bulut ve Dalga",
    theme: "Derin Duygular ile Berrak Zihnin Buluşması",
    chemistry:
      "Hava hisleri anlamlandırmaya ve ifade etmeye çalışırken; Su mantığın ötesindeki şiirsel derinliği getirir. Büyüleyici bir yaratıcılık alanı oluşur.",
    communication: "Hava mantıkla yaklaşırken, Su hislerle yaşar. Sabırla birbirinizin dilini öğrenirsiniz.",
    emotionalNeeds: "Biri zihinsel nefes ararken, diğeri duygusal yakınlık ve şefkat arar.",
    growth: "Duyguların her zaman mantıklı bir açıklamaya ihtiyacı olmadığını kabul etmek anahtardır.",
    harmonyTag: "Şiirsel Akış",
  },
  "water-water": {
    title: "Su & Su: Okyanus Aynası",
    theme: "Sözsüz Anlayış ve Telepatik Bağ",
    chemistry:
      "Göz temasıyla konuşabilen, kelimelerin bittiği yerde birbirinin hissini algılayan derin bir empati. Kalpler tamamen açıktır.",
    communication: "Sezgisel, yumuşak ve şefkatli. Bir bakış saatlerce süren konuşmaya bedeldir.",
    emotionalNeeds: "Derin güven, duygusal saflık ve bir bütün olma hissi.",
    growth: "Birbirinizin ruh hallerinde boğulmamak için bireysel sınırlar ve dış dünyayla bağlantıyı korumak önemlidir.",
    harmonyTag: "Ruhsal Yankı",
  },
};

export default function AskVeUyumPage() {
  const { profile } = useAstria();

  const [partner1Element, setPartner1Element] = useState<ElementType>("fire");
  const [partner2Element, setPartner2Element] = useState<ElementType>("air");
  const [partner1Name, setPartner1Name] = useState(profile.name || "1. Kişi");
  const [partner2Name, setPartner2Name] = useState("2. Kişi");

  const synergyKey = [partner1Element, partner2Element].sort().join("-");
  const currentSynergy =
    SYNERGIES[synergyKey] ||
    SYNERGIES[`${partner1Element}-${partner2Element}`] ||
    SYNERGIES["fire-air"];

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
          04 · AŞK VE UYUM DENEYİMİ
        </span>
      </div>

      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#dfbe9630] bg-[#dfbe960a] backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium">
            ✦ ÇİFTLER ARASI SEMBOLİK SİMYA ✦
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#f4eee5] font-light leading-tight">
          Aşk ve Kozmik{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffdca8] via-[#dfbe96] to-[#b88c58] drop-shadow-[0_0_35px_rgba(223,190,150,0.45)]">
            Uyum
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#b8ada2] font-light leading-relaxed max-w-2xl mx-auto">
          İki insanın karşılaşması bir kehanet değil; iki farklı elementin ve içsel dünyanın simyasal etkileşimidir.
          İki kişinin elementini belirleyerek ilişkinin güçlü yönlerini ve birbirinizi büyütebileceğiniz alanları keşfet.
        </p>
      </div>

      {/* Dual Selector Panel */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Person 1 Selector */}
        <div className="rounded-2xl border border-[#dfbe9635] bg-[#120f20f0] backdrop-blur-xl p-6 shadow-[0_20px_45px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium">
              1. Kişi
            </span>
            <input
              type="text"
              value={partner1Name}
              onChange={(e) => setPartner1Name(e.target.value)}
              placeholder="İsim"
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-[#f4eee5] focus:outline-none focus:border-[#dfbe96]"
            />
          </div>

          <span className="text-[11px] text-[#a99e91] block">
            Baskın Element veya Güneş Grubu Seçin:
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {(Object.keys(ELEMENTS) as ElementType[]).map((elKey) => {
              const el = ELEMENTS[elKey];
              const isSelected = partner1Element === elKey;
              return (
                <button
                  key={elKey}
                  type="button"
                  onClick={() => setPartner1Element(elKey)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#dfbe96] bg-[#dfbe9620] text-[#f4eee5] shadow-[0_0_15px_rgba(223,190,150,0.15)]"
                      : "border-white/[0.06] bg-white/[0.02] text-[#a99e91] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs text-[#f4eee5]">{el.name}</span>
                    <span className="text-sm" style={{ color: el.color }}>{el.symbol}</span>
                  </div>
                  <span className="text-[10px] text-[#867b70] block leading-tight">{el.signs}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Person 2 Selector */}
        <div className="rounded-2xl border border-[#dfbe9635] bg-[#120f20f0] backdrop-blur-xl p-6 shadow-[0_20px_45px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium">
              2. Kişi (Partner / Arkadaş)
            </span>
            <input
              type="text"
              value={partner2Name}
              onChange={(e) => setPartner2Name(e.target.value)}
              placeholder="İsim"
              className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.1] text-xs text-[#f4eee5] focus:outline-none focus:border-[#dfbe96]"
            />
          </div>

          <span className="text-[11px] text-[#a99e91] block">
            Baskın Element veya Güneş Grubu Seçin:
          </span>

          <div className="grid grid-cols-2 gap-2.5">
            {(Object.keys(ELEMENTS) as ElementType[]).map((elKey) => {
              const el = ELEMENTS[elKey];
              const isSelected = partner2Element === elKey;
              return (
                <button
                  key={elKey}
                  type="button"
                  onClick={() => setPartner2Element(elKey)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#dfbe96] bg-[#dfbe9620] text-[#f4eee5] shadow-[0_0_15px_rgba(223,190,150,0.15)]"
                      : "border-white/[0.06] bg-white/[0.02] text-[#a99e91] hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs text-[#f4eee5]">{el.name}</span>
                    <span className="text-sm" style={{ color: el.color }}>{el.symbol}</span>
                  </div>
                  <span className="text-[10px] text-[#867b70] block leading-tight">{el.signs}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Synergy Results Report Card */}
      <div className="max-w-5xl mx-auto rounded-2xl border border-[#dfbe9635] bg-[#100d1df8] backdrop-blur-2xl p-7 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,rgba(255,174,192,0.12),transparent_70%)] pointer-events-none" />

        {/* Report Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-widest text-[#dfbe96] font-medium">
                {partner1Name} ({ELEMENTS[partner1Element].name}) + {partner2Name} ({ELEMENTS[partner2Element].name})
              </span>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl text-[#f4eee5] font-light">
              {currentSynergy.title}
            </h2>
            <p className="text-xs text-[#dfbe96] font-medium mt-1">
              {currentSynergy.theme}
            </p>
          </div>

          <div className="px-4 py-1.5 rounded-full border border-[#dfbe9640] bg-[#dfbe9615] text-xs text-[#dfbe96] font-medium">
            {currentSynergy.harmonyTag}
          </div>
        </div>

        {/* 4 Synergy Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dimension 1: Chemistry */}
          <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium block">
              ✦ İlişki Dinamikleri ve Kimya
            </span>
            <p className="text-xs text-[#cfc2b3] font-light leading-relaxed">
              {currentSynergy.chemistry}
            </p>
          </div>

          {/* Dimension 2: Communication */}
          <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium block">
              ✦ İletişim Akışı ve Dil
            </span>
            <p className="text-xs text-[#cfc2b3] font-light leading-relaxed">
              {currentSynergy.communication}
            </p>
          </div>

          {/* Dimension 3: Emotional Needs */}
          <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium block">
              ✦ Duygusal İhtiyaçlar ve Güven
            </span>
            <p className="text-xs text-[#cfc2b3] font-light leading-relaxed">
              {currentSynergy.emotionalNeeds}
            </p>
          </div>

          {/* Dimension 4: Growth Area */}
          <div className="p-5 rounded-xl border border-[#dfbe9625] bg-[#14102680] space-y-2">
            <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium block">
              ✦ Birlikte Büyüme ve Gelişim Alanı
            </span>
            <p className="text-xs text-[#d6ccc0] font-light leading-relaxed">
              {currentSynergy.growth}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.06] text-[10px] text-[#867b70] italic">
          * ASTRIA uyum analizleri iki insanın kaderini tayin etmez; karşılıklı anlayış, empati ve saygıyla inşa edilecek sağlıklı iletişime sembolik bir ışık tutar.
        </div>
      </div>
    </div>
  );
}

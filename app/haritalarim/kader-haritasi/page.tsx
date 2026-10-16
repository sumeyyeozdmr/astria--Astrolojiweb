"use client";

import { useState } from "react";
import Link from "next/link";
import { useAstria } from "@/context/AstriaContext";

interface DestinyTheme {
  id: string;
  category: string;
  title: string;
  symbol: string;
  keyMotto: string;
  description: string;
  potentials: string[];
  growthArea: string;
  reflectionQuestion: string;
}

const DESTINY_THEMES: DestinyTheme[] = [
  {
    id: "purpose",
    category: "01 · RUHSAL PUSULA",
    title: "Yaşam Amacı ve Yaratıcı İnşa",
    symbol: "⟡",
    keyMotto: "Kalıcı Değer Üretmek ve Kök Salmak",
    description:
      "Kader haritan, aceleci atılımlar yerine sağlam temellere dayalı bir eser bırakma arzusunu işaret ediyor. Hayattaki doyumun, başkalarının hızına yetişmekte değil; kendi içsel ritminde köklenen değerleri görünür kılmakta saklıdır.",
    potentials: [
      "Kriz anlarında sakin kalabilen doğal denge",
      "Soyut fikirleri pratik ve sürdürülebilir yapılara dönüştürme yetisi",
      "Zamanın yıpratamayacağı sadakat ve güven ortamı yaratabilme",
    ],
    growthArea:
      "Değişim rüzgârları estiğinde aşırı direnç göstermek yerine esneklik geliştirmek.",
    reflectionQuestion:
      "Bugün inşa ettiğin şeyler ruhunu besliyor mu, yoksa yalnızca güvende hissetme alışkanlığından mı besleniyor?",
  },
  {
    id: "talents",
    category: "02 · GİZLİ CEVHERLER",
    title: "İçsel Potansiyeller ve Özgün Işık",
    symbol: "✧",
    keyMotto: "Sezgisel Ustalık ve Zanaat",
    description:
      "Kaderinde en çok parıldayan nokta, zihninle ellerinin, bilginle şefkatinin buluştuğu zanaat alanlarıdır. İnsanların karmaşık bulduğu durumları berraklaştırıp estetik bir sadeliğe kavuşturma yeteneğine sahipsin.",
    potentials: [
      "Ayrıntılardaki saklı ahengi ve kusursuzluğu sezebilme",
      "Kelimelerle insanları yatıştırma ve yönlendirme gücü",
      "Kendi sınırlarını koruyarak başkalarına rehberlik edebilme",
    ],
    growthArea:
      "Mükemmeliyetçilik tuzağına düşüp eserini veya fikirlerini dünyadan saklamamak.",
    reflectionQuestion:
      "Hangi yeteneğini 'herkes yapabilir zaten' diyerek hafife alıyorsun?",
  },
  {
    id: "evolution",
    category: "03 · DÖNÜŞÜM ALANI",
    title: "Kişisel Gelişim ve Karşıtlıklar",
    symbol: "☾",
    keyMotto: "Tutkuyu Bilgelikle Bütünleştirmek",
    description:
      "Hayatının belirli dönemeçlerinde güvenli limanlardan çıkıp bilinmeze yelken açma davetleri alacaksın. Kader haritandaki en büyük evrim, konfor alanı ile cesaret arasındaki o ince köprüde gerçekleşir.",
    potentials: [
      "Zorlukları birer dönüştürücü derse çevirebilme direnci",
      "Başkalarının göremediği duygusal derinlikleri anlayabilme",
      "Kendi hakikatine sadık kalarak saygın bir duruş sergileyebilme",
    ],
    growthArea:
      "Belirsizlikten korkup kontrol etme arzusunu bırakıp akışa güvenebilmek.",
    reflectionQuestion:
      "Eğer başarısız olma ihtimalin olmasaydı, bugün hayatında hangi dönüştürücü adımı atardın?",
  },
];

export default function KaderHaritasiPage() {
  const { profile } = useAstria();
  const [activeThemeId, setActiveThemeId] = useState<string>("purpose");

  const currentTheme =
    DESTINY_THEMES.find((t) => t.id === activeThemeId) || DESTINY_THEMES[0];

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
          HARİTALARIM · 02 KADER HARİTASI
        </span>
      </div>

      {/* Page Title & Philosophy */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#dfbe9630] bg-[#dfbe960a] backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium">
            ✦ YAŞAM TEMALARI VE POTANSİYELLER ✦
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#f4eee5] font-light leading-tight">
          Kader Haritası &{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffdca8] via-[#dfbe96] to-[#b88c58] drop-shadow-[0_0_35px_rgba(223,190,150,0.45)]">
            Yaşam Temaların
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#b8ada2] font-light leading-relaxed max-w-2xl mx-auto">
          Kader Haritası, değişmez bir yazgıyı değil; hayat yolculuğundaki temel temalarını, açığa çıkmayı bekleyen potansiyellerini ve kendini geliştirme alanlarını sembolik bir bakışla sunar.
        </p>
      </div>

      {/* User Connection Banner (Uses Profile from Birth Chart automatically) */}
      <div className="rounded-2xl border border-[#dfbe9630] bg-[#120f22cc] backdrop-blur-xl p-5 md:p-6 max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_20px_45px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#dfbe9618] border border-[#dfbe9640] flex items-center justify-center text-lg text-[#dfbe96]">
            {profile.sunSymbol || "☉"}
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium">
              {profile.isSet ? "Kayıtlı Profiliniz Kullanılıyor" : "Örnek Profil Koordinatları"}
            </div>
            <div className="text-sm text-[#f4eee5] font-light">
              {profile.birthPlace} · {profile.sunSign} Güneş, {profile.moonSign} Ay
            </div>
          </div>
        </div>

        <Link
          href="/haritalarim/dogum-haritasi"
          className="text-xs text-[#dfbe96] hover:underline flex items-center gap-1.5"
        >
          <span>Bilgileri Değiştir</span>
          <span>→</span>
        </Link>
      </div>

      {/* Theme Navigation Tabs & Detail Workspace */}
      <div className="max-w-5xl mx-auto space-y-6">
        {/* 3 Theme Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {DESTINY_THEMES.map((theme) => {
            const isSelected = activeThemeId === theme.id;
            return (
              <button
                key={theme.id}
                type="button"
                onClick={() => setActiveThemeId(theme.id)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? "border-[#dfbe96] bg-[#181329f8] shadow-[0_15px_35px_rgba(223,190,150,0.18)]"
                    : "border-white/[0.06] bg-[#100d1df0] text-[#a99e91] hover:text-[#f4eee5] hover:border-[#dfbe9640]"
                }`}
              >
                <span className="w-8 h-8 rounded-lg bg-[#dfbe9618] border border-[#dfbe9635] flex items-center justify-center text-sm text-[#dfbe96] shrink-0">
                  {theme.symbol}
                </span>
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#867b70] block mb-1">
                    {theme.category}
                  </span>
                  <span className="font-serif text-base text-[#f4eee5] font-medium block">
                    {theme.title}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Theme Detailed Card */}
        <div className="rounded-2xl border border-[#dfbe9635] bg-[#100d1df8] backdrop-blur-2xl p-7 md:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-7 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,rgba(223,190,150,0.14),transparent_70%)] pointer-events-none" />

          {/* Theme Banner */}
          <div className="pb-6 border-b border-white/[0.08]">
            <span className="text-xs uppercase tracking-widest text-[#dfbe96] font-medium block mb-2">
              {currentTheme.category}
            </span>
            <h2 className="font-serif text-2xl md:text-3xl text-[#f4eee5] font-light mb-2">
              {currentTheme.title}
            </h2>
            <p className="text-sm text-[#dfbe96] italic font-serif">
              &quot;{currentTheme.keyMotto}&quot;
            </p>
          </div>

          {/* Theme Description */}
          <p className="text-sm text-[#cfc2b3] font-light leading-relaxed">
            {currentTheme.description}
          </p>

          {/* Core Strengths / Potentials List */}
          <div>
            <span className="text-xs uppercase tracking-widest text-[#dfbe96] font-medium block mb-3">
              ✦ Bu Temanın Sana Sunduğu Güçlü Potansiyeller
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {currentTheme.potentials.map((item, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] text-xs text-[#d6ccc0] font-light leading-relaxed"
                >
                  <span className="text-[#dfbe96] mr-1.5 font-medium">0{i + 1}.</span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Growth Area & Contemplation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-xl border border-[#dfbe9625] bg-[#14102680] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#dfbe96] font-medium block">
                Gelişim ve Esneklik Alanı
              </span>
              <p className="text-xs text-[#cfc2b3] font-light leading-relaxed">
                {currentTheme.growthArea}
              </p>
            </div>

            <div className="p-5 rounded-xl border border-[#dfbe9625] bg-[#14102680] space-y-2">
              <span className="text-[10px] uppercase tracking-wider text-[#dfbe96] font-medium block">
                Kişisel Tefekkür Sorusu
              </span>
              <p className="text-xs text-[#f4eee5] italic font-light leading-relaxed">
                &quot;{currentTheme.reflectionQuestion}&quot;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useAstria } from "@/context/AstriaContext";
import NatalChartWheel from "@/components/NatalChartWheel";
import { buildFullNatalChart, getDefaultNatalChart } from "@/lib/astrology/chartModel";
import { CalculatedPlacement, FullNatalChartData, ZodiacElement } from "@/lib/astrology/types";

export default function DogumHaritasiPage() {
  const { profile, saveProfile } = useAstria();

  const [birthDate, setBirthDate] = useState(profile.birthDate || "1996-05-14");
  const [birthTime, setBirthTime] = useState(profile.birthTime || "14:30");
  const [birthPlace, setBirthPlace] = useState(profile.birthPlace || "İstanbul, Türkiye");

  const [fullChart, setFullChart] = useState<FullNatalChartData>(getDefaultNatalChart);
  const [activePlacementId, setActivePlacementId] = useState<string>("sun");
  const [activeTab, setActiveTab] = useState<"yerlesimler" | "cark" | "tematik" | "evler" | "acilar">("yerlesimler");
  const [selectedHouseNum, setSelectedHouseNum] = useState<number>(1);
  const [isCalculated, setIsCalculated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Profil verisi localStorage'dan yüklendiğinde inputları senkronize et
  useEffect(() => {
    if (profile.isSet) {
      if (profile.birthDate) setBirthDate(profile.birthDate);
      if (profile.birthTime) setBirthTime(profile.birthTime);
      if (profile.birthPlace) setBirthPlace(profile.birthPlace);
    }
  }, [profile.isSet, profile.birthDate, profile.birthTime, profile.birthPlace]);

  // Daha önce hesaplanmış harita varsa geri yükle
  useEffect(() => {
    try {
      const savedChartJson = localStorage.getItem("astria_full_natal_chart");
      const savedIsCalc = localStorage.getItem("astria_is_calculated");
      if (savedChartJson && savedIsCalc === "true") {
        const parsed = JSON.parse(savedChartJson) as FullNatalChartData;
        if (parsed && parsed.placements && parsed.placements.length > 0) {
          setFullChart(parsed);
          setIsCalculated(true);
        }
      }
    } catch {}
  }, []);

  const placements = fullChart.placements;
  const activePlacement = useMemo(() => {
    return (
      placements.find((p) => p.id === activePlacementId) ||
      placements[0] ||
      getDefaultNatalChart().placements[0]
    );
  }, [placements, activePlacementId]);

  const cusps = useMemo(() => {
    return fullChart.houses.map((h) => h.cuspLongitude);
  }, [fullChart.houses]);

  const elementPercent = (element: ZodiacElement) => {
    return fullChart.elementBreakdown[element]?.percentage || 25;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ birthDate, birthTime, birthPlace }),
      });
      const data = await response.json();

      if (!response.ok || !data.success || !data.chart) {
        throw new Error(data.message || "Harita hesaplanamadı. Bilgilerini kontrol edip tekrar dene.");
      }

      // Build genuine multi-dimensional natal chart model
      const chartModel = buildFullNatalChart(data.chart, data.birthInfo || {
        birthDate,
        birthTime,
        birthPlace,
      });

      if (!chartModel.placements || chartModel.placements.length === 0) {
        throw new Error("Hesaplama tamamlandı ancak gök cisimleri okunamadı.");
      }

      setFullChart(chartModel);
      setIsCalculated(true);

      const sunPlacement = chartModel.placements.find((p) => p.id === "sun");
      const moonPlacement = chartModel.placements.find((p) => p.id === "moon");
      const risingPlacement = chartModel.placements.find((p) => p.id === "ascendant");

      saveProfile({
        birthDate,
        birthTime,
        birthPlace: data.birthInfo?.birthPlace || birthPlace,
        sunSign: sunPlacement?.sign,
        sunSymbol: sunPlacement?.signSymbol,
        moonSign: moonPlacement?.sign,
        moonSymbol: moonPlacement?.signSymbol,
        risingSign: risingPlacement?.sign,
        risingSymbol: risingPlacement?.signSymbol,
      });

      try {
        localStorage.setItem("astria_full_natal_chart", JSON.stringify(chartModel));
        localStorage.setItem("astria_calculated_placements", JSON.stringify(chartModel.placements));
        localStorage.setItem("astria_is_calculated", "true");
      } catch {}
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Beklenmeyen bir hata oluştu. Lütfen tekrar dene."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
          HARİTALARIM · 01 DOĞUM HARİTASI
        </span>
      </div>

      {/* Main Page Headline as Requested */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#dfbe9630] bg-[#dfbe960a] backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium">
            ✦ KİŞİSEL DOĞUM HARİTASI ✦
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-[52px] text-[#f4eee5] font-light leading-tight">
          Gökyüzünün doğduğun anda sana anlattığı{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffdca8] via-[#dfbe96] to-[#b88c58] drop-shadow-[0_0_35px_rgba(223,190,150,0.45)]">
            hikâyeyi keşfet.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#b8ada2] font-light leading-relaxed max-w-2xl mx-auto">
          Doğduğun anda gökyüzünün aldığı sembolik geometriyi, Güneş, Ay ve Yükselen konumlarını çözümle.
          Geleceği haber veren bir kehanet değil, kendini anlaman için kadim bir aynadır.
        </p>
      </div>

      {/* 2-Column Workspace: Form & Interactive Placements */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        {/* Left Column: Form & Quick Placements (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#dfbe9635] bg-[#120f1df0] backdrop-blur-2xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_top_right,rgba(223,190,150,0.12),transparent_70%)] pointer-events-none rounded-tr-2xl" />

            <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
              <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium flex items-center gap-1.5">
                <span>☉</span>
                <span>Doğum Parametreleri</span>
              </span>
              <span className="text-[10px] text-[#867b70]">Zorunlu Üyelik Yok</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="birth-date"
                  className="block text-[11px] uppercase tracking-wider text-[#a99e91] mb-1.5"
                >
                  Doğum Tarihi
                </label>
                <input
                  id="birth-date"
                  type="date"
                  required
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#141024] border border-[#dfbe9635] text-xs text-[#f4eee5] focus:outline-none focus:border-[#dfbe96] focus:ring-1 focus:ring-[#dfbe96] transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="birth-time"
                    className="block text-[11px] uppercase tracking-wider text-[#a99e91] mb-1.5"
                  >
                    Doğum Saati
                  </label>
                  <input
                    id="birth-time"
                    type="time"
                    required
                    value={birthTime}
                    onChange={(e) => setBirthTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141024] border border-[#dfbe9635] text-xs text-[#f4eee5] focus:outline-none focus:border-[#dfbe96] focus:ring-1 focus:ring-[#dfbe96] transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="birth-place"
                    className="block text-[11px] uppercase tracking-wider text-[#a99e91] mb-1.5"
                  >
                    Doğum Yeri
                  </label>
                  <input
                    id="birth-place"
                    type="text"
                    required
                    placeholder="Şehir, Ülke"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141024] border border-[#dfbe9635] text-xs text-[#f4eee5] focus:outline-none focus:border-[#dfbe96] focus:ring-1 focus:ring-[#dfbe96] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl text-xs uppercase tracking-[0.16em] font-medium text-[#110c07] bg-gradient-to-r from-[#fae2c0] via-[#dfbe96] to-[#be905c] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_20px_rgba(223,190,150,0.25)] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-[#110c07] border-t-transparent rounded-full animate-spin" />
                    <span>Harita Hesaplanıyor...</span>
                  </>
                ) : (
                  <>
                    <span>Haritamı Çözümle</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            {errorMessage && (
              <p role="alert" className="mt-3 text-xs leading-relaxed text-rose-300">
                {errorMessage}
              </p>
            )}
            {isCalculated && (
              <p role="status" className="mt-3 text-xs text-emerald-300">
                Haritan hesaplandı. Gezegen yerleşimleri, evler ve açılar girdiğin bilgilere göre güncellendi.
              </p>
            )}

            <div className="pt-4 mt-4 border-t border-white/[0.04] text-[10px] text-[#786e63]">
              * Girdiğin bilgiler yalnızca bu tarayıcıda saklanır ve profil sayfanda otomatik olarak hatırlanır.
            </div>
          </div>

          {/* Quick Placements Selector */}
          <div className="rounded-2xl border border-[#dfbe9628] bg-[#0c091ad0] backdrop-blur-xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#dfbe96] font-medium">
                Kozmik Yerleşimleri İncele
              </span>
              <span className="text-[10px] text-[#867b70]">
                {placements.length} Gök Cismi
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[460px] overflow-y-auto pr-1">
              {placements.map((p) => {
                const isSelected = activePlacement.id === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setActivePlacementId(p.id);
                      if (activeTab === "tematik" || activeTab === "evler") {
                        setActiveTab("yerlesimler");
                      }
                    }}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#dfbe96] bg-[#dfbe9618] text-[#f4eee5] shadow-[0_0_15px_rgba(223,190,150,0.15)]"
                        : "border-white/[0.06] bg-[#14102260] text-[#a99e91] hover:text-[#f4eee5] hover:border-[#dfbe9640]"
                    }`}
                  >
                    <span className="text-base text-[#dfbe96]">{p.symbol}</span>
                    <div className="truncate">
                      <div className="text-xs font-medium truncate flex items-center gap-1">
                        <span>{p.planet}</span>
                        {p.isRetrograde && (
                          <span className="text-[9px] text-rose-400 font-bold">℞</span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#867b70]">
                        {p.sign} {p.signSymbol} · {p.house}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Analysis Workspace (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Analysis View Navigation Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#0c0919d8] border border-[#dfbe9625] backdrop-blur-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab("yerlesimler")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "yerlesimler"
                  ? "bg-[#dfbe9618] border border-[#dfbe96] text-[#f4eee5] shadow-[0_0_12px_rgba(223,190,150,0.15)]"
                  : "border border-transparent text-[#a99e91] hover:text-[#f4eee5] hover:bg-white/[0.04]"
              }`}
            >
              ☉ Yerleşim
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("cark")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "cark"
                  ? "bg-[#dfbe9618] border border-[#dfbe96] text-[#f4eee5] shadow-[0_0_12px_rgba(223,190,150,0.15)]"
                  : "border border-transparent text-[#a99e91] hover:text-[#f4eee5] hover:bg-white/[0.04]"
              }`}
            >
              ☸ Harita Çarkı
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tematik")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "tematik"
                  ? "bg-[#dfbe9618] border border-[#dfbe96] text-[#f4eee5] shadow-[0_0_12px_rgba(223,190,150,0.15)]"
                  : "border border-transparent text-[#a99e91] hover:text-[#f4eee5] hover:bg-white/[0.04]"
              }`}
            >
              ✦ Tematik Sentezler
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("evler")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "evler"
                  ? "bg-[#dfbe9618] border border-[#dfbe96] text-[#f4eee5] shadow-[0_0_12px_rgba(223,190,150,0.15)]"
                  : "border border-transparent text-[#a99e91] hover:text-[#f4eee5] hover:bg-white/[0.04]"
              }`}
            >
              ⌂ 12 Yaşam Evi
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("acilar")}
              className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === "acilar"
                  ? "bg-[#dfbe9618] border border-[#dfbe96] text-[#f4eee5] shadow-[0_0_12px_rgba(223,190,150,0.15)]"
                  : "border border-transparent text-[#a99e91] hover:text-[#f4eee5] hover:bg-white/[0.04]"
              }`}
            >
              ☌ Açı Analizi
            </button>
          </div>

          {/* TAB 1: ACTIVE PLACEMENT DETAIL */}
          {activeTab === "yerlesimler" && (
            <div className="rounded-2xl border border-[#dfbe9635] bg-[#0d091fd8] backdrop-blur-xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-6">
              <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,rgba(223,190,150,0.15),transparent_70%)] pointer-events-none" />

              <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#dfbe9630] to-[#dfbe9608] border border-[#dfbe9660] flex items-center justify-center text-2xl text-[#dfbe96] shadow-[0_0_20px_rgba(223,190,150,0.2)]">
                    {activePlacement.symbol}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-serif text-2xl text-[#f4eee5] font-light">
                        {activePlacement.planet} · {activePlacement.sign}
                      </h2>
                      <span className="text-sm text-[#dfbe96]">{activePlacement.signSymbol}</span>
                      {activePlacement.isRetrograde && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 border border-rose-500/30 text-rose-300">
                          Retrograd ℞
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-[#a99e91]">
                      {activePlacement.degree} · {activePlacement.house}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-[#dfbe9618] border border-[#dfbe9640] text-[#dfbe96] font-medium">
                    {activePlacement.element}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider bg-white/[0.04] border border-white/[0.08] text-[#a99e91]">
                    {activePlacement.modality}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#dfbe96] font-medium block mb-1">
                    Arketipsel Çekirdek · {activePlacement.theme}
                  </span>
                  <p className="text-sm text-[#d6ccc0] font-light leading-relaxed">
                    {activePlacement.insight}
                  </p>
                </div>

                {/* Strengths & Growth Areas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-300 font-medium flex items-center gap-1.5">
                      <span>✓</span>
                      <span>Öne Çıkan Güçlü Yönler</span>
                    </span>
                    <ul className="space-y-1 text-xs text-[#d6ccc0] font-light">
                      {activePlacement.strengths?.map((str, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-emerald-400 mt-0.5">·</span>
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/5 space-y-1.5">
                    <span className="text-[10px] uppercase tracking-wider text-amber-300 font-medium flex items-center gap-1.5">
                      <span>✦</span>
                      <span>Gelişim & Denge Alanı</span>
                    </span>
                    <ul className="space-y-1 text-xs text-[#d6ccc0] font-light">
                      {activePlacement.growthAreas?.map((area, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-amber-400 mt-0.5">·</span>
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Major Aspects Connected to this Planet */}
                {activePlacement.aspects && activePlacement.aspects.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-white/[0.06] bg-[#14102660] space-y-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#dfbe96] font-medium block">
                      Bu Gezegenin Diğer Gök Cisimleriyle Açıları
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activePlacement.aspects.map((asp, idx) => {
                        const otherBody =
                          asp.bodyA.key === activePlacement.id ? asp.bodyB : asp.bodyA;
                        return (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs bg-[#dfbe960e] border border-[#dfbe9630] text-[#e8dfd5]"
                          >
                            <span className="text-[#dfbe96]">{asp.aspectSymbol}</span>
                            <span>{asp.aspectName}</span>
                            <span className="text-[#dfbe96] font-medium">{otherBody.name}</span>
                            <span className="text-[10px] text-[#867b70]">({asp.orbText})</span>
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Reflection Question */}
                <div className="p-4 rounded-xl border border-[#dfbe9625] bg-[#14102680] space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-[#dfbe96] font-medium flex items-center gap-1.5">
                    <span>✦</span>
                    <span>Kişisel Tefekkür Sorusu</span>
                  </span>
                  <p className="text-xs text-[#b8ada2] italic font-light">
                    &quot;{activePlacement.reflectionQuestion}&quot;
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NATAL CHART WHEEL */}
          {activeTab === "cark" && (
            <div className="rounded-2xl border border-[#dfbe9635] bg-[#0d091fd8] backdrop-blur-xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <h2 className="font-serif text-xl text-[#f4eee5] font-light">
                    Gerçek Geometrik Doğum Haritası Çarkı
                  </h2>
                  <p className="text-xs text-[#a99e91]">
                    Eğim dereceleri, 12 Placidus evi ve açılar kesin boylamlarla hesaplanmıştır.
                  </p>
                </div>
                <span className="text-xs text-[#dfbe96] border border-[#dfbe9640] px-2.5 py-1 rounded-full bg-[#dfbe9610]">
                  ASC: {fullChart.angles.asc.degreeFormatted}
                </span>
              </div>

              <div className="py-2">
                <NatalChartWheel
                  placements={placements}
                  cusps={cusps}
                  aspects={fullChart.aspects}
                  ascLongitude={fullChart.angles.asc.longitude}
                  mcLongitude={fullChart.angles.mc.longitude}
                  activePlacementId={activePlacement.id}
                  onSelectPlacement={(id) => {
                    setActivePlacementId(id);
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-white/[0.06] text-[11px] text-[#a99e91]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                    <span>Üçgen / Sekstil (Uyumlu)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
                    <span>Kare / Karşıt (Dinamik)</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                    <span>Kavuşum (Odak)</span>
                  </span>
                </div>
                <span className="text-[#867b70]">Sembollere tıklayarak yerleşimi seçebilirsin</span>
              </div>
            </div>
          )}

          {/* TAB 3: THEMATIC MULTI-DIMENSIONAL SYNTHESIS */}
          {activeTab === "tematik" && (
            <div className="space-y-4">
              {/* Personality Card */}
              <div className="rounded-2xl border border-[#dfbe9635] bg-[#0d091fd8] backdrop-blur-xl p-6 md:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#dfbe96] font-medium">
                  <span>☉ ☽ ↑</span>
                  <span>Kişilik & Bütünsel Benlik Sentezi</span>
                </div>
                <h3 className="font-serif text-lg text-[#f4eee5] font-light">
                  {fullChart.synthesis.personality.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[#d6ccc0] font-light leading-relaxed">
                  {fullChart.synthesis.personality.sunMoonRisingSynthesis}
                </p>
                <p className="text-xs text-[#a99e91] font-light leading-relaxed">
                  {fullChart.synthesis.personality.mindAndCommunication}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-[#d6ccc0]">
                    <span className="text-[10px] text-emerald-300 uppercase block font-medium mb-1">
                      Temel Güçlü Yönler
                    </span>
                    {fullChart.synthesis.personality.coreStrengths.join(" · ")}
                  </div>
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-[#d6ccc0]">
                    <span className="text-[10px] text-amber-300 uppercase block font-medium mb-1">
                      İçsel Gerilim & Gelişim
                    </span>
                    {fullChart.synthesis.personality.innerTensionsAndGrowth.join(" · ")}
                  </div>
                </div>
              </div>

              {/* Love & Relationships Card */}
              <div className="rounded-2xl border border-[#dfbe9635] bg-[#0d091fd8] backdrop-blur-xl p-6 md:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#dfbe96] font-medium">
                  <span>♀ ♂</span>
                  <span>Aşk, Çekim & İlişki Dinamikleri</span>
                </div>
                <h3 className="font-serif text-lg text-[#f4eee5] font-light">
                  {fullChart.synthesis.relationships.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[#d6ccc0] font-light leading-relaxed">
                  {fullChart.synthesis.relationships.loveStyle}
                </p>
                <p className="text-xs text-[#a99e91] font-light leading-relaxed">
                  {fullChart.synthesis.relationships.venusMarsDynamic}
                </p>
                <div className="p-3 rounded-xl bg-[#dfbe960c] border border-[#dfbe9625] text-xs text-[#dfbe96]">
                  <span className="font-medium">İlişki Rehberliği: </span>
                  <span className="text-[#d6ccc0]">{fullChart.synthesis.relationships.constructiveAdvice}</span>
                </div>
              </div>

              {/* Career & Life Purpose Card */}
              <div className="rounded-2xl border border-[#dfbe9635] bg-[#0d091fd8] backdrop-blur-xl p-6 md:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#dfbe96] font-medium">
                  <span>MC ♄ ♃</span>
                  <span>Kariyer, Başarı & Yaşam Yönelimi</span>
                </div>
                <h3 className="font-serif text-lg text-[#f4eee5] font-light">
                  {fullChart.synthesis.career.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[#d6ccc0] font-light leading-relaxed">
                  {fullChart.synthesis.career.mcAndLifeDirection}
                </p>
                <p className="text-xs text-[#a99e91] font-light leading-relaxed">
                  {fullChart.synthesis.career.workStyleAndHabits}
                </p>
                <p className="text-xs text-[#dfbe96] font-light">
                  {fullChart.synthesis.career.inspirationalFields}
                </p>
              </div>

              {/* Emotional Security & 4th House */}
              <div className="rounded-2xl border border-[#dfbe9635] bg-[#0d091fd8] backdrop-blur-xl p-6 md:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-3">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#dfbe96] font-medium">
                  <span>☽ ⌂</span>
                  <span>Duygusal Dünya, Güven & İçsel Yuva</span>
                </div>
                <h3 className="font-serif text-lg text-[#f4eee5] font-light">
                  {fullChart.synthesis.emotional.headline}
                </h3>
                <p className="text-xs sm:text-sm text-[#d6ccc0] font-light leading-relaxed">
                  {fullChart.synthesis.emotional.moonNeeds}
                </p>
                <p className="text-xs text-[#a99e91] font-light leading-relaxed">
                  {fullChart.synthesis.emotional.safeHavenFourthHouse}
                </p>
                <div className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/20 text-xs text-purple-200">
                  <span className="font-medium">Kendine Şefkat Önerisi: </span>
                  <span className="text-[#d6ccc0]">{fullChart.synthesis.emotional.selfCareSuggestion}</span>
                </div>
              </div>

              {/* Holistic Wellness (Strictly non-medical, symbolic well-being) */}
              <div className="rounded-2xl border border-[#dfbe9625] bg-[#0a0717d0] backdrop-blur-xl p-5 space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#dfbe96] font-medium block">
                  ✦ Bütünsel İyi Oluş & Kozmik Denge Farkındalığı
                </span>
                <p className="text-xs text-[#a99e91] font-light leading-relaxed">
                  {fullChart.synthesis.holistic.vitalityTheme} {fullChart.synthesis.holistic.mindBodyRhythm}
                </p>
                <div className="text-[11px] text-[#786e63] italic pt-1 border-t border-white/[0.04]">
                  * Bu bölüm astrolojik gelenekteki sembolik ritimler üzerinedir; tıbbi teşhis, tedavi veya sağlık tahmini içermez.
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 12 HOUSES DETAILED VIEW */}
          {activeTab === "evler" && (
            <div className="space-y-4">
              {/* House selector pills */}
              <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5 p-2 rounded-2xl bg-[#0c0919d8] border border-[#dfbe9625]">
                {fullChart.houses.map((house) => {
                  const isSelected = selectedHouseNum === house.number;
                  return (
                    <button
                      key={house.number}
                      type="button"
                      onClick={() => setSelectedHouseNum(house.number)}
                      className={`py-2 rounded-xl text-center text-xs transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#dfbe96] text-[#0d091f] font-bold shadow-[0_0_12px_rgba(223,190,150,0.3)]"
                          : "text-[#a99e91] hover:text-[#f4eee5] hover:bg-white/[0.04]"
                      }`}
                    >
                      {house.number}
                    </button>
                  );
                })}
              </div>

              {/* Selected House Card */}
              {(() => {
                const house = fullChart.houses.find((h) => h.number === selectedHouseNum) || fullChart.houses[0];
                return (
                  <div className="rounded-2xl border border-[#dfbe9635] bg-[#0d091fd8] backdrop-blur-xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-5">
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="font-serif text-2xl text-[#f4eee5] font-light">
                            {house.title}
                          </h2>
                          <span className="text-base text-[#dfbe96]">{house.signSymbol}</span>
                        </div>
                        <span className="text-xs text-[#a99e91]">
                          Giriş Çizgisi: {house.cuspDegreeFormatted} (Placidus)
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-xs text-[#dfbe96] font-medium">
                          Yönetici: {house.rulerPlanet}
                        </div>
                        {house.rulerHouse && (
                          <div className="text-[10px] text-[#867b70]">
                            Yönetici {house.rulerHouse}. Evde
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#dfbe96] font-medium block mb-1">
                          Yaşam Teması · {house.theme}
                        </span>
                        <p className="text-sm text-[#d6ccc0] font-light leading-relaxed">
                          {house.interpretation}
                        </p>
                      </div>

                      <div className="p-4 rounded-xl border border-white/[0.06] bg-[#14102660] space-y-2">
                        <span className="text-[10px] uppercase tracking-wider text-[#dfbe96] font-medium block">
                          Bu Evde Konumlanan Gök Cisimleri
                        </span>
                        {house.planetsInside.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {house.planetsInside.map((p, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#dfbe9618] border border-[#dfbe9640] text-xs text-[#f4eee5]"
                              >
                                <span className="text-[#dfbe96] text-sm">{p.symbol}</span>
                                <span className="font-medium">{p.name}</span>
                                <span className="text-[#a99e91] text-[11px]">({p.sign} {p.degree})</span>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-[#867b70] italic">
                            Bu evde doğrudan bir gezegen bulunmuyor. Evin deneyimleri burcu olan {house.sign} ve yöneticisi {house.rulerPlanet} üzerinden akar.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* TAB 5: GEZEGEN AÇILARI (ASPECTS TABLE) */}
          {activeTab === "acilar" && (
            <div className="rounded-2xl border border-[#dfbe9635] bg-[#0d091fd8] backdrop-blur-xl p-6 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div>
                  <h2 className="font-serif text-xl text-[#f4eee5] font-light">
                    Gezegenler Arası Ana Açılar
                  </h2>
                  <p className="text-xs text-[#a99e91]">
                    Hesaplanan gerçek orb dereceleri ve arketipsel etkileşimler.
                  </p>
                </div>
                <span className="text-xs text-[#dfbe96]">
                  Toplam {fullChart.aspects.length} Açı
                </span>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {fullChart.aspects.map((asp, idx) => {
                  const natureBadge =
                    asp.nature === "Harmonik"
                      ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/20"
                      : asp.nature === "Dinamik"
                      ? "text-rose-300 bg-rose-500/10 border-rose-500/20"
                      : "text-amber-300 bg-amber-500/10 border-amber-500/20";

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-xl border border-white/[0.06] bg-[#14102660] space-y-2 hover:border-[#dfbe9640] transition-all"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-base text-[#dfbe96]">{asp.bodyA.symbol}</span>
                          <span className="text-xs font-medium text-[#f4eee5]">{asp.bodyA.name}</span>
                          <span className="text-xs text-[#dfbe96] font-bold">{asp.aspectSymbol} {asp.aspectName}</span>
                          <span className="text-base text-[#dfbe96]">{asp.bodyB.symbol}</span>
                          <span className="text-xs font-medium text-[#f4eee5]">{asp.bodyB.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${natureBadge}`}>
                            {asp.nature}
                          </span>
                          <span className="text-[11px] text-[#a99e91]">
                            Orb: {asp.orbText}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-[#d6ccc0] font-light leading-relaxed">
                        {asp.interpretation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Elemental Balance Bar (Dört Element Simyası - Preserved & Augmented) */}
          <div className="rounded-2xl border border-[#dfbe9625] bg-[#0c0919cc] backdrop-blur-xl p-5 md:p-6 shadow-[0_15px_40px_rgba(0,0,0,0.4)] space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider text-[#dfbe96] font-medium">
                Dört Element Simyası
              </span>
              <span className="text-[#867b70] text-[11px]">
                {isCalculated ? "Haritana Göre Gerçek Dağılım" : "Örnek Dağılım"}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-[#ff996612] border border-[#ff996630]">
                <span className="text-base block mb-0.5 text-[#ffa07a]">△</span>
                <span className="text-xs font-medium text-[#f4eee5] block">Ateş</span>
                <span className="text-[11px] text-[#ffa07a]">
                  %{elementPercent("Ateş")} · Tutku
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#80c87012] border border-[#80c87030]">
                <span className="text-base block mb-0.5 text-[#90ee90]">▽</span>
                <span className="text-xs font-medium text-[#f4eee5] block">Toprak</span>
                <span className="text-[11px] text-[#90ee90]">
                  %{elementPercent("Toprak")} · İnşa
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#87ceeb12] border border-[#87ceeb30]">
                <span className="text-base block mb-0.5 text-[#87ceeb]">🜁</span>
                <span className="text-xs font-medium text-[#f4eee5] block">Hava</span>
                <span className="text-[11px] text-[#87ceeb]">
                  %{elementPercent("Hava")} · Zihin
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#b090ff12] border border-[#b090ff30]">
                <span className="text-base block mb-0.5 text-[#c8a2c8]">🜄</span>
                <span className="text-xs font-medium text-[#f4eee5] block">Su</span>
                <span className="text-[11px] text-[#c8a2c8]">
                  %{elementPercent("Su")} · Sezgi
                </span>
              </div>
            </div>

            {/* Element Details Note */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-[#a99e91]">
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[#dfbe96] font-medium">Baskın Nitelik: </span>
                <span>
                  {Object.entries(fullChart.modalityBreakdown)
                    .map(([mod, d]) => `${mod} (%${d.percentage})`)
                    .join(" · ")}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <span className="text-[#dfbe96] font-medium">Gezegen Dağılımı: </span>
                <span>Güneş, Ay, ASC ve tüm gezegenlerin burç elementleri toplanmıştır.</span>
              </div>
            </div>
          </div>

          {/* Quick link to Kader Haritası and Profilim (Preserved) */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
            <div className="text-xs text-[#a99e91]">
              Doğum bilgilerin kaydedildi. Bir sonraki adımı keşfet:
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/haritalarim/kader-haritasi"
                className="text-xs text-[#dfbe96] hover:underline"
              >
                Kader Haritası →
              </Link>
              <span className="text-[#867b70]">·</span>
              <Link
                href="/haritalarim/profilim"
                className="text-xs text-[#dfbe96] hover:underline"
              >
                Profil Kartı Oluştur →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

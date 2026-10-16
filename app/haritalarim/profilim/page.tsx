"use client";

import { useState } from "react";
import Link from "next/link";
import { useAstria } from "@/context/AstriaContext";
import AstriaLogo from "@/components/AstriaLogo";

export default function AstrolojikProfilimPage() {
  const { profile, clearProfile } = useAstria();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ASTRIA · ${profile.sunSign} Güneş, ${profile.moonSign} Ay`,
          text: `ASTRIA astrolojik profilim: ${profile.sunSign} Güneş · ${profile.moonSign} Ay · ${profile.risingSign} Yükselen. Yıldızlarında yazılı hikâyeyi keşfet!`,
          url: "https://astria.app",
        });
      } catch {
        // Share cancelled or unsupported
      }
    } else {
      navigator.clipboard?.writeText(
        `ASTRIA astrolojik profilim: ${profile.sunSign} Güneş · ${profile.moonSign} Ay · ${profile.risingSign} Yükselen. https://astria.app`
      );
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
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
          HARİTALARIM · 03 ASTROLOJİK PROFİLİM
        </span>
      </div>

      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#dfbe9630] bg-[#dfbe960a] backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium">
            ✦ MERKEZİ ASTROLOJİK PORTRE ✦
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#f4eee5] font-light leading-tight">
          Astrolojik{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffdca8] via-[#dfbe96] to-[#b88c58] drop-shadow-[0_0_35px_rgba(223,190,150,0.45)]">
            Profilim
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#b8ada2] font-light leading-relaxed max-w-2xl mx-auto">
          Tüm harita analizlerinin ve kişisel eğilimlerinin bir araya geldiği özel profil alanın.
          İstediğin zaman bilgilerini güncelleyebilir veya hikâyeni paylaşılabilir bir karta dönüştürebilirsin.
        </p>
      </div>

      {/* Main Profile Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Core Astrological Pillars (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Identity Card */}
          <div className="rounded-2xl border border-[#dfbe9635] bg-[#120f20f0] backdrop-blur-2xl p-7 md:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[radial-gradient(circle_at_top_right,rgba(223,190,150,0.15),transparent_70%)] pointer-events-none" />

            <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.08]">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#dfbe96] font-medium block mb-1">
                  Kişisel Koordinatlar
                </span>
                <h2 className="font-serif text-2xl text-[#f4eee5] font-light">
                  {profile.birthPlace}
                </h2>
                <span className="text-xs text-[#867b70]">
                  Tarih: {profile.birthDate} · Saat: {profile.birthTime}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="px-4 py-2 rounded-full border border-[#dfbe9650] bg-[#dfbe9615] hover:bg-[#dfbe9628] text-xs text-[#dfbe96] transition-all cursor-pointer font-medium flex items-center gap-2"
              >
                <span>Paylaşım Kartı</span>
                <span>↗</span>
              </button>
            </div>

            {/* 3 Main Lights */}
            <div className="grid grid-cols-3 gap-3 text-center mb-6">
              <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                <span className="text-2xl text-[#dfbe96] block mb-1">☉</span>
                <span className="text-[10px] uppercase tracking-wider text-[#a99e91] block">Güneş</span>
                <span className="font-serif text-lg text-[#f4eee5] font-medium">{profile.sunSign}</span>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                <span className="text-2xl text-[#c49aff] block mb-1">☽</span>
                <span className="text-[10px] uppercase tracking-wider text-[#a99e91] block">Ay</span>
                <span className="font-serif text-lg text-[#f4eee5] font-medium">{profile.moonSign}</span>
              </div>

              <div className="p-4 rounded-xl border border-white/[0.08] bg-white/[0.02]">
                <span className="text-2xl text-[#ffaec0] block mb-1">↑</span>
                <span className="text-[10px] uppercase tracking-wider text-[#a99e91] block">Yükselen</span>
                <span className="font-serif text-lg text-[#f4eee5] font-medium">{profile.risingSign}</span>
              </div>
            </div>

            {/* Core Traits Breakdown */}
            <div className="space-y-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium block mb-1.5">
                  ✦ Kişisel Eğilimler ve Güçlü Yönler
                </span>
                <p className="text-xs text-[#cfc2b3] font-light leading-relaxed">
                  {profile.sunSign} burcunun getirdiği sağlam irade ve süreklilik duygusu, {profile.moonSign} burcundaki canlı duygusal cesaretle birleşir. Kararlarında aceleci değil, ama inandığın yolda tavizsiz ilerlersin.
                </p>
              </div>

              <div>
                <span className="text-xs uppercase tracking-wider text-[#dfbe96] font-medium block mb-1.5">
                  ✦ İletişim ve İlişki Temaları
                </span>
                <p className="text-xs text-[#cfc2b3] font-light leading-relaxed">
                  İlişkilerde gösterişten uzak dürüstlük, sadakat ve güven önceliğindir. Yükselen {profile.risingSign} duruşun insanlara cömert bir sıcaklık hissettirir.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy & Clear Data Controls (Section 10) */}
          <div className="p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] flex items-center justify-between text-xs text-[#867b70]">
            <div>
              <span className="text-[#a99e91] block font-medium">Veri Gizliliği:</span>
              <span>Bilgilerin yalnızca tarayıcında saklanır.</span>
            </div>
            <button
              type="button"
              onClick={clearProfile}
              className="text-xs text-[#dfbe9680] hover:text-[#dfbe96] underline transition-colors cursor-pointer"
            >
              Bilgilerimi Temizle
            </button>
          </div>
        </div>

        {/* Right Column: Shareable Story Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-[#dfbe9635] bg-[#0c0919f0] backdrop-blur-xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-[#dfbe96] font-medium">
                Paylaşılabilir Profil Kartı (Story 9:16)
              </span>
              <span className="text-xs text-[#dfbe96]">✧</span>
            </div>

            {/* 9:16 Story Card Mockup */}
            <div className="relative aspect-[9/16] rounded-2xl border border-[#dfbe9650] bg-gradient-to-b from-[#140e24] via-[#0d0918] to-[#06040c] p-6 flex flex-col justify-between text-center shadow-[0_20px_40px_rgba(0,0,0,0.8)] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(223,190,150,0.18)_0%,transparent_60%)] pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 pt-2 flex flex-col items-center">
                <AstriaLogo size="sm" />
                <span className="text-[9px] uppercase tracking-[0.24em] text-[#dfbe9680] mt-1">
                  KİŞİSEL KOZMİK PROFİL
                </span>
              </div>

              {/* Card Centerpiece */}
              <div className="relative z-10 my-auto space-y-4 py-4">
                <div className="w-20 h-20 mx-auto rounded-full border border-[#dfbe9640] bg-[#dfbe9610] flex items-center justify-center text-3xl text-[#dfbe96] shadow-[0_0_25px_rgba(223,190,150,0.25)]">
                  {profile.sunSymbol || "☉"}
                </div>

                <div>
                  <h3 className="font-serif text-2xl text-[#f4eee5] font-light">
                    {profile.sunSign} Güneş
                  </h3>
                  <p className="text-[11px] text-[#dfbe96] font-light mt-0.5">
                    Ay {profile.moonSign} · Yükselen {profile.risingSign}
                  </p>
                </div>

                <p className="text-[11px] text-[#cfc2b3] italic font-serif leading-relaxed px-2">
                  &quot;Bazı hikâyeler gökyüzünde başlar. Kendi içsel ışığıma ve potansiyelime güveniyorum.&quot;
                </p>
              </div>

              {/* Card Footer Watermark */}
              <div className="relative z-10 pt-2 border-t border-white/[0.08] flex items-center justify-between text-[10px] text-[#867b70]">
                <span>astria.app</span>
                <span className="text-[#dfbe96]">✦ Kendini Keşfet</span>
              </div>
            </div>

            {/* Share / Copy Action */}
            <button
              type="button"
              onClick={handleShare}
              className="w-full py-3 rounded-xl text-xs uppercase tracking-[0.16em] font-medium text-[#110c07] bg-gradient-to-r from-[#fae2c0] via-[#dfbe96] to-[#be905c] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer shadow-[0_0_20px_rgba(223,190,150,0.25)] flex items-center justify-center gap-2"
            >
              <span>{copySuccess ? "✓ Kopyalandı!" : "Hikâyeni Paylaş"}</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

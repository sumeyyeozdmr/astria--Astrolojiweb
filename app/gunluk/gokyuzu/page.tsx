"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface TransitEvent {
  time: string;
  planets: string;
  aspect: string;
  sign: string;
  influence: string;
  element: string;
}

const TRANSIT_EVENTS: TransitEvent[] = [
  {
    time: "08:42",
    planets: "Ay △ Jüpiter",
    aspect: "Üçgen Açı (120°)",
    sign: "Boğa & Boğa",
    influence: "Duygusal cömertlik, içsel genişleme ve huzur veren sakinlik.",
    element: "Toprak",
  },
  {
    time: "14:15",
    planets: "Merkür ⚹ Venüs",
    aspect: "Sekstil Açı (60°)",
    sign: "İkizler & Aslan",
    influence: "Zarif kelimeler, yapıcı iletişim köprüleri ve yaratıcı diplomasi.",
    element: "Hava & Ateş",
  },
  {
    time: "21:30",
    planets: "Güneş ☌ Ufuk",
    aspect: "Geceye Geçiş",
    sign: "Akrep Gece Göğü",
    influence: "Günün yorgunluğunu bırakıp kendi içsel sessizliğine çekilme saati.",
    element: "Su",
  },
];

export default function GunlukGokyuzuPage() {
  const [completedPractice, setCompletedPractice] = useState(false);
  const [todayStr, setTodayStr] = useState<string>("Bugün");

  useEffect(() => {
    setTodayStr(
      new Date().toLocaleDateString("tr-TR", {
        weekday: "long",
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
          GÜNLÜK DENEYİM · 02 GÜNLÜK GÖKYÜZÜ
        </span>
      </div>

      {/* Page Title & Current Date */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#dfbe9630] bg-[#dfbe960a] backdrop-blur-md">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#dfbe96] font-medium">
            ✦ ANLIK KOZMİK HAVA DURUMU · {todayStr} ✦
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl text-[#f4eee5] font-light leading-tight">
          Günlük{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffdca8] via-[#dfbe96] to-[#b88c58] drop-shadow-[0_0_35px_rgba(223,190,150,0.45)]">
            Gökyüzü
          </span>
        </h1>

        <p className="text-sm sm:text-base text-[#b8ada2] font-light leading-relaxed max-w-2xl mx-auto">
          Günün göksel ritmini ve gezegen hareketlerinin oluşturduğu sembolik iklimi takip et.
          Günün enerjisini kendi kararlarına ve dinginliğine rehber kıl.
        </p>
      </div>

      {/* 3 Metric Cards: Moon Phase, Main Theme, Elemental Dominance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {/* Metric 1: Moon Phase */}
        <div className="p-7 rounded-2xl border border-[#dfbe9630] bg-[#120f20f0] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#dfbe96] font-medium">
                Ay Döngüsü
              </span>
              <span className="text-2xl text-[#dfbe96] drop-shadow-[0_0_10px_rgba(223,190,150,0.6)]">
                ☽
              </span>
            </div>
            <h2 className="font-serif text-2xl text-[#f4eee5] font-light mb-1">
              Büyüyen Hilal
            </h2>
            <span className="text-xs text-[#dfbe96] block mb-3 font-medium">
              Niyet & Girişim Zamanı
            </span>
            <p className="text-xs text-[#b8ada2] leading-relaxed font-light">
              Yeni başladığın düşünceleri ve tohumları besleme aşaması. Büyük sonuçlar yerine küçük adımlarla istikrar yakalamak için ideal gökyüzü teması.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/[0.06] text-[10px] text-[#867b70] flex justify-between">
            <span>Aydınlanma: %42</span>
            <span>Işık Genişliyor ↗</span>
          </div>
        </div>

        {/* Metric 2: Cosmic Focus */}
        <div className="p-7 rounded-2xl border border-[#dfbe9630] bg-[#120f20f0] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#dfbe96] font-medium">
                Günün Teması
              </span>
              <span className="text-2xl text-[#c49aff] drop-shadow-[0_0_10px_rgba(196,154,255,0.6)]">
                ✧
              </span>
            </div>
            <h2 className="font-serif text-2xl text-[#f4eee5] font-light mb-1">
              Zihinsel Berraklık
            </h2>
            <span className="text-xs text-[#c49aff] block mb-3 font-medium">
              Merkür Rezonansı
            </span>
            <p className="text-xs text-[#b8ada2] leading-relaxed font-light">
              Kelimelerin gücünün arttığı bir gün. Ertelediğin konuşmaları yapmak, yazı yazmak veya karmaşık bir meseleyi çözüme kavuşturmak için uygun zemin.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/[0.06] text-[10px] text-[#867b70] flex justify-between">
            <span>İletişim Açıklığı</span>
            <span>Yüksek Akış</span>
          </div>
        </div>

        {/* Metric 3: Element Atmosphere */}
        <div className="p-7 rounded-2xl border border-[#dfbe9630] bg-[#120f20f0] backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] uppercase tracking-widest text-[#dfbe96] font-medium">
                Günün Elementi
              </span>
              <span className="text-2xl text-[#92d6ff] drop-shadow-[0_0_10px_rgba(146,214,255,0.6)]">
                🜁
              </span>
            </div>
            <h2 className="font-serif text-2xl text-[#f4eee5] font-light mb-1">
              Hava Ağırlıklı
            </h2>
            <span className="text-xs text-[#92d6ff] block mb-3 font-medium">
              Fikir & Ufuk Genişlemesi
            </span>
            <p className="text-xs text-[#b8ada2] leading-relaxed font-light">
              Ruhun özgürlük ve nefes alma arayışında. Katı kurallar yerine yeni ihtimalleri dinlemek ve zihnine ferah alanlar açmak seni besleyecektir.
            </p>
          </div>
          <div className="pt-4 mt-6 border-t border-white/[0.06] text-[10px] text-[#867b70] flex justify-between">
            <span>Denge: %40 Hava</span>
            <span>%30 Toprak</span>
          </div>
        </div>
      </div>

      {/* Highlighted Celestial Transit Events Timeline */}
      <div className="max-w-5xl mx-auto rounded-2xl border border-[#dfbe9630] bg-[#100d1df8] backdrop-blur-2xl p-7 md:p-9 shadow-[0_25px_60px_rgba(0,0,0,0.5)] space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <span className="text-xs uppercase tracking-widest text-[#dfbe96] font-medium flex items-center gap-2">
            <span>✦</span>
            <span>Günün Öne Çıkan Gökyüzü Olayları</span>
          </span>
          <span className="text-[10px] text-[#867b70]">Sembolik İzdüşümler</span>
        </div>

        <div className="space-y-4">
          {TRANSIT_EVENTS.map((evt, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-[#dfbe9640] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[#dfbe96] bg-[#dfbe9615] px-2.5 py-1 rounded-md">
                  {evt.time}
                </span>
                <div>
                  <div className="font-serif text-base text-[#f4eee5] font-medium">
                    {evt.planets} · <span className="text-xs font-sans text-[#a99e91] font-normal">{evt.aspect}</span>
                  </div>
                  <p className="text-xs text-[#b8ada2] font-light mt-0.5">
                    {evt.influence}
                  </p>
                </div>
              </div>

              <span className="text-[10px] text-[#dfbe96] uppercase tracking-wider px-2 py-0.5 rounded border border-[#dfbe9630] shrink-0">
                {evt.element}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Contemplative Practice Card */}
      <div className="max-w-5xl mx-auto rounded-2xl border border-[#dfbe9630] bg-gradient-to-r from-[#171328ea] via-[#120f1fea] to-[#0c0916ea] backdrop-blur-xl p-7 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="space-y-1.5">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#dfbe96] font-medium flex items-center gap-1.5">
            <span>☾</span>
            <span>Günün Tefekkür Pratiği</span>
          </span>
          <h3 className="font-serif text-xl md:text-2xl text-[#f4eee5] font-light">
            &quot;Bugün kendine 5 dakika ayır ve zihnini yargılamadan dinle.&quot;
          </h3>
          <p className="text-xs text-[#b8ada2] font-light">
            Düşüncelerini bir nehri izler gibi sakince gözlemle; hiçbirine kapılmak zorunda değilsin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCompletedPractice(!completedPractice)}
          className={`shrink-0 px-6 py-3 rounded-full text-xs uppercase tracking-wider font-medium transition-all cursor-pointer ${
            completedPractice
              ? "bg-[#dfbe96] text-[#110c07] shadow-[0_0_20px_rgba(223,190,150,0.4)]"
              : "border border-[#dfbe9650] text-[#dfbe96] hover:bg-[#dfbe9618]"
          }`}
        >
          {completedPractice ? "✓ Tamamlandı" : "Pratiği Tamamla"}
        </button>
      </div>
    </div>
  );
}

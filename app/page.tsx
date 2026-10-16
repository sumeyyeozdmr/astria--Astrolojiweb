"use client";

import Link from "next/link";

interface ServiceCard {
  id: string;
  number: string;
  symbol: string;
  symbolColor: string;
  glowGradient: string;
  title: string;
  description: string;
  actionText: string;
  href: string;
}

const SERVICE_CARDS: ServiceCard[] = [
  {
    id: "dogum-haritasi",
    number: "01 · HARİTA",
    symbol: "☉",
    symbolColor: "text-[#dfbe96]",
    glowGradient: "rgba(223,190,150,0.15)",
    title: "Doğum Haritası",
    description:
      "Doğduğun andaki gökyüzünü keşfet; Güneş, Ay ve yükselen burcunun sembolik anlamlarını incele.",
    actionText: "Haritayı İncele",
    href: "/haritalarim/dogum-haritasi",
  },
  {
    id: "kader-haritasi",
    number: "02 · POTANSİYEL",
    symbol: "⟡",
    symbolColor: "text-[#f0c27b]",
    glowGradient: "rgba(240,194,123,0.15)",
    title: "Kader Haritası",
    description:
      "Hayatındaki temaları, potansiyellerini ve kişisel gelişim alanlarını sembolik bir bakışla keşfet.",
    actionText: "Temaları Keşfet",
    href: "/haritalarim/kader-haritasi",
  },
  {
    id: "astrolojik-profilim",
    number: "03 · PORTRE",
    symbol: "✦",
    symbolColor: "text-[#e8c37d]",
    glowGradient: "rgba(232,195,125,0.15)",
    title: "Astrolojik Profilim",
    description:
      "Güneş, Ay ve yükselen burcunla kozmik haritanın sana özel merkezi portresini ve temel dinamiklerini incele.",
    actionText: "Profili Görüntüle",
    href: "/haritalarim/profilim",
  },
  {
    id: "gunluk-kart",
    number: "04 · GÜNLÜK",
    symbol: "☾",
    symbolColor: "text-[#c49aff]",
    glowGradient: "rgba(160,110,255,0.15)",
    title: "Günlük Kart",
    description:
      "Sana özel günlük kartını seç ve günün üzerine düşündürdüklerini keşfet.",
    actionText: "Kartını Seç",
    href: "/gunluk/kart",
  },
  {
    id: "gunluk-gokyuzu",
    number: "05 · KOZMİK",
    symbol: "✧",
    symbolColor: "text-[#ffd27d]",
    glowGradient: "rgba(255,210,125,0.15)",
    title: "Günlük Gökyüzü",
    description:
      "Günün gökyüzü hareketlerini ve astrolojik yorumlarını incele.",
    actionText: "Gökyüzünü Oku",
    href: "/gunluk/gokyuzu",
  },
  {
    id: "ay-takvimi",
    number: "06 · AY EVRELERİ",
    symbol: "○",
    symbolColor: "text-[#d1c4e9]",
    glowGradient: "rgba(209,196,233,0.15)",
    title: "Ay Takvimi",
    description:
      "Ay evrelerini, burç geçişlerini ve kozmik döngülerin getirdiği niyet temalarını keşfet.",
    actionText: "Takvimi İncele",
    href: "/gunluk/ay-takvimi",
  },
  {
    id: "ask-ve-uyum",
    number: "07 · UYUM",
    symbol: "♡",
    symbolColor: "text-[#ffaec0]",
    glowGradient: "rgba(255,140,160,0.15)",
    title: "Aşk ve Uyum",
    description:
      "İki kişinin doğum bilgilerine dayalı sembolik astrolojik uyumunu keşfet.",
    actionText: "Sinerjiyi Çözümle",
    href: "/ask-ve-uyum",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-14 md:space-y-20 animate-in fade-in zoom-in-95 duration-500">
      {/* Ana Karşılama Başlığı (Hero Banner) */}
      <div className="text-center max-w-4xl mx-auto space-y-6 pt-4 md:pt-8">
        {/* Üst Rozet / Vurgu */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#dfbe9640] bg-[#dfbe9612] backdrop-blur-md shadow-[0_0_20px_rgba(223,190,150,0.15)]">
          <span className="w-2 h-2 rounded-full bg-[#dfbe96] shadow-[0_0_10px_#dfbe96] animate-pulse" />
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#dfbe96] font-medium">
            KENDİNE DOĞRU BİR KOZMİK YOLCULUK
          </span>
        </div>

        {/* Ana Başlık: "Yıldızlarında yazılı hikâyeyi keşfet." */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-[#f5eee6] font-light tracking-[-0.02em] leading-[1.1]">
          Yıldızlarında yazılı{" "}
          <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ffdca8] via-[#dfbe96] to-[#b88c58] drop-shadow-[0_0_35px_rgba(223,190,150,0.45)]">
            hikâyeyi
          </span>{" "}
          keşfet.
        </h1>

        {/* Slogan ve Mistik Yaklaşım */}
        <p className="text-base sm:text-lg text-[#cfc2b3] max-w-2xl mx-auto font-light leading-relaxed">
          Bazı hikâyeler gökyüzünde başlar. Gökyüzünün doğduğun anda sana anlattığı hikâyeyi keşfet.
          Yıldızlarında yazılı sembollerden ilham al; kendi potansiyelini, ilişkilerini ve içsel pusulanı yeni bir farkındalıkla anlamlandır.
        </p>

        {/* İlke ve Güven Rozetleri */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-[#9d9082]">
          <div className="flex items-center gap-2">
            <span className="text-[#dfbe96]">✧</span>
            <span>Kehanet veya fal değil, sembolik farkındalık</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#dfbe96]">✦</span>
            <span>Kayıt ve üyelik zorunluluğu yok</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#dfbe96]">⟡</span>
            <span>Anında doğrudan kişisel deneyim</span>
          </div>
        </div>
      </div>

      {/* Ana Keşif ve Hizmet Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
        {SERVICE_CARDS.map((card) => {
          const isFeatured = card.id === "ask-ve-uyum";
          return (
            <Link
              key={card.id}
              href={card.href}
              className={`group relative rounded-2xl border border-[#dfbe9635] bg-[#120f1df0] hover:bg-[#181329f5] backdrop-blur-xl p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#dfbe9680] hover:shadow-[0_15px_40px_rgba(223,190,150,0.2)] cursor-pointer flex justify-between min-h-[280px] ${
                isFeatured
                  ? "md:col-span-2 lg:col-span-3 flex-col sm:flex-row sm:items-center gap-6"
                  : "flex-col"
              }`}
            >
              {/* Sağ Üst Köşe Ortam Işığı Aurası */}
              <div
                className="absolute top-0 right-0 w-28 h-28 pointer-events-none rounded-tr-2xl"
                style={{
                  background: `radial-gradient(circle at top right, ${card.glowGradient}, transparent 70%)`,
                }}
              />

              <div className={isFeatured ? "flex-1" : ""}>
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-2xl ${card.symbolColor} drop-shadow-[0_0_12px_rgba(223,190,150,0.6)]`}
                  >
                    {card.symbol}
                  </span>
                  <span className="text-[10px] tracking-widest text-[#867b70] uppercase font-mono">
                    {card.number}
                  </span>
                </div>

                <h2 className="font-serif text-2xl text-[#f4eee5] font-light mb-2.5 group-hover:text-[#dfbe96] transition-colors">
                  {card.title}
                </h2>

                <p className={`text-xs text-[#b8ada2] font-light leading-relaxed ${isFeatured ? "max-w-xl" : ""}`}>
                  {card.description}
                </p>
              </div>

              <div
                className={`flex items-center justify-between text-xs text-[#dfbe96] ${
                  isFeatured
                    ? "sm:border-l sm:border-white/[0.08] sm:pl-8 sm:self-center shrink-0 w-full sm:w-auto pt-4 sm:pt-0 border-t border-white/[0.06] sm:border-t-0 gap-4"
                    : "pt-4 border-t border-white/[0.06]"
                }`}
              >
                <span className="tracking-wider uppercase text-[10px] font-medium">
                  {card.actionText}
                </span>
                <span className="group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Canlı Gökyüzü Teması ve Bildirim Bandı */}
      <div className="rounded-2xl border border-[#dfbe9630] bg-gradient-to-r from-[#171328ea] via-[#120f1fea] to-[#0c0916ea] backdrop-blur-xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[#dfbe96]">✦</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#dfbe96] font-medium">
              Günün Gökyüzü Teması · Büyüyen Hilal Fazı
            </span>
          </div>
          <p className="font-serif text-xl md:text-2xl text-[#f4eee5] font-light">
            &quot;Yeni niyetler filizleniyor; zihinsel berraklık ve içsel uyum vakti.&quot;
          </p>
          <p className="text-xs text-[#a99e91] font-light">
            Ay döngüsünün girişim aşaması, tohum ektiğin düşünceleri nazikçe beslemeni tavsiye ediyor.
          </p>
        </div>

        <Link
          href="/gunluk/gokyuzu"
          className="shrink-0 px-6 py-3 rounded-full border border-[#dfbe9650] text-xs uppercase tracking-wider text-[#dfbe96] hover:bg-[#dfbe9618] hover:border-[#dfbe96] transition-all cursor-pointer font-medium"
        >
          Gökyüzü Raporuna Git ↗
        </Link>
      </div>
    </div>
  );
}

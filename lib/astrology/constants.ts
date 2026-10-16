import { AspectInfo, AspectType, SignDetail, ZodiacElement, ZodiacModality } from "./types";

export const ZODIAC_SIGNS: SignDetail[] = [
  {
    key: "Aries",
    name: "Koç",
    symbol: "♈",
    element: "Ateş",
    modality: "Öncü",
    ruler: "Mars",
    keywords: ["Cesaret", "Başlangıç", "Atılım", "Doğallık", "Liderlik"],
  },
  {
    key: "Taurus",
    name: "Boğa",
    symbol: "♉",
    element: "Toprak",
    modality: "Sabit",
    ruler: "Venüs",
    keywords: ["Huzur", "Kalıcılık", "Duyusal Zenginlik", "Sabır", "Sadakat"],
  },
  {
    key: "Gemini",
    name: "İkizler",
    symbol: "♊",
    element: "Hava",
    modality: "Değişken",
    ruler: "Merkür",
    keywords: ["Merak", "İletişim", "Esneklik", "Çok Yönlülük", "Zihinsel Hız"],
  },
  {
    key: "Cancer",
    name: "Yengeç",
    symbol: "♋",
    element: "Su",
    modality: "Öncü",
    ruler: "Ay",
    keywords: ["Şefkat", "Aidiyet", "Sezgi", "Koruma", "Duygusal Bellek"],
  },
  {
    key: "Leo",
    name: "Aslan",
    symbol: "♌",
    element: "Ateş",
    modality: "Sabit",
    ruler: "Güneş",
    keywords: ["Yaratıcılık", "Cömertlik", "Özgüven", "Işık", "Asalet"],
  },
  {
    key: "Virgo",
    name: "Başak",
    symbol: "♍",
    element: "Toprak",
    modality: "Değişken",
    ruler: "Merkür",
    keywords: ["Ustalık", "Özen", "Fayda", "Analiz", "Arılık"],
  },
  {
    key: "Libra",
    name: "Terazi",
    symbol: "♎",
    element: "Hava",
    modality: "Öncü",
    ruler: "Venüs",
    keywords: ["Denge", "Estetik", "Zarafet", "Adalet", "İlişki Bilinci"],
  },
  {
    key: "Scorpio",
    name: "Akrep",
    symbol: "♏",
    element: "Su",
    modality: "Sabit",
    ruler: "Plüton",
    modernRuler: "Plüton",
    keywords: ["Dönüşüm", "Tutku", "Derinlik", "Sezgi Gücü", "Otantiklik"],
  },
  {
    key: "Sagittarius",
    name: "Yay",
    symbol: "♐",
    element: "Ateş",
    modality: "Değişken",
    ruler: "Jüpiter",
    keywords: ["Felsefe", "Özgürlük", "Ufuk Genişliği", "İyimserlik", "Hakikat"],
  },
  {
    key: "Capricorn",
    name: "Oğlak",
    symbol: "♑",
    element: "Toprak",
    modality: "Öncü",
    ruler: "Satürn",
    keywords: ["Olgunluk", "Disiplin", "Kalıcı Başarı", "Sorumluluk", "Miras"],
  },
  {
    key: "Aquarius",
    name: "Kova",
    symbol: "♒",
    element: "Hava",
    modality: "Sabit",
    ruler: "Uranüs",
    modernRuler: "Uranüs",
    keywords: ["Özgünlük", "Kolektif Vizyon", "Bağımsızlık", "Yenilik", "Hümanizm"],
  },
  {
    key: "Pisces",
    name: "Balık",
    symbol: "♓",
    element: "Su",
    modality: "Değişken",
    ruler: "Neptün",
    modernRuler: "Neptün",
    keywords: ["Şefkat", "Birlik", "Hayal Gücü", "Teslimiyet", "Evrensel Sevgi"],
  },
];

export const SIGN_MAP: Record<string, SignDetail> = Object.fromEntries(
  ZODIAC_SIGNS.map((s) => [s.key, s])
);

export const SIGN_MAP_BY_NAME: Record<string, SignDetail> = Object.fromEntries(
  ZODIAC_SIGNS.map((s) => [s.name, s])
);

export const PLANET_DEFINITIONS: Record<
  string,
  {
    name: string;
    symbol: string;
    coreArchetype: string;
    keywords: string[];
    orb: number;
    color: string;
  }
> = {
  sun: {
    name: "Güneş",
    symbol: "☉",
    coreArchetype: "Bilinçli Benlik, Yaşam Kıvılcımı ve Ruhsal İrade",
    keywords: ["Öz Kimlik", "Canlılık", "Yaratıcı Amaç", "Onur"],
    orb: 8,
    color: "#f59e0b",
  },
  moon: {
    name: "Ay",
    symbol: "☽",
    coreArchetype: "Bilinçdışı İhtiyaçlar, Duygusal Güven ve Sezgisel Hafıza",
    keywords: ["İç Dünya", "Aidiyet", "Şefkat", "Döngüler"],
    orb: 8,
    color: "#e2e8f0",
  },
  ascendant: {
    name: "Yükselen (ASC)",
    symbol: "↑",
    coreArchetype: "Fiziksel Beden, Dışa Yansıyan Işık ve İlk İzlenim",
    keywords: ["Duruş", "Filtre", "Mizaç", "Dünyaya Açılış"],
    orb: 5,
    color: "#dfbe96",
  },
  mercury: {
    name: "Merkür",
    symbol: "☿",
    coreArchetype: "Zihinsel Düzen, İletişim Köprüleri ve Algılama Biçimi",
    keywords: ["Düşünce", "Mantık", "Merak", "Öğrenme"],
    orb: 6,
    color: "#38bdf8",
  },
  venus: {
    name: "Venüs",
    symbol: "♀",
    coreArchetype: "Sevgi Dili, İlişki Değerleri ve Estetik Beğeni",
    keywords: ["Uyum", "Çekim", "Huzur", "Değer Duygusu"],
    orb: 6,
    color: "#f472b6",
  },
  mars: {
    name: "Mars",
    symbol: "♂",
    coreArchetype: "Eyleme Geçiş Gücü, Tutku, Cesaret ve Sınır Çizme",
    keywords: ["Atılım", "İrade", "Cesaret", "Girişimcilik"],
    orb: 6,
    color: "#ef4444",
  },
  jupiter: {
    name: "Jüpiter",
    symbol: "♃",
    coreArchetype: "Büyüme Potansiyeli, İnanç, İyimserlik ve Bilgelik",
    keywords: ["Genişleme", "Şans", "Felsefe", "Ufuk"],
    orb: 6,
    color: "#a855f7",
  },
  saturn: {
    name: "Satürn",
    symbol: "♄",
    coreArchetype: "Sorumluluk, Sabır, Olgunlaşma ve Kalıcı Sınırlar",
    keywords: ["Disiplin", "Zaman", "Sağlam Yapı", "Ustalık"],
    orb: 6,
    color: "#94a3b8",
  },
  uranus: {
    name: "Uranüs",
    symbol: "♅",
    coreArchetype: "Özgünlük, Ani Uyanışlar ve Kalıp Kırıcı Vizyon",
    keywords: ["Yenilik", "Özgürlük", "Buluş", "Devrim"],
    orb: 5,
    color: "#06b6d4",
  },
  neptune: {
    name: "Neptün",
    symbol: "♆",
    coreArchetype: "Kozmik İlham, Hayal Gücü ve Sezgisel Sınırsızlık",
    keywords: ["Teslimiyet", "Şefkat", "Sanat", "Ruhsal Birlik"],
    orb: 5,
    color: "#818cf8",
  },
  pluto: {
    name: "Plüton",
    symbol: "♇",
    coreArchetype: "Kökten Yenilenme, Dönüşüm ve Sarsılmaz İç Güç",
    keywords: ["Simya", "Hakikat", "Rejenerasyon", "Derinlik"],
    orb: 5,
    color: "#e11d48",
  },
  chiron: {
    name: "Kiron",
    symbol: "⚷",
    coreArchetype: "Yaralı Şifacı, Empati Köprüsü ve Bilgelik Kapısı",
    keywords: ["Şifa", "Kırılganlık", "Kabul", "Öğretmenlik"],
    orb: 4,
    color: "#14b8a6",
  },
  true_node: {
    name: "Kuzey Ay Düğümü",
    symbol: "☊",
    coreArchetype: "Ruhsal Büyüme Yönü, Gelecek Potansiyeli ve Kader Yolu",
    keywords: ["Gelişim", "Yeni Deneyim", "Cesur Hedef", "Kozmik Pusula"],
    orb: 4,
    color: "#eab308",
  },
  south_node: {
    name: "Güney Ay Düğümü",
    symbol: "☋",
    coreArchetype: "Tanıdık Konfor Alanı, Geçmiş Yetenekler ve Denge Arayışı",
    keywords: ["Alışkanlık", "Hafıza", "Aşılması Gereken Kök", "Bırakış"],
    orb: 4,
    color: "#ca8a04",
  },
};

export const MAJOR_ASPECTS: Record<AspectType, AspectInfo> = {
  conjunction: {
    type: "conjunction",
    name: "Kavuşum",
    symbol: "☌",
    angle: 0,
    maxOrb: 8,
    nature: "Birleştirici",
  },
  opposition: {
    type: "opposition",
    name: "Karşıtlık",
    symbol: "☍",
    angle: 180,
    maxOrb: 7,
    nature: "Dinamik",
  },
  trine: {
    type: "trine",
    name: "Üçgen",
    symbol: "△",
    angle: 120,
    maxOrb: 7,
    nature: "Harmonik",
  },
  square: {
    type: "square",
    name: "Kare",
    symbol: "□",
    angle: 90,
    maxOrb: 6,
    nature: "Dinamik",
  },
  sextile: {
    type: "sextile",
    name: "Sekstil",
    symbol: "⚹",
    angle: 60,
    maxOrb: 5,
    nature: "Harmonik",
  },
};

export const HOUSE_TEMAS: Record<
  number,
  {
    title: string;
    shortTitle: string;
    lifeArea: string;
    traditionalRulerSign: string;
    coreMeaning: string;
  }
> = {
  1: {
    title: "1. Ev (Beden & İlk İntiba)",
    shortTitle: "1. Ev · Benlik & Beden",
    lifeArea: "Fiziksel görünüm, dünyaya açılan ilk pencere, temel mizaç ve yaşam enerjisi.",
    traditionalRulerSign: "Aries",
    coreMeaning: "Bireyin dünyada kendi varlığını nasıl başlattığı ve ilk temas kurduğu alan.",
  },
  2: {
    title: "2. Ev (Yetenek & Maddi Değerler)",
    shortTitle: "2. Ev · Değerler & Kaynaklar",
    lifeArea: "Maddi kaynaklar, özdeğer duygusu, somut üretim gücü ve kişisel yetenekler.",
    traditionalRulerSign: "Taurus",
    coreMeaning: "Kendine ne kadar değer verdiğin ve güvenli bir zemin yaratma becerin.",
  },
  3: {
    title: "3. Ev (Zihin & İletişim)",
    shortTitle: "3. Ev · Zihin & Çevre",
    lifeArea: "Düşünce biçimi, konuşma ve yazma dili, kardeşler, yakın çevre ve kısa yolculuklar.",
    traditionalRulerSign: "Gemini",
    coreMeaning: "Bilgiyi nasıl işlediğin, merak duyduğun konular ve günlük bağlantıların.",
  },
  4: {
    title: "4. Ev (Kökler & İç Dünya)",
    shortTitle: "4. Ev · Yuva & Kökler",
    lifeArea: "Aile, ata kökleri, içsel sığınak, duygusal temel ve kişinin yalnızkenki en saf hali.",
    traditionalRulerSign: "Cancer",
    coreMeaning: "Ruhun kendini güvende hissettiği en mahrem liman ve aidiyet temeli.",
  },
  5: {
    title: "5. Ev (Yaratıcılık & Aşk)",
    shortTitle: "5. Ev · Aşk & Yaratım",
    lifeArea: "Romantik heyecanlar, yaratıcı ifade, hobiler, oyun ruhu ve yaşam sevinci.",
    traditionalRulerSign: "Leo",
    coreMeaning: "Kalbinin neşeyle attığı, kendini özgürce sahneye koyduğun ve ürettiğin alan.",
  },
  6: {
    title: "6. Ev (Günlük Düzen & Emek)",
    shortTitle: "6. Ev · Emek & Ritim",
    lifeArea: "Günlük alışkanlıklar, çalışma ortamı, hizmet etme biçimi ve beden-zihin ritmi.",
    traditionalRulerSign: "Virgo",
    coreMeaning: "Hayatı pratik ve faydalı kılmak için her gün gösterdiğin özenli emek.",
  },
  7: {
    title: "7. Ev (İlişkiler & Ortaklıklar)",
    shortTitle: "7. Ev · İkili Bağlar",
    lifeArea: "Birebir ortaklıklar, evlilik, uzun soluklu dostluklar ve 'öteki'nde kendini görme sanatı.",
    traditionalRulerSign: "Libra",
    coreMeaning: "Kişinin kendinde eksik gördüğünü başkasıyla dengeleme ve eşlik etme arzusu.",
  },
  8: {
    title: "8. Ev (Dönüşüm & Derinlik)",
    shortTitle: "8. Ev · Derinlik & Simya",
    lifeArea: "Ortak kaynaklar, krizler ve yenilenmeler, duygusal derinlik, bırakma ve miras.",
    traditionalRulerSign: "Scorpio",
    coreMeaning: "Korkularla yüzleşip kabuk değiştirerek küllerinden yeniden doğma gücü.",
  },
  9: {
    title: "9. Ev (Felsefe & Yüksek Vizyon)",
    shortTitle: "9. Ev · Vizyon & Anlam",
    lifeArea: "Yüksek öğrenim, felsefe, uzak seyahatler, dünya görüşü ve inanç sistemleri.",
    traditionalRulerSign: "Sagittarius",
    coreMeaning: "Yaşamın büyük resmini arama, ufkunu genişletme ve hakikate yönelme arzusu.",
  },
  10: {
    title: "10. Ev (Kariyer & Yaşam Amacı)",
    shortTitle: "10. Ev · Kariyer & Miras",
    lifeArea: "Mesleki başarı, toplumdaki statü, sorumluluk alma yetisi ve geride bırakılan iz.",
    traditionalRulerSign: "Capricorn",
    coreMeaning: "Dünyaya katkı sunduğun, olgunlaştığın ve saygınlık kazandığın doruk noktası.",
  },
  11: {
    title: "11. Ev (Kolektif & Gelecek Vizyonu)",
    shortTitle: "11. Ev · Kolektif & Umutlar",
    lifeArea: "Dost grupları, toplumsal idealler, kolektif projeler ve geleceğe dair vizyonlar.",
    traditionalRulerSign: "Aquarius",
    coreMeaning: "Bireysel sınırları aşarak insanlığa ve ortak hedeflere el uzatma alanı.",
  },
  12: {
    title: "12. Ev (Bilinçdışı & İçsel Huzur)",
    shortTitle: "12. Ev · Bilinçdışı & Sır",
    lifeArea: "Ruhsal inziva, bilinçdışı kalıplar, teslimiyet, meditasyon ve görünmeyen destekler.",
    traditionalRulerSign: "Pisces",
    coreMeaning: "Kişinin egoyu geride bırakıp evrensel bütünlükle sessizce buluştuğu alan.",
  },
};

export const HOUSE_DEFINITIONS: Record<
  number,
  {
    number: number;
    title: string;
    theme: string;
    lifeArea: string;
  }
> = Object.fromEntries(
  Object.entries(HOUSE_TEMAS).map(([numStr, item]) => {
    const num = Number(numStr);
    return [
      num,
      {
        number: num,
        title: item.title,
        theme: item.coreMeaning,
        lifeArea: item.lifeArea,
      },
    ];
  })
);


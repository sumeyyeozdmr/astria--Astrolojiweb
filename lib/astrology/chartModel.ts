import {
  CalculatedAspect,
  CalculatedPlacement,
  ElementBreakdown,
  FullNatalChartData,
  HouseData,
  ModalityBreakdown,
  ZodiacElement,
  ZodiacModality,
} from "./types";
import {
  HOUSE_DEFINITIONS,
  MAJOR_ASPECTS,
  PLANET_DEFINITIONS,
  SIGN_MAP_BY_NAME,
  ZODIAC_SIGNS,
} from "./constants";
import {
  formatDegree,
  generateAspectInterpretation,
  generateHouseInterpretation,
  generatePlacementInterpretation,
  generateSynthesis,
} from "./interpretation";

// Normalize degree into [0, 360)
export function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

// Convert longitude to Zodiac sign info
export function getSignFromLongitude(lon: number) {
  const norm = normalizeDeg(lon);
  const signIndex = Math.floor(norm / 30);
  const sign = ZODIAC_SIGNS[signIndex % 12];
  const signDeg = norm % 30;
  return {
    sign,
    signName: sign.name,
    signSymbol: sign.symbol,
    signDegree: signDeg,
    degreeFormatted: `${Math.floor(signDeg)}° ${sign.name} ${Math.floor((signDeg % 1) * 60)}'`,
  };
}

// Check which house a longitude belongs to given 12 cusps
export function getHouseFromLongitude(lon: number, cusps: number[]): number {
  const normalizedLon = normalizeDeg(lon);
  for (let i = 0; i < 12; i++) {
    const cuspStart = normalizeDeg(cusps[i]);
    const cuspEnd = normalizeDeg(cusps[(i + 1) % 12]);

    if (cuspStart < cuspEnd) {
      if (normalizedLon >= cuspStart && normalizedLon < cuspEnd) {
        return i + 1;
      }
    } else {
      // Wraps around 360° (0 Aries)
      if (normalizedLon >= cuspStart || normalizedLon < cuspEnd) {
        return i + 1;
      }
    }
  }
  return 1;
}

// Key list of celestial bodies to include in placements
const BODY_KEYS_ORDER = [
  "sun",
  "moon",
  "ascendant",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "chiron",
  "true_node",
  "south_node",
];

export function buildFullNatalChart(rawChart: any, birthInfo: any): FullNatalChartData {
  const rawBodies = rawChart?.bodies || {};
  const rawAngles = rawChart?.angles || {};
  const rawCusps: number[] = Array.isArray(rawChart?.cusps) && rawChart.cusps.length === 12
    ? rawChart.cusps
    : [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

  const ascLon = typeof rawAngles?.asc === "number" ? rawAngles.asc : rawCusps[0] || 0;
  const mcLon = typeof rawAngles?.mc === "number" ? rawAngles.mc : rawCusps[9] || 90;
  const descLon = normalizeDeg(ascLon + 180);
  const icLon = normalizeDeg(mcLon + 180);

  const ascInfo = getSignFromLongitude(ascLon);
  const mcInfo = getSignFromLongitude(mcLon);
  const descInfo = getSignFromLongitude(descLon);
  const icInfo = getSignFromLongitude(icLon);

  // 1. PROCESS ASPECTS
  const calculatedAspects: CalculatedAspect[] = [];
  const rawAspects = Array.isArray(rawChart?.aspects) ? rawChart.aspects : [];

  for (const rawAsp of rawAspects) {
    const bodyAKey = rawAsp.a || rawAsp.bodyA || rawAsp.body1 || "";
    const bodyBKey = rawAsp.b || rawAsp.bodyB || rawAsp.body2 || "";
    const aspType = (rawAsp.aspect || rawAsp.type || "").toLowerCase();

    if (!MAJOR_ASPECTS[aspType as keyof typeof MAJOR_ASPECTS]) continue;

    const defA = PLANET_DEFINITIONS[bodyAKey] || { name: bodyAKey, symbol: "✧" };
    const defB = PLANET_DEFINITIONS[bodyBKey] || { name: bodyBKey, symbol: "✧" };

    const bodyAData = rawBodies[bodyAKey] || (bodyAKey === "asc" ? { lon: ascLon, house: 1 } : null);
    const bodyBData = rawBodies[bodyBKey] || (bodyBKey === "asc" ? { lon: ascLon, house: 1 } : null);

    const signA = bodyAData ? getSignFromLongitude(bodyAData.lon).signName : "";
    const signB = bodyBData ? getSignFromLongitude(bodyBData.lon).signName : "";
    const houseA = bodyAData?.house || (bodyAData ? getHouseFromLongitude(bodyAData.lon, rawCusps) : 1);
    const houseB = bodyBData?.house || (bodyBData ? getHouseFromLongitude(bodyBData.lon, rawCusps) : 1);

    const orb = typeof rawAsp.orb === "number" ? Math.abs(rawAsp.orb) : 0;
    const orbMinutes = Math.round((orb % 1) * 60);
    const orbText = `${Math.floor(orb)}° ${orbMinutes < 10 ? "0" : ""}${orbMinutes}'`;

    const aspectMeta = MAJOR_ASPECTS[aspType as keyof typeof MAJOR_ASPECTS];
    const { nature, interpretation } = generateAspectInterpretation(
      bodyAKey,
      bodyBKey,
      aspType as any,
      orb
    );

    calculatedAspects.push({
      bodyA: {
        key: bodyAKey,
        name: defA.name,
        symbol: defA.symbol,
        sign: signA,
        house: houseA,
      },
      bodyB: {
        key: bodyBKey,
        name: defB.name,
        symbol: defB.symbol,
        sign: signB,
        house: houseB,
      },
      aspect: aspType as any,
      aspectName: aspectMeta.name,
      aspectSymbol: aspectMeta.symbol,
      nature,
      orb,
      orbText,
      phase: rawAsp.phase === "separating" ? "separating" : "applying",
      strength: typeof rawAsp.strength === "number" ? rawAsp.strength : 1 - orb / aspectMeta.maxOrb,
      interpretation,
    });
  }

  // 2. PROCESS PLACEMENTS
  const placements: CalculatedPlacement[] = [];

  for (const key of BODY_KEYS_ORDER) {
    let rawLon: number | null = null;
    let isRetro = false;
    let houseNum = 1;

    if (key === "ascendant") {
      rawLon = ascLon;
      houseNum = 1;
    } else if (key === "south_node") {
      const northNodeLon = rawBodies.true_node?.lon ?? rawBodies.mean_node?.lon ?? 0;
      rawLon = normalizeDeg(northNodeLon + 180);
      houseNum = getHouseFromLongitude(rawLon, rawCusps);
    } else if (rawBodies[key]) {
      const b = rawBodies[key];
      rawLon = b.lon;
      isRetro = Boolean(b.retrograde || b.speed < 0);
      houseNum = typeof b.house === "number" ? b.house : getHouseFromLongitude(b.lon, rawCusps);
    }

    if (rawLon === null) continue;

    const signInfo = getSignFromLongitude(rawLon);
    const planetDef = PLANET_DEFINITIONS[key] || {
      name: key,
      symbol: "✧",
      coreArchetype: "Astrolojik Yerleşim",
    };

    const relatedAspects = calculatedAspects.filter(
      (a) => a.bodyA.key === key || a.bodyB.key === key
    );

    const { theme, insight, reflectionQuestion, strengths, growthAreas } =
      generatePlacementInterpretation(
        key,
        signInfo.signName,
        houseNum,
        isRetro,
        relatedAspects.length
      );

    placements.push({
      id: key,
      planet: planetDef.name,
      symbol: planetDef.symbol,
      sign: signInfo.signName,
      signSymbol: signInfo.signSymbol,
      degree: formatDegree(rawLon),
      rawLongitude: rawLon,
      signDegree: signInfo.signDegree,
      house: `${houseNum}. Ev`,
      houseNumber: houseNum,
      element: signInfo.sign.element,
      modality: signInfo.sign.modality,
      isRetrograde: isRetro,
      theme,
      insight,
      reflectionQuestion,
      strengths,
      growthAreas,
      aspects: relatedAspects,
    });
  }

  // 3. PROCESS 12 HOUSES
  const houses: HouseData[] = [];
  for (let i = 0; i < 12; i++) {
    const houseNum = i + 1;
    const houseDef = HOUSE_DEFINITIONS[houseNum];
    const cuspLon = normalizeDeg(rawCusps[i]);
    const cuspSignInfo = getSignFromLongitude(cuspLon);
    const rulerPlanetName = cuspSignInfo.sign.ruler;

    // Find which house the ruler planet is in
    const rulerPlacement = placements.find(
      (p) => p.planet.toLowerCase().includes(rulerPlanetName.toLowerCase()) ||
             p.id.toLowerCase() === rulerPlanetName.toLowerCase()
    );
    const rulerHouse = rulerPlacement ? rulerPlacement.houseNumber : undefined;

    // Find planets located in this house
    const planetsInside = placements
      .filter((p) => p.houseNumber === houseNum && p.id !== "ascendant")
      .map((p) => ({
        key: p.id,
        name: p.planet,
        symbol: p.symbol,
        sign: p.sign,
        degree: p.degree,
      }));

    const houseInterpretation = generateHouseInterpretation(
      houseNum,
      cuspSignInfo.signName,
      rulerPlanetName,
      rulerHouse,
      planetsInside.map((p) => p.name)
    );

    houses.push({
      number: houseNum,
      title: houseDef.title,
      theme: houseDef.theme,
      cuspLongitude: cuspLon,
      sign: cuspSignInfo.signName,
      signSymbol: cuspSignInfo.signSymbol,
      cuspDegreeFormatted: `${Math.floor(cuspSignInfo.signDegree)}° ${cuspSignInfo.signName} ${Math.floor((cuspSignInfo.signDegree % 1) * 60)}'`,
      rulerPlanet: rulerPlanetName,
      rulerHouse,
      planetsInside,
      interpretation: houseInterpretation,
    });
  }

  // 4. ELEMENT & MODALITY BREAKDOWNS
  // Standard weighted calculation using classical & modern bodies: Sun, Moon, Mercury, Venus, Mars, Jupiter, Saturn, Uranus, Neptune, Pluto, ASC
  const coreBodiesForBalance = placements.filter((p) =>
    ["sun", "moon", "ascendant", "mercury", "venus", "mars", "jupiter", "saturn", "uranus", "neptune", "pluto"].includes(p.id)
  );

  const elementCounts: Record<ZodiacElement, string[]> = {
    Ateş: [],
    Toprak: [],
    Hava: [],
    Su: [],
  };

  const modalityCounts: Record<ZodiacModality, string[]> = {
    Öncü: [],
    Sabit: [],
    Değişken: [],
  };

  for (const body of coreBodiesForBalance) {
    if (elementCounts[body.element]) {
      elementCounts[body.element].push(body.planet);
    }
    if (modalityCounts[body.modality]) {
      modalityCounts[body.modality].push(body.planet);
    }
  }

  const totalBalanceBodies = coreBodiesForBalance.length || 1;

  const elementBreakdown: Record<ZodiacElement, ElementBreakdown> = {
    Ateş: {
      element: "Ateş",
      symbol: "🔥",
      count: elementCounts.Ateş.length,
      percentage: Math.round((elementCounts.Ateş.length / totalBalanceBodies) * 100),
      nature: "Dinamik İlham, Cesaret ve Yaşam Kıvılcımı",
      meaning:
        elementCounts.Ateş.length >= 4
          ? "Yüksek coşku, girişimcilik ve harekete geçme isteği ön planda."
          : elementCounts.Ateş.length >= 2
          ? "Dengeli bir yaşama sevinci, sağlıklı motivasyon ve kararlılık."
          : "İçsel motivasyonu ve kıvılcımı bilinçli ritüellerle besleme ihtiyacı.",
      planets: elementCounts.Ateş,
    },
    Toprak: {
      element: "Toprak",
      symbol: "🌱",
      count: elementCounts.Toprak.length,
      percentage: Math.round((elementCounts.Toprak.length / totalBalanceBodies) * 100),
      nature: "Somut Düzen, Sağlamlık ve Maddi Sabır",
      meaning:
        elementCounts.Toprak.length >= 4
          ? "Kalıcı yapılar kurma, gerçekçilik ve sarsılmaz pratik yetenek."
          : elementCounts.Toprak.length >= 2
          ? "Fikirleri somutlaştırma ve sabırla inşa etme dengesi."
          : "Rutinler ve doğayla temas ile topraklanmayı güçlendirme önerisi.",
      planets: elementCounts.Toprak,
    },
    Hava: {
      element: "Hava",
      symbol: "💨",
      count: elementCounts.Hava.length,
      percentage: Math.round((elementCounts.Hava.length / totalBalanceBodies) * 100),
      nature: "Zihinsel Berraklık, İletişim ve Kavrayış",
      meaning:
        elementCounts.Hava.length >= 4
          ? "Güçlü entelektüel merak, çok yönlü sosyalleşme ve stratejik zihin."
          : elementCounts.Hava.length >= 2
          ? "Düşünceleri ifade etme ve objektif bakış açısı koruma yetisi."
          : "Düşünceleri yazarak veya paylaşarak zihinsel netliği artırma ihtiyacı.",
      planets: elementCounts.Hava,
    },
    Su: {
      element: "Su",
      symbol: "🌊",
      count: elementCounts.Su.length,
      percentage: Math.round((elementCounts.Su.length / totalBalanceBodies) * 100),
      nature: "Derin Sezgisellik, Şefkat ve Ruhsal Empati",
      meaning:
        elementCounts.Su.length >= 4
          ? "Zengin iç dünya, yüksek duygusal kavrayış ve sezgisel güç."
          : elementCounts.Su.length >= 2
          ? "Duygularla mantık arasında sağlıklı bir bağ kurabilme dengesi."
          : "Duygusal ihtiyaçları fark edip kendine şefkat gösterme pratiği.",
      planets: elementCounts.Su,
    },
  };

  const modalityBreakdown: Record<ZodiacModality, ModalityBreakdown> = {
    Öncü: {
      modality: "Öncü",
      count: modalityCounts.Öncü.length,
      percentage: Math.round((modalityCounts.Öncü.length / totalBalanceBodies) * 100),
      meaning: "Yeni projeler başlatma, inisiyatif alma ve liderlik etme gücü.",
      planets: modalityCounts.Öncü,
    },
    Sabit: {
      modality: "Sabit",
      count: modalityCounts.Sabit.length,
      percentage: Math.round((modalityCounts.Sabit.length / totalBalanceBodies) * 100),
      meaning: "Başlanan işi tamamlama, kararlılık, sadakat ve dayanıklılık.",
      planets: modalityCounts.Sabit,
    },
    Değişken: {
      modality: "Değişken",
      count: modalityCounts.Değişken.length,
      percentage: Math.round((modalityCounts.Değişken.length / totalBalanceBodies) * 100),
      meaning: "Şartlara hızla uyum sağlama, esneklik ve çok yönlü öğrenme yetisi.",
      planets: modalityCounts.Değişken,
    },
  };

  // 5. MULTI-DIMENSIONAL SYNTHESIS
  const synthesis = generateSynthesis(
    placements,
    houses,
    calculatedAspects,
    { asc: { sign: ascInfo.signName }, mc: { sign: mcInfo.signName } },
    elementBreakdown,
    modalityBreakdown
  );

  return {
    birthInfo: {
      birthDate: birthInfo?.birthDate || "",
      birthTime: birthInfo?.birthTime || "",
      birthPlace: birthInfo?.birthPlace || "",
      latitude: birthInfo?.latitude || 0,
      longitude: birthInfo?.longitude || 0,
      timezone: birthInfo?.timezone || "Europe/Istanbul",
    },
    placements,
    houses,
    aspects: calculatedAspects,
    angles: {
      asc: { longitude: ascLon, sign: ascInfo.signName, degreeFormatted: ascInfo.degreeFormatted },
      mc: { longitude: mcLon, sign: mcInfo.signName, degreeFormatted: mcInfo.degreeFormatted },
      desc: { longitude: descLon, sign: descInfo.signName, degreeFormatted: descInfo.degreeFormatted },
      ic: { longitude: icLon, sign: icInfo.signName, degreeFormatted: icInfo.degreeFormatted },
    },
    elementBreakdown,
    modalityBreakdown,
    synthesis,
  };
}

// Generate an elegant fallback chart model for initial render before user submits
export function getDefaultNatalChart(): FullNatalChartData {
  const mockChart = {
    bodies: {
      sun: { lon: 54.2, sign: "Taurus", signDeg: 24.2, house: 10, speed: 0.98, retrograde: false },
      moon: { lon: 12.75, sign: "Aries", signDeg: 12.75, house: 8, speed: 13.2, retrograde: false },
      mercury: { lon: 68.55, sign: "Gemini", signDeg: 8.55, house: 11, speed: 1.2, retrograde: false },
      venus: { lon: 109.06, sign: "Cancer", signDeg: 19.06, house: 12, speed: 1.1, retrograde: false },
      mars: { lon: 152.83, sign: "Virgo", signDeg: 2.83, house: 2, speed: 0.6, retrograde: false },
      jupiter: { lon: 285.4, sign: "Capricorn", signDeg: 15.4, house: 6, speed: 0.1, retrograde: true },
      saturn: { lon: 5.2, sign: "Aries", signDeg: 5.2, house: 8, speed: 0.05, retrograde: false },
      uranus: { lon: 304.1, sign: "Aquarius", signDeg: 4.1, house: 6, speed: 0.02, retrograde: true },
      neptune: { lon: 297.3, sign: "Capricorn", signDeg: 27.3, house: 5, speed: 0.01, retrograde: true },
      pluto: { lon: 242.1, sign: "Sagittarius", signDeg: 2.1, house: 4, speed: 0.01, retrograde: true },
      chiron: { lon: 200.5, sign: "Libra", signDeg: 20.5, house: 3, speed: 0.02, retrograde: false },
      true_node: { lon: 195.8, sign: "Libra", signDeg: 15.8, house: 2, speed: -0.05, retrograde: true },
    },
    angles: {
      asc: 125.3, // Leo
      mc: 44.5, // Taurus
    },
    cusps: [125.3, 148.1, 172.4, 204.5, 241.2, 282.7, 305.3, 328.1, 352.4, 24.5, 61.2, 102.7],
    aspects: [
      { bodyA: "sun", bodyB: "mars", type: "trine", orb: 1.4, phase: "applying", strength: 0.8 },
      { bodyA: "moon", bodyB: "saturn", type: "conjunction", orb: 2.5, phase: "separating", strength: 0.7 },
      { bodyA: "venus", bodyB: "uranus", type: "trine", orb: 2.0, phase: "applying", strength: 0.75 },
      { bodyA: "mercury", bodyB: "pluto", type: "opposition", orb: 3.5, phase: "separating", strength: 0.5 },
      { bodyA: "mars", bodyB: "jupiter", type: "square", orb: 2.6, phase: "applying", strength: 0.65 },
    ],
  };

  return buildFullNatalChart(mockChart, {
    birthDate: "1996-05-14",
    birthTime: "14:30",
    birthPlace: "İstanbul, Türkiye",
    latitude: 41.0082,
    longitude: 28.9784,
    timezone: "Europe/Istanbul",
  });
}


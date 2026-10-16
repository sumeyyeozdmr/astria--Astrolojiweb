import http from "node:http";
import https from "node:https";
import { findAspects } from "caelus";

// -------------------------------------------------------------------
// 1. ASPECT ENGINE UNIT TESTS (EDGE CASES, 0/360 WRAP, RETROGRADE)
// -------------------------------------------------------------------

function runAspectUnitTests() {
  console.log("=== 1. AÇI HESAPLAMA MOTORU VE SINIR DURUM TESTLERİ ===");
  const results = [];

  // Test 1.1: 0°/360° Sınır Geçişi (Wrap-around Conjunction)
  // Gezegen A: 359.0° (Balık sonu), Gezegen B: 1.0° (Koç başı). Fark: 2.0°. Kavuşum olmalı.
  const bodiesWrapConj = {
    pA: { lon: 359.0, lat: 0, speed: 1.0 },
    pB: { lon: 1.0, lat: 0, speed: 0.5 },
  };
  const aspWrapConj = findAspects(bodiesWrapConj);
  const pass1_1 =
    aspWrapConj.length === 1 &&
    aspWrapConj[0].aspect === "conjunction" &&
    Math.abs(aspWrapConj[0].orb - 2.0) < 0.01;
  results.push({
    test: "0°/360° Geçişi - Kavuşum (359° ve 1°)",
    expected: "conjunction, orb: 2.00°",
    actual: `${aspWrapConj[0]?.aspect}, orb: ${aspWrapConj[0]?.orb}°`,
    pass: pass1_1,
  });

  // Test 1.2: 0°/360° Sınır Geçişi - Karşıtlık (Opposition across boundary)
  // Gezegen A: 359.5°, Gezegen B: 179.5°. Fark: 180.0°. Tam karşıt açı olmalı.
  const bodiesWrapOpp = {
    pA: { lon: 359.5, lat: 0, speed: 1.0 },
    pB: { lon: 179.5, lat: 0, speed: 0.5 },
  };
  const aspWrapOpp = findAspects(bodiesWrapOpp);
  const pass1_2 =
    aspWrapOpp.length === 1 &&
    aspWrapOpp[0].aspect === "opposition" &&
    aspWrapOpp[0].orb === 0;
  results.push({
    test: "0°/360° Geçişi - Karşıt Açı (359.5° ve 179.5°)",
    expected: "opposition, orb: 0.00°",
    actual: `${aspWrapOpp[0]?.aspect}, orb: ${aspWrapOpp[0]?.orb}°`,
    pass: pass1_2,
  });

  // Test 1.3: Orb Dışında Kalan Açı (Orb Limit Test)
  // Üçgen açı (120°): Varsayılan max orb 8°.
  // Ayrıklık: 128.5° (orb 8.5° > 8°). Açı oluşmamalı.
  const bodiesOrbOut = {
    pA: { lon: 0.0, lat: 0, speed: 1.0 },
    pB: { lon: 128.5, lat: 0, speed: 0.5 },
  };
  const aspOrbOut = findAspects(bodiesOrbOut);
  const pass1_3 = aspOrbOut.length === 0;
  results.push({
    test: "Orb Sınırı Aşımı (128.5° üçgen - limit 8°)",
    expected: "0 açı (tespit edilmemeli)",
    actual: `${aspOrbOut.length} açı`,
    pass: pass1_3,
  });

  // Test 1.4: Retrograd Hareket ve Applying / Separating
  // Gezegen A: 100.0°, Hız: -0.5°/gün (Retrograd). Gezegen B: 90.0°, Hız: +0.2°/gün (Direkt).
  // Açısal fark: 10°. A, B'ye doğru geriliyor (100 -> 90), aradaki mesafe daralıyor.
  // Bu nedenle kavuşuma YAKLAŞAN (applying) olmalı!
  const bodiesRetro = {
    pA: { lon: 100.0, lat: 0, speed: -0.5 },
    pB: { lon: 95.0, lat: 0, speed: 0.2 },
  };
  const aspRetro = findAspects(bodiesRetro);
  const pass1_4 =
    aspRetro.length === 1 &&
    aspRetro[0].aspect === "conjunction" &&
    aspRetro[0].phase === "applying";
  results.push({
    test: "Retrograd Gezegen ile Yaklaşan Açı (Applying)",
    expected: "conjunction, applying (retrograde pA hızla pB'ye yaklaşıyor)",
    actual: `${aspRetro[0]?.aspect}, ${aspRetro[0]?.phase}`,
    pass: pass1_4,
  });

  // Test 1.5: Vaka 3'teki Ay-Mars Karesi Doğrulaması
  // Ay: 175.96396°, Hız: +13.20°/gün
  // Mars: 85.74113°, Hız: +0.62°/gün
  // Fark: 90.22283° (Kare 90° + 0.22° orb). Ay hızla uzaklaşıyor -> separating olmalı.
  const bodiesVaka3 = {
    moon: { lon: 175.96396, lat: -4.03, speed: 13.2 },
    mars: { lon: 85.74113, lat: 1.1, speed: 0.62 },
  };
  const aspVaka3 = findAspects(bodiesVaka3);
  const pass1_5 =
    aspVaka3.length === 1 &&
    aspVaka3[0].aspect === "square" &&
    Math.abs(aspVaka3[0].orb - 0.22) < 0.01 &&
    aspVaka3[0].phase === "separating";
  results.push({
    test: "Vaka 3 Ay-Mars Kare Açı Testi (90.22°)",
    expected: "square, orb: 0.22°, phase: separating",
    actual: `${aspVaka3[0]?.aspect}, orb: ${aspVaka3[0]?.orb}°, phase: ${aspVaka3[0]?.phase}`,
    pass: pass1_5,
  });

  for (const r of results) {
    console.log(`[${r.pass ? "PASS" : "FAIL"}] ${r.test}`);
    console.log(`       Beklenen: ${r.expected}`);
    console.log(`       Gerçekleşen: ${r.actual}`);
  }

  return results;
}

runAspectUnitTests();

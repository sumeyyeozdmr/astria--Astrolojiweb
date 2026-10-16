import { buildFullNatalChart } from "./lib/astrology/chartModel.js";
import http from "node:http";

async function postChart(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = http.request(
      "http://localhost:3000/api/chart",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = "";
        res.on("data", (chunk) => (body += chunk));
        res.on("end", () => {
          resolve(JSON.parse(body));
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function verifyModel() {
  console.log("=== Model ve Sentez Doğrulama Testi ===");
  const res = await postChart({
    birthDate: "1994-08-10",
    birthTime: "11:15",
    birthPlace: "Ankara",
  });

  const fullChart = buildFullNatalChart(res.chart, res.birthInfo);

  console.log(`Yerleşim Sayısı: ${fullChart.placements.length}`);
  console.log(`Güneş: ${fullChart.placements.find(p => p.id === "sun")?.planet} ${fullChart.placements.find(p => p.id === "sun")?.sign} (${fullChart.placements.find(p => p.id === "sun")?.degree})`);
  console.log(`Ay: ${fullChart.placements.find(p => p.id === "moon")?.planet} ${fullChart.placements.find(p => p.id === "moon")?.sign} (${fullChart.placements.find(p => p.id === "moon")?.degree})`);
  console.log(`ASC: ${fullChart.angles.asc.sign} (${fullChart.angles.asc.degreeFormatted})`);
  console.log(`MC: ${fullChart.angles.mc.sign} (${fullChart.angles.mc.degreeFormatted})`);
  console.log(`Kuzey Düğüm: ${fullChart.placements.find(p => p.id === "true_node")?.sign} (${fullChart.placements.find(p => p.id === "true_node")?.degree})`);
  console.log(`Güney Düğüm: ${fullChart.placements.find(p => p.id === "south_node")?.sign} (${fullChart.placements.find(p => p.id === "south_node")?.degree})`);

  console.log("\n12 Ev Kontrolü:");
  console.log(`1. Ev: ${fullChart.houses[0].sign} (Yönetici: ${fullChart.houses[0].rulerPlanet})`);
  console.log(`10. Ev: ${fullChart.houses[9].sign} (Yönetici: ${fullChart.houses[9].rulerPlanet})`);

  console.log("\nAçı Sayısı:", fullChart.aspects.length);
  if (fullChart.aspects.length > 0) {
    const a = fullChart.aspects[0];
    console.log(`Örnek Açı: ${a.bodyA.name} ${a.aspectName} ${a.bodyB.name} (${a.orbText}) [${a.nature}]`);
  }

  console.log("\nElement Dağılımı:");
  for (const [el, data] of Object.entries(fullChart.elementBreakdown)) {
    console.log(`- ${el}: %${data.percentage} (${data.planets.join(", ")})`);
  }

  console.log("\nSentez Başlıkları:");
  console.log(`Kişilik: ${fullChart.synthesis.personality.headline}`);
  console.log(`İlişkiler: ${fullChart.synthesis.relationships.headline}`);
  console.log(`Kariyer: ${fullChart.synthesis.career.headline}`);
  console.log(`Duygusal: ${fullChart.synthesis.emotional.headline}`);
  console.log(`Bütünsel: ${fullChart.synthesis.holistic.headline}`);

  console.log("\n=== Model Doğrulama Başarılı! ===");
}

verifyModel().catch(console.error);

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
          try {
            resolve({ status: res.statusCode, data: JSON.parse(body) });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log("=== ASTRIA Doğum Haritası Kapsamlı Doğrulama Testi ===");

  // Test 1: İstanbul - 1990-03-21 06:00 (Spring Equinox / Aries Sun)
  console.log("\n[Test 1] 1990-03-21 06:00 İstanbul test ediliyor...");
  const res1 = await postChart({
    birthDate: "1990-03-21",
    birthTime: "06:00",
    birthPlace: "İstanbul",
  });
  console.log("Durum Kodu:", res1.status);
  console.log("Success:", res1.data.success);
  if (res1.data.chart) {
    const sun = res1.data.chart.bodies.sun;
    const moon = res1.data.chart.bodies.moon;
    const asc = res1.data.chart.angles?.asc;
    console.log(`Güneş: ${sun.sign} (${sun.signDeg.toFixed(2)}°)`);
    console.log(`Ay: ${moon.sign} (${moon.signDeg.toFixed(2)}°)`);
    console.log(`ASC: ${asc?.toFixed(2)}°`);
    console.log(`Cusps Sayısı: ${res1.data.chart.cusps?.length}`);
    console.log(`Aspects Sayısı: ${res1.data.chart.aspects?.length}`);
  }

  // Test 2: İzmir - 1998-11-15 22:45 (Scorpio Sun, night chart)
  console.log("\n[Test 2] 1998-11-15 22:45 İzmir test ediliyor...");
  const res2 = await postChart({
    birthDate: "1998-11-15",
    birthTime: "22:45",
    birthPlace: "İzmir",
  });
  console.log("Durum Kodu:", res2.status);
  console.log("Success:", res2.data.success);
  if (res2.data.chart) {
    const sun = res2.data.chart.bodies.sun;
    const moon = res2.data.chart.bodies.moon;
    const asc = res2.data.chart.angles?.asc;
    console.log(`Güneş: ${sun.sign} (${sun.signDeg.toFixed(2)}°)`);
    console.log(`Ay: ${moon.sign} (${moon.signDeg.toFixed(2)}°)`);
    console.log(`ASC: ${asc?.toFixed(2)}°`);
  }

  // Verify that res1 and res2 give completely different, dynamic results
  if (res1.data.chart && res2.data.chart) {
    const diffSun = res1.data.chart.bodies.sun.lon !== res2.data.chart.bodies.sun.lon;
    const diffAsc = res1.data.chart.angles?.asc !== res2.data.chart.angles?.asc;
    console.log("\n[Farklı Girdi Doğrulaması]:");
    console.log("- Güneş konumları farklı mı?", diffSun ? "EVET (Dinamik)" : "HAYIR");
    console.log("- Yükselen konumları farklı mı?", diffAsc ? "EVET (Dinamik)" : "HAYIR");
  }

  // Test 3: Error case - invalid input
  console.log("\n[Test 3] Hatalı girdi / eksik bilgi testi...");
  const res3 = await postChart({
    birthDate: "",
    birthTime: "12:00",
    birthPlace: "Ankara",
  });
  console.log("Durum Kodu:", res3.status);
  console.log("Hata Mesajı:", res3.data.message);
  console.log("Hata Başarıyla Yakalandı:", res3.data.success === false ? "EVET" : "HAYIR");

  console.log("\n=== Testler Tamamlandı ===");
}

runTests().catch(console.error);

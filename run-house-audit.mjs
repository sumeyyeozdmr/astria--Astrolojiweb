import { computeIndependentChart } from "./verify-houses-independent.mjs";

const cases = [
  {
    name: "Vaka 1 (İstanbul)",
    y: 1990,
    m: 3,
    d: 21,
    h: 4,
    min: 0,
    lat: 41.01384,
    lon: 28.94966,
    caelusAsc: 355.39599,
    caelusMc: 267.58391,
    caelusCusps: [
      355.39599, 38.25283, 65.8638, 87.58391, 108.90534, 135.0681,
      175.39599, 218.25283, 245.8638, 267.58391, 288.90534, 315.0681,
    ],
  },
  {
    name: "Vaka 2 (İzmir)",
    y: 1998,
    m: 11,
    d: 15,
    h: 20,
    min: 45,
    lat: 38.41273,
    lon: 27.13838,
    caelusAsc: 134.27795,
    caelusMc: 35.41366,
    caelusCusps: [
      134.27795, 156.27817, 183.04946, 215.41366, 250.94863, 284.72444,
      314.27795, 336.27817, 3.04946, 35.41366, 70.94863, 104.72444,
    ],
  },
  {
    name: "Vaka 3 (Ankara)",
    y: 1994,
    m: 8,
    d: 10,
    h: 8,
    min: 15,
    lat: 39.91987,
    lon: 32.85427,
    caelusAsc: 200.09961,
    caelusMc: 113.3415,
    caelusCusps: [
      200.09961, 227.70177, 259.20033, 293.3415, 326.57135, 355.77836,
      20.09961, 47.70177, 79.20033, 113.3415, 146.57135, 175.77836,
    ],
  },
];

console.log("=== BAĞIMSIZ TRİGONOMETRİK EV VE AÇISAL NOKTA DENETİMİ ===");

for (const c of cases) {
  const res = computeIndependentChart(c.y, c.m, c.d, c.h, c.min, 0, c.lat, c.lon);
  const diffAsc = Math.abs(res.asc - c.caelusAsc);
  const diffMc = Math.abs(res.mc - c.caelusMc);

  console.log(`\n---------------------------------------------------------`);
  console.log(`${c.name} (Tarih: ${c.y}-${c.m}-${c.d} ${c.h}:${c.min} UTC)`);
  console.log(`RAMC: ${res.ramc.toFixed(5)}° | Ekliptik Eğikliği (eps): ${res.eps.toFixed(5)}°`);
  console.log(
    `ASC | Caelus: ${c.caelusAsc.toFixed(5)}° | Bağımsız Formül: ${res.asc.toFixed(5)}° | Fark: ${diffAsc.toFixed(6)}° (${(diffAsc * 3600).toFixed(2)}")`
  );
  console.log(
    `MC  | Caelus: ${c.caelusMc.toFixed(5)}° | Bağımsız Formül: ${res.mc.toFixed(5)}° | Fark: ${diffMc.toFixed(6)}° (${(diffMc * 3600).toFixed(2)}")`
  );

  console.log("12 Ev Başlangıç Kıyaslaması (İlk 3 Ev):");
  for (let i = 0; i < 3; i++) {
    const diff = Math.abs(res.cusps[i] - c.caelusCusps[i]);
    console.log(
      `  Ev ${i + 1} | Caelus: ${c.caelusCusps[i].toFixed(5)}° | Bağımsız: ${res.cusps[i].toFixed(5)}° | Fark: ${diff.toFixed(6)}° (${(diff * 3600).toFixed(2)}")`
    );
  }
}

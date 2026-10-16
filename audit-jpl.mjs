import https from "node:https";
import http from "node:http";

const BODIES = [
  { id: "10", name: "Güneş", key: "sun" },
  { id: "301", name: "Ay", key: "moon" },
  { id: "199", name: "Merkür", key: "mercury" },
  { id: "299", name: "Venüs", key: "venus" },
  { id: "499", name: "Mars", key: "mars" },
  { id: "599", name: "Jüpiter", key: "jupiter" },
  { id: "699", name: "Satürn", key: "saturn" },
  { id: "799", name: "Uranüs", key: "uranus" },
  { id: "899", name: "Neptün", key: "neptune" },
  { id: "999", name: "Plüton", key: "pluto" },
];

function queryJPL(targetId, start, stop) {
  const url = `https://ssd.jpl.nasa.gov/api/horizons.api?format=json&COMMAND='${targetId}'&OBJ_DATA='NO'&MAKE_EPHEM='YES'&EPHEM_TYPE='OBSERVER'&CENTER='500@399'&START_TIME='${start}'&STOP_TIME='${stop}'&STEP_SIZE='1m'&QUANTITIES='31'`;
  return new Promise((resolve) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            const lines = parsed.result.split("\n");
            const soe = lines.findIndex((l) => l.includes("$$SOE"));
            if (soe !== -1) {
              const row = lines[soe + 1].trim().split(/\s+/);
              resolve({
                targetId,
                lon: parseFloat(row[2]),
                lat: parseFloat(row[3]),
                rawLine: lines[soe + 1].trim(),
                signature: parsed.signature,
              });
            } else {
              resolve({ error: "SOE not found", raw: parsed.result?.slice(0, 200) });
            }
          } catch (e) {
            resolve({ error: e.message });
          }
        });
      })
      .on("error", (err) => resolve({ error: err.message }));
  });
}

function getCaelusChart(payload) {
  return new Promise((resolve) => {
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
        res.on("data", (c) => (body += c));
        res.on("end", () => resolve(JSON.parse(body)));
      }
    );
    req.write(data);
    req.end();
  });
}

async function run() {
  const cases = [
    {
      label: "Vaka 1",
      date: "1990-03-21",
      time: "06:00",
      place: "İstanbul",
      startUtc: "1990-03-21 04:00",
      stopUtc: "1990-03-21 04:01",
    },
    {
      label: "Vaka 2",
      date: "1998-11-15",
      time: "22:45",
      place: "İzmir",
      startUtc: "1998-11-15 20:45",
      stopUtc: "1998-11-15 20:46",
    },
    {
      label: "Vaka 3",
      date: "1994-08-10",
      time: "11:15",
      place: "Ankara",
      startUtc: "1994-08-10 08:15",
      stopUtc: "1994-08-10 08:16",
    },
  ];

  const results = [];

  for (const c of cases) {
    console.log(`\n======================================================`);
    console.log(`İŞLENİYOR: ${c.label} (${c.date} ${c.time} ${c.place}) UTC: ${c.startUtc}`);
    const apiRes = await getCaelusChart({
      birthDate: c.date,
      birthTime: c.time,
      birthPlace: c.place,
    });
    const chart = apiRes.chart;

    const caseData = {
      case: c,
      birthInfo: apiRes.birthInfo,
      angles: chart.angles,
      cusps: chart.cusps,
      aspects: chart.aspects,
      comparisons: [],
    };

    for (const b of BODIES) {
      const jpl = await queryJPL(b.id, c.startUtc, c.stopUtc);
      const caelusBody = chart.bodies[b.key];
      const cLon = caelusBody ? caelusBody.lon : null;
      const cSpeed = caelusBody ? caelusBody.speed : null;
      const jplLon = jpl.lon;
      const diff =
        cLon !== null && jplLon !== undefined
          ? Math.abs(cLon - jplLon)
          : null;
      const diffSec = diff !== null ? (diff * 3600).toFixed(2) : "N/A";

      console.log(
        `${b.name.padEnd(8)} | Caelus: ${cLon?.toFixed(5).padStart(9)}° | JPL: ${jplLon?.toFixed(5).padStart(9)}° | Fark: ${diff?.toFixed(6)}° (${diffSec}")`
      );

      caseData.comparisons.push({
        name: b.name,
        key: b.key,
        targetId: b.id,
        caelusLon: cLon,
        caelusSpeed: cSpeed,
        jplLon,
        diffDeg: diff,
        diffArcSec: diff !== null ? diff * 3600 : null,
        rawJPL: jpl.rawLine,
      });
    }

    results.push(caseData);
  }

  console.log("\n--- TÜM KARŞILAŞTIRMALAR TAMAMLANDI ---");
}

run().catch(console.error);

// Independent Astronomical Calculation of RAMC, MC, ASC, and Placidus Cusps
// Formulated from standard celestial mechanics (Meeus, "Astronomical Algorithms", Chapter 12 & 14; and Placidus semi-arc formulation).

function toRad(deg) {
  return (deg * Math.PI) / 180;
}
function toDeg(rad) {
  return (rad * 180) / Math.PI;
}
function normDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

// Calculate Julian Day from Gregorian UTC
function calcJD(year, month, day, hour, minute, second = 0) {
  let y = year;
  let m = month;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFrac = day + (hour + minute / 60 + second / 3600) / 24;
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + dayFrac + B - 1524.5;
}

// Greenwich Mean Sidereal Time (IAU 1982 / Meeus)
function calcGMST(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  let gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
  return normDeg(gmst);
}

// True Obliquity of Date (with approximate nutation)
function calcObliquity(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const eps0 = 23.4392911 - 0.0130042 * T - 0.00000016 * T * T + 0.000000504 * T * T * T;
  // Nutation in obliquity approximation
  const omega = normDeg(125.04452 - 1934.136261 * T);
  const deltaEps = (9.20 * Math.cos(toRad(omega))) / 3600.0;
  return eps0 + deltaEps;
}

// Nutation in longitude approximation for true sidereal time
function calcNutationLon(jd) {
  const T = (jd - 2451545.0) / 36525.0;
  const omega = normDeg(125.04452 - 1934.136261 * T);
  const L = normDeg(280.4665 + 36000.7698 * T);
  const deltaPsi = (-17.20 * Math.sin(toRad(omega)) - 1.32 * Math.sin(toRad(2 * L))) / 3600.0;
  return deltaPsi;
}

// Calculate MC and ASC
function calcAngles(ramc, eps, lat) {
  const ramcR = toRad(ramc);
  const epsR = toRad(eps);
  const latR = toRad(lat);

  // MC: tan(MC) = tan(RAMC) / cos(eps)
  let mc = toDeg(Math.atan2(Math.sin(ramcR), Math.cos(ramcR) * Math.cos(epsR)));
  mc = normDeg(mc);

  // ASC: tan(ASC) = -cos(RAMC) / (sin(RAMC)*cos(eps) + tan(lat)*sin(eps))
  let asc = toDeg(Math.atan2(-Math.cos(ramcR), Math.sin(ramcR) * Math.cos(epsR) + Math.tan(latR) * Math.sin(epsR)));
  asc = normDeg(asc + 180); // Placed in Eastern horizon

  return { mc, asc };
}

// Independent Placidus Cusp Solver
// For cusps 11, 12 (semi-arc above horizon) and 2, 3 (semi-arc below horizon)
function calcPlacidusCusp(ramc, f, isAbove, eps, lat) {
  const epsR = toRad(eps);
  const latR = toRad(lat);
  // Initial estimate of right ascension
  let ra = isAbove ? normDeg(ramc + f * 90) : normDeg(ramc + 180 - f * 90);

  // Iterate to solve transcendental Placidus equation
  for (let iter = 0; iter < 100; iter++) {
    const raR = toRad(ra);
    // Declination for this RA on ecliptic: sin(dec) = sin(RA) * tan(eps) / sqrt(1 + sin(RA)^2 * tan(eps)^2) ... or tan(dec) = sin(RA) * tan(eps)
    const sinDec = Math.sin(raR) * Math.sin(epsR); // approximation on ecliptic
    const dec = Math.asin(Math.max(-1, Math.min(1, sinDec)));

    // Semi-diurnal arc
    const tanTan = Math.tan(latR) * Math.tan(dec);
    if (Math.abs(tanTan) >= 1) break; // Circumpolar
    const semiArc = isAbove ? Math.acos(-tanTan) : Math.acos(tanTan); // radians

    // Meridian distance = f * semiArc
    const targetMD = f * toDeg(semiArc);
    const currentMD = isAbove ? normDeg(ra - ramc) : normDeg(ramc + 180 - ra);

    const error = currentMD - targetMD;
    if (Math.abs(error) < 0.00001) break;
    ra = normDeg(ra - error * 0.5);
  }

  // Convert RA on ecliptic to longitude: tan(lon) = tan(RA) / cos(eps)
  const raR = toRad(ra);
  const lon = normDeg(toDeg(Math.atan2(Math.sin(raR), Math.cos(raR) * Math.cos(epsR))));
  return lon;
}

export function computeIndependentChart(year, month, day, hour, minute, second, lat, lon) {
  const jd = calcJD(year, month, day, hour, minute, second);
  const gmst = calcGMST(jd);
  const nutLon = calcNutationLon(jd);
  const eps = calcObliquity(jd);
  const gast = normDeg(gmst + nutLon * Math.cos(toRad(eps))); // Greenwich Apparent Sidereal Time
  const ramc = normDeg(gast + lon); // Local Sidereal Time in degrees

  const { mc, asc } = calcAngles(ramc, eps, lat);

  const c11 = calcPlacidusCusp(ramc, 1 / 3, true, eps, lat);
  const c12 = calcPlacidusCusp(ramc, 2 / 3, true, eps, lat);
  const c2 = calcPlacidusCusp(ramc, 2 / 3, false, eps, lat);
  const c3 = calcPlacidusCusp(ramc, 1 / 3, false, eps, lat);

  const cusps = [
    asc,
    c2,
    c3,
    normDeg(mc + 180),
    normDeg(c11 + 180),
    normDeg(c12 + 180),
    normDeg(asc + 180),
    normDeg(c2 + 180),
    normDeg(c3 + 180),
    mc,
    c11,
    c12,
  ];

  return { jd, gmst, gast, ramc, eps, asc, mc, cusps };
}

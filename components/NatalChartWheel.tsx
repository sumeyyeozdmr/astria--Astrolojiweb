"use client";

import React, { useMemo, useState } from "react";
import { CalculatedAspect, CalculatedPlacement } from "@/lib/astrology/types";
import { ZODIAC_SIGNS } from "@/lib/astrology/constants";

interface NatalChartWheelProps {
  placements: CalculatedPlacement[];
  cusps: number[]; // 12 house cusp longitudes (0..360)
  aspects: CalculatedAspect[];
  ascLongitude?: number;
  mcLongitude?: number;
  activePlacementId?: string;
  onSelectPlacement?: (placementId: string) => void;
}

export default function NatalChartWheel({
  placements,
  cusps,
  aspects,
  ascLongitude = 0,
  mcLongitude,
  activePlacementId,
  onSelectPlacement,
}: NatalChartWheelProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const cx = 300;
  const cy = 300;
  const outerR = 270;
  const zodiacInnerR = 228;
  const housesInnerR = 145;
  const planetR = 186;
  const aspectsCenterR = 138;

  // Professional astrological orientation: ASC at 180° (9 o'clock, left horizon)
  // Counter-clockwise progression
  const getCoordinates = (longitude: number, radius: number) => {
    const chartAngleDeg = 180 + (longitude - ascLongitude);
    const rad = (chartAngleDeg * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy - radius * Math.sin(rad),
      deg: chartAngleDeg,
    };
  };

  // Safe cusps
  const safeCusps = useMemo(() => {
    if (Array.isArray(cusps) && cusps.length === 12) return cusps;
    return [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  }, [cusps]);

  // Separate overlapping planets on the wheel slightly if their degrees are too close
  const planetPositions = useMemo(() => {
    const sorted = [...placements].sort((a, b) => a.rawLongitude - b.rawLongitude);
    const positions: Record<string, { x: number; y: number; lon: number; r: number }> = {};

    for (let i = 0; i < sorted.length; i++) {
      const p = sorted[i];
      let adjustedR = planetR;

      // Stagger radius slightly if adjacent to another planet within 7 degrees
      if (i > 0) {
        const prev = sorted[i - 1];
        const diff = Math.abs(p.rawLongitude - prev.rawLongitude);
        if (diff < 7 || diff > 353) {
          adjustedR = i % 2 === 0 ? planetR + 14 : planetR - 14;
        }
      }

      const coords = getCoordinates(p.rawLongitude, adjustedR);
      positions[p.id] = { ...coords, lon: p.rawLongitude, r: adjustedR };
    }
    return positions;
  }, [placements, ascLongitude]);

  return (
    <div className="relative w-full max-w-[540px] mx-auto aspect-square select-none">
      <svg
        viewBox="0 0 600 600"
        className="w-full h-full drop-shadow-[0_15px_35px_rgba(0,0,0,0.8)]"
      >
        <defs>
          {/* Subtle cosmic gold gradients */}
          <radialGradient id="wheelCenterGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#dfbe96" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#120f20" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#08060f" stopOpacity="0.95" />
          </radialGradient>

          <linearGradient id="goldRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#dfbe96" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#9a7a50" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#dfbe96" stopOpacity="0.9" />
          </linearGradient>

          <filter id="glowGold" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Background and Glowing Circles */}
        <circle cx={cx} cy={cy} r={outerR + 4} fill="#090611" stroke="#dfbe9630" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={outerR} fill="#0d0a17" stroke="url(#goldRingGrad)" strokeWidth="1.5" />
        <circle cx={cx} cy={cy} r={zodiacInnerR} fill="#080510" stroke="#dfbe9640" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={housesInnerR} fill="#06030b" stroke="#dfbe9625" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={aspectsCenterR} fill="url(#wheelCenterGlow)" stroke="#dfbe9630" strokeWidth="1" />

        {/* 12 Zodiac Sign Bands */}
        {ZODIAC_SIGNS.map((sign, index) => {
          const startLon = index * 30;
          const endLon = (index + 1) * 30;
          const midLon = startLon + 15;

          const p1 = getCoordinates(startLon, outerR);
          const p2 = getCoordinates(startLon, zodiacInnerR);
          const midCoords = getCoordinates(midLon, (outerR + zodiacInnerR) / 2);

          const elementColors: Record<string, string> = {
            Ateş: "#f87171",
            Toprak: "#4ade80",
            Hava: "#38bdf8",
            Su: "#a78bfa",
          };

          return (
            <g key={sign.key}>
              {/* Divider line between signs */}
              <line
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                stroke="#dfbe9635"
                strokeWidth="1"
              />
              {/* Sign Glyph */}
              <text
                x={midCoords.x}
                y={midCoords.y}
                fill={elementColors[sign.element] || "#dfbe96"}
                fontSize="15"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
                className="transition-transform duration-300 hover:scale-125"
                opacity="0.85"
              >
                {sign.symbol}
              </text>
            </g>
          );
        })}

        {/* 12 House Cusp Lines */}
        {safeCusps.map((cuspLon, idx) => {
          const houseNum = idx + 1;
          const pOut = getCoordinates(cuspLon, zodiacInnerR);
          const pIn = getCoordinates(cuspLon, aspectsCenterR);

          const isAsc = houseNum === 1;
          const isMc = houseNum === 10;
          const isDesc = houseNum === 7;
          const isIc = houseNum === 4;
          const isAngular = isAsc || isMc || isDesc || isIc;

          // Number location in the house
          const nextCusp = safeCusps[(idx + 1) % 12];
          const span = ((nextCusp - cuspLon + 360) % 360);
          const midHouseLon = (cuspLon + span / 2) % 360;
          const numCoords = getCoordinates(midHouseLon, housesInnerR + 14);

          return (
            <g key={`house-${houseNum}`}>
              <line
                x1={pOut.x}
                y1={pOut.y}
                x2={pIn.x}
                y2={pIn.y}
                stroke={isAngular ? "#dfbe96" : "#dfbe9625"}
                strokeWidth={isAngular ? "1.8" : "0.75"}
                strokeDasharray={isAngular ? "none" : "3,3"}
              />
              {/* House Number badge */}
              <text
                x={numCoords.x}
                y={numCoords.y}
                fill={isAngular ? "#dfbe96" : "#7c7267"}
                fontSize="10"
                fontFamily="sans-serif"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {houseNum}
              </text>
            </g>
          );
        })}

        {/* Major Angle Labels (ASC & MC) */}
        {(() => {
          const ascCoords = getCoordinates(ascLongitude, outerR + 14);
          const descCoords = getCoordinates((ascLongitude + 180) % 360, outerR + 14);
          return (
            <>
              <text
                x={ascCoords.x}
                y={ascCoords.y}
                fill="#dfbe96"
                fontSize="11"
                fontWeight="bold"
                letterSpacing="1"
                textAnchor="middle"
                dominantBaseline="central"
                filter="url(#glowGold)"
              >
                ASC
              </text>
              <text
                x={descCoords.x}
                y={descCoords.y}
                fill="#a99e91"
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="central"
              >
                DSC
              </text>
            </>
          );
        })()}

        {typeof mcLongitude === "number" && (() => {
          const mcCoords = getCoordinates(mcLongitude, outerR + 14);
          const icCoords = getCoordinates((mcLongitude + 180) % 360, outerR + 14);
          return (
            <>
              <text
                x={mcCoords.x}
                y={mcCoords.y}
                fill="#dfbe96"
                fontSize="11"
                fontWeight="bold"
                letterSpacing="1"
                textAnchor="middle"
                dominantBaseline="central"
                filter="url(#glowGold)"
              >
                MC
              </text>
              <text
                x={icCoords.x}
                y={icCoords.y}
                fill="#a99e91"
                fontSize="10"
                textAnchor="middle"
                dominantBaseline="central"
              >
                IC
              </text>
            </>
          );
        })()}

        {/* Aspect Chords in Central Circle */}
        <g opacity="0.65">
          {aspects.map((asp, idx) => {
            const posA = planetPositions[asp.bodyA.key];
            const posB = planetPositions[asp.bodyB.key];
            if (!posA || !posB) return null;

            const cA = getCoordinates(posA.lon, aspectsCenterR);
            const cB = getCoordinates(posB.lon, aspectsCenterR);

            let strokeColor = "#dfbe96";
            if (asp.aspect === "trine" || asp.aspect === "sextile") strokeColor = "#34d399"; // soft green
            if (asp.aspect === "square" || asp.aspect === "opposition") strokeColor = "#f43f5e"; // dynamic red/rose
            if (asp.aspect === "conjunction") strokeColor = "#fbbf24"; // vibrant gold

            const isHighlighted =
              hoveredPlanet === asp.bodyA.key ||
              hoveredPlanet === asp.bodyB.key ||
              activePlacementId === asp.bodyA.key ||
              activePlacementId === asp.bodyB.key;

            return (
              <line
                key={`asp-${idx}`}
                x1={cA.x}
                y1={cA.y}
                x2={cB.x}
                y2={cB.y}
                stroke={strokeColor}
                strokeWidth={isHighlighted ? 1.6 : 0.8}
                strokeOpacity={isHighlighted ? 0.95 : 0.35}
                strokeDasharray={asp.aspect === "sextile" ? "3,3" : "none"}
              />
            );
          })}
        </g>

        {/* Center Emblem / Astria Touch */}
        <circle cx={cx} cy={cy} r={28} fill="#0d091a" stroke="#dfbe9640" strokeWidth="1" />
        <text
          x={cx}
          y={cy - 2}
          fill="#dfbe96"
          fontSize="8"
          fontWeight="bold"
          letterSpacing="2.5"
          textAnchor="middle"
          dominantBaseline="central"
        >
          ASTRIA
        </text>
        <circle cx={cx} cy={cy} r={3} fill="#dfbe96" />

        {/* Celestial Body Glyphs Placed at Exact Longitudes */}
        {placements.map((p) => {
          const pos = planetPositions[p.id];
          if (!pos) return null;

          const isSelected = activePlacementId === p.id;
          const isHovered = hoveredPlanet === p.id;

          return (
            <g
              key={p.id}
              className="cursor-pointer transition-all duration-200"
              onClick={() => onSelectPlacement?.(p.id)}
              onMouseEnter={() => setHoveredPlanet(p.id)}
              onMouseLeave={() => setHoveredPlanet(null)}
            >
              {/* Radial tick to cusp ring */}
              <line
                x1={pos.x}
                y1={pos.y}
                x2={getCoordinates(p.rawLongitude, zodiacInnerR).x}
                y2={getCoordinates(p.rawLongitude, zodiacInnerR).y}
                stroke={isSelected ? "#dfbe96" : "#dfbe9630"}
                strokeWidth={isSelected ? 1.5 : 0.6}
              />

              {/* Target circle halo */}
              {(isSelected || isHovered) && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={16}
                  fill="#dfbe9618"
                  stroke="#dfbe96"
                  strokeWidth="1.2"
                  filter="url(#glowGold)"
                />
              )}

              {/* Planet background disc */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={11}
                fill={isSelected ? "#dfbe96" : "#130f24"}
                stroke={isSelected ? "#ffffff" : "#dfbe9670"}
                strokeWidth="1"
              />

              {/* Planet Symbol */}
              <text
                x={pos.x}
                y={pos.y + 0.5}
                fill={isSelected ? "#0c0919" : "#f4eee5"}
                fontSize="12"
                fontWeight="bold"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {p.symbol}
              </text>

              {/* Retrograde mark */}
              {p.isRetrograde && (
                <text
                  x={pos.x + 9}
                  y={pos.y - 7}
                  fill="#ef4444"
                  fontSize="8"
                  fontWeight="bold"
                >
                  ℞
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Floating active body quick tooltip indicator */}
      {hoveredPlanet && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#120f24ee] border border-[#dfbe9650] text-[11px] text-[#dfbe96] shadow-[0_4px_15px_rgba(0,0,0,0.5)] backdrop-blur-md pointer-events-none">
          {placements.find((p) => p.id === hoveredPlanet)?.planet} ·{" "}
          {placements.find((p) => p.id === hoveredPlanet)?.degree}{" "}
          {placements.find((p) => p.id === hoveredPlanet)?.sign}
        </div>
      )}
    </div>
  );
}

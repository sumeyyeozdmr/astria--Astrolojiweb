export type ZodiacElement = "Ateş" | "Toprak" | "Hava" | "Su";
export type ZodiacModality = "Öncü" | "Sabit" | "Değişken";

export interface SignDetail {
  key: string;
  name: string;
  symbol: string;
  element: ZodiacElement;
  modality: ZodiacModality;
  ruler: string;
  modernRuler?: string;
  keywords: string[];
}

export type AspectType = "conjunction" | "opposition" | "square" | "trine" | "sextile";

export interface AspectInfo {
  type: AspectType;
  name: string;
  symbol: string;
  angle: number;
  maxOrb: number;
  nature: "Harmonik" | "Dinamik" | "Birleştirici";
}

export interface CalculatedPlacement {
  id: string;
  symbol: string;
  planet: string;
  sign: string;
  signSymbol: string;
  degree: string;
  rawLongitude: number;
  signDegree: number;
  house: string;
  houseNumber: number;
  element: ZodiacElement;
  modality: ZodiacModality;
  isRetrograde: boolean;
  theme: string;
  insight: string;
  reflectionQuestion: string;
  strengths: string[];
  growthAreas: string[];
  aspects: CalculatedAspect[];
}

export interface CalculatedAspect {
  bodyA: {
    key: string;
    name: string;
    symbol: string;
    sign: string;
    house: number;
  };
  bodyB: {
    key: string;
    name: string;
    symbol: string;
    sign: string;
    house: number;
  };
  aspect: AspectType;
  aspectName: string;
  aspectSymbol: string;
  nature: "Harmonik" | "Dinamik" | "Birleştirici";
  orb: number;
  orbText: string;
  phase: "applying" | "separating";
  strength: number;
  interpretation: string;
}

export interface HouseData {
  number: number;
  title: string;
  theme: string;
  cuspLongitude: number;
  sign: string;
  signSymbol: string;
  cuspDegreeFormatted: string;
  rulerPlanet: string;
  rulerHouse?: number;
  planetsInside: {
    key: string;
    name: string;
    symbol: string;
    sign: string;
    degree: string;
  }[];
  interpretation: string;
}

export interface PersonalitySynthesis {
  headline: string;
  summary: string;
  sunMoonRisingSynthesis: string;
  mindAndCommunication: string;
  coreStrengths: string[];
  innerTensionsAndGrowth: string[];
}

export interface RelationshipSynthesis {
  headline: string;
  loveStyle: string;
  venusMarsDynamic: string;
  partnershipHouses: string;
  attractionAndExpectations: string;
  constructiveAdvice: string;
}

export interface CareerSynthesis {
  headline: string;
  mcAndLifeDirection: string;
  workStyleAndHabits: string;
  materialValuesAndTalents: string;
  saturnJupiterBalance: string;
  inspirationalFields: string;
}

export interface EmotionalSynthesis {
  headline: string;
  moonNeeds: string;
  safeHavenFourthHouse: string;
  emotionalReactions: string;
  selfCareSuggestion: string;
}

export interface HolisticWellness {
  headline: string;
  vitalityTheme: string;
  elementalBalanceNote: string;
  mindBodyRhythm: string;
  lifestyleAffirmation: string;
}

export interface ElementBreakdown {
  element: ZodiacElement;
  symbol: string;
  count: number;
  percentage: number;
  nature: string;
  meaning: string;
  planets: string[];
}

export interface ModalityBreakdown {
  modality: ZodiacModality;
  count: number;
  percentage: number;
  meaning: string;
  planets: string[];
}

export interface FullNatalChartData {
  birthInfo: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  placements: CalculatedPlacement[];
  houses: HouseData[];
  aspects: CalculatedAspect[];
  angles: {
    asc: { longitude: number; sign: string; degreeFormatted: string };
    mc: { longitude: number; sign: string; degreeFormatted: string };
    desc?: { longitude: number; sign: string; degreeFormatted: string };
    ic?: { longitude: number; sign: string; degreeFormatted: string };
  };
  elementBreakdown: Record<ZodiacElement, ElementBreakdown>;
  modalityBreakdown: Record<ZodiacModality, ModalityBreakdown>;
  synthesis: {
    personality: PersonalitySynthesis;
    relationships: RelationshipSynthesis;
    career: CareerSynthesis;
    emotional: EmotionalSynthesis;
    holistic: HolisticWellness;
  };
}

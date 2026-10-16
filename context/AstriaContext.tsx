"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AstriaProfile {
  name?: string;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  sunSign: string;
  sunSymbol: string;
  moonSign: string;
  moonSymbol: string;
  risingSign: string;
  risingSymbol: string;
  elementFocus: string;
  isSet: boolean;
}

interface DailyCardState {
  cardId: number | null;
  dateKey: string | null;
}

interface AstriaContextType {
  profile: AstriaProfile;
  saveProfile: (data: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    name?: string;
    sunSign?: string;
    sunSymbol?: string;
    moonSign?: string;
    moonSymbol?: string;
    risingSign?: string;
    risingSymbol?: string;
    elementFocus?: string;
  }) => void;
  clearProfile: () => void;
  dailyCard: DailyCardState;
  selectDailyCard: (id: number) => void;
  resetDailyCard: () => void;
}

const DEFAULT_PROFILE: AstriaProfile = {
  name: "Gezgin",
  birthDate: "1996-05-14",
  birthTime: "14:30",
  birthPlace: "İstanbul, Türkiye",
  sunSign: "Boğa",
  sunSymbol: "♉",
  moonSign: "Koç",
  moonSymbol: "♈",
  risingSign: "Aslan",
  risingSymbol: "♌",
  elementFocus: "Toprak & Ateş Dengesi",
  isSet: false, // Kullanıcı doğum bilgilerini girene kadar örnek önizleme profili
};

const AstriaContext = createContext<AstriaContextType | undefined>(undefined);

// Doğum tarihinden (Ay-Gün) yaklaşık Güneş burcunu belirleyen yardımcı fonksiyon
function calculateSunSign(birthDate: string): { sign: string; symbol: string } {
  if (!birthDate) return { sign: "Boğa", symbol: "♉" };
  const d = new Date(birthDate);
  if (isNaN(d.getTime())) return { sign: "Boğa", symbol: "♉" };

  const month = d.getMonth() + 1;
  const day = d.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { sign: "Koç", symbol: "♈" };
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { sign: "Boğa", symbol: "♉" };
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { sign: "İkizler", symbol: "♊" };
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { sign: "Yengeç", symbol: "♋" };
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { sign: "Aslan", symbol: "♌" };
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { sign: "Başak", symbol: "♍" };
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { sign: "Terazi", symbol: "♎" };
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { sign: "Akrep", symbol: "♏" };
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { sign: "Yay", symbol: "♐" };
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { sign: "Oğlak", symbol: "♑" };
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { sign: "Kova", symbol: "♒" };
  return { sign: "Balık", symbol: "♓" };
}

export function AstriaProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<AstriaProfile>(DEFAULT_PROFILE);
  const [dailyCard, setDailyCard] = useState<DailyCardState>({ cardId: null, dateKey: null });

  // Bileşen ilk açıldığında yerel depolamadan (localStorage) kayıtlı verileri yükle
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("astria_user_profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const todayKey = new Date().toISOString().split("T")[0];
      const savedCard = localStorage.getItem("astria_daily_card");
      if (savedCard) {
        const parsed: DailyCardState = JSON.parse(savedCard);
        if (parsed.dateKey === todayKey) {
          setDailyCard(parsed);
        } else {
          // Yeni gün: gün değiştiğinde kart seçimini sıfırla
          localStorage.removeItem("astria_daily_card");
        }
      }
    } catch {
      // Yerel depolama kısıtlaması (gizli sekme vb.) durumunda sessizce devam et
    }
  }, []);

  const saveProfile = (data: {
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    name?: string;
    sunSign?: string;
    sunSymbol?: string;
    moonSign?: string;
    moonSymbol?: string;
    risingSign?: string;
    risingSymbol?: string;
    elementFocus?: string;
  }) => {
    const sun = calculateSunSign(data.birthDate);
    const updated: AstriaProfile = {
      name: data.name || profile.name || "Gezgin",
      birthDate: data.birthDate,
      birthTime: data.birthTime,
      birthPlace: data.birthPlace,
      sunSign: data.sunSign || sun.sign,
      sunSymbol: data.sunSymbol || sun.symbol,
      moonSign: data.moonSign || profile.moonSign,
      moonSymbol: data.moonSymbol || profile.moonSymbol,
      risingSign: data.risingSign || profile.risingSign,
      risingSymbol: data.risingSymbol || profile.risingSymbol,
      elementFocus: data.elementFocus || "Kişiselleştirilmiş Kozmik Rezonans",
      isSet: true,
    };
    setProfile(updated);
    try {
      localStorage.setItem("astria_user_profile", JSON.stringify(updated));
    } catch {}
  };

  const clearProfile = () => {
    setProfile(DEFAULT_PROFILE);
    try {
      localStorage.removeItem("astria_user_profile");
    } catch {}
  };

  const selectDailyCard = (id: number) => {
    const todayKey = new Date().toISOString().split("T")[0];
    const newState = { cardId: id, dateKey: todayKey };
    setDailyCard(newState);
    try {
      localStorage.setItem("astria_daily_card", JSON.stringify(newState));
    } catch {}
  };

  const resetDailyCard = () => {
    setDailyCard({ cardId: null, dateKey: null });
    try {
      localStorage.removeItem("astria_daily_card");
    } catch {}
  };

  return (
    <AstriaContext.Provider
      value={{
        profile,
        saveProfile,
        clearProfile,
        dailyCard,
        selectDailyCard,
        resetDailyCard,
      }}
    >
      {children}
    </AstriaContext.Provider>
  );
}

export function useAstria() {
  const context = useContext(AstriaContext);
  if (!context) {
    throw new Error("useAstria bir AstriaProvider içerisinde kullanılmalıdır");
  }
  return context;
}

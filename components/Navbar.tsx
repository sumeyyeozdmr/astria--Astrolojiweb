"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AstriaLogo from "./AstriaLogo";

export type NavTab = string;

export interface NavbarProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

interface SubMenuItem {
  label: string;
  href: string;
  icon: string;
  description?: string;
}

interface MenuItem {
  id: string;
  label: string;
  href?: string;
  items?: SubMenuItem[];
}

const MENU: MenuItem[] = [
  {
    id: "kesfet",
    label: "Keşfet",
    href: "/",
  },
  {
    id: "haritalarim",
    label: "Haritalarım",
    items: [
      {
        label: "Doğum Haritası",
        href: "/haritalarim/dogum-haritasi",
        icon: "☉",

      },
      {
        label: "Kader Haritası",
        href: "/haritalarim/kader-haritasi",
        icon: "⟡",

      },
      {
        label: "Astrolojik Profilim",
        href: "/haritalarim/profilim",
        icon: "✦",

      },
    ],
  },
  {
    id: "gunluk",
    label: "Günlük Deneyim",
    items: [
      {
        label: "Günlük Kart",
        href: "/gunluk/kart",
        icon: "☾",

      },
      {
        label: "Günlük Gökyüzü",
        href: "/gunluk/gokyuzu",
        icon: "✧",

      },
      {
        label: "Ay Takvimi",
        href: "/gunluk/ay-takvimi",
        icon: "○",

      },
    ],
  },
  {
    id: "ask-ve-uyum",
    label: "Aşk ve Uyum",
    href: "/ask-ve-uyum",
  },
];

export default function Navbar(_props: NavbarProps = {}) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({
    haritalarim: true,
    gunluk: true,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Menü dışına tıklandığında açılır pencereyi kapat
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sayfa değiştiğinde açık menüleri kapat
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
      setOpenDropdown(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const toggleMobileGroup = (id: string) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const isItemActive = (menuItem: MenuItem): boolean => {
    if (menuItem.href) {
      if (menuItem.href === "/") return pathname === "/";
      return pathname.startsWith(menuItem.href);
    }
    if (menuItem.items) {
      return menuItem.items.some((sub) => pathname === sub.href);
    }
    return false;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "bg-[#08060ec8] backdrop-blur-2xl border-b border-[#dfbe9626] py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.7)]"
        : "bg-transparent py-4 md:py-5 border-b border-white/[0.06]"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
        {/* Özel Yıldızlı 'I' Sembollü Marka Logosu */}
        <Link
          href="/"
          className="group transition-opacity hover:opacity-90 cursor-pointer"
          aria-label="ASTRIA ana sayfa"
        >
          <AstriaLogo size="md" />
        </Link>

        {/* Masaüstü Navigasyon Menüsü */}
        <nav
          ref={dropdownRef}
          aria-label="Üst Navigasyon"
          className="hidden lg:flex items-center gap-1.5 p-1 rounded-full border border-[#dfbe9626] bg-[#0c091895] backdrop-blur-md shadow-[inset_0_1px_rgba(255,255,255,0.05)]"
        >
          {MENU.map((item) => {
            const active = isItemActive(item);

            // Doğrudan Bağlantı (Keşfet, Aşk ve Uyum)
            if (item.href) {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`px-4 py-2 rounded-full text-[11px] tracking-[0.14em] uppercase transition-all duration-300 relative border ${
                    active
                      ? "bg-[#dfbe9624] text-[#fff4e3] font-medium border-[#dfbe9690] shadow-[0_0_22px_rgba(223,190,150,0.35)]"
                      : "text-[#c2b4a3] border-transparent hover:text-[#fff4e3] hover:bg-[#dfbe9618] hover:border-[#dfbe9660] hover:shadow-[0_0_18px_rgba(223,190,150,0.25)]"
                  }`}
                >
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full bg-[#dfbe96] shadow-[0_0_8px_#dfbe96]" />
                  )}
                </Link>
              );
            }

            // Açılır Menü Grubu (Haritalarım, Günlük Deneyim)
            const isOpen = openDropdown === item.id;
            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : item.id)}
                  onMouseEnter={() => setOpenDropdown(item.id)}
                  aria-expanded={isOpen}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] tracking-[0.14em] uppercase transition-all duration-300 cursor-pointer relative border ${
                    active || isOpen
                      ? "bg-[#dfbe9624] text-[#fff4e3] font-medium border-[#dfbe9690] shadow-[0_0_22px_rgba(223,190,150,0.35)]"
                      : "text-[#c2b4a3] border-transparent hover:text-[#fff4e3] hover:bg-[#dfbe9618] hover:border-[#dfbe9660] hover:shadow-[0_0_18px_rgba(223,190,150,0.25)]"
                  }`}
                >
                  <span>{item.label}</span>
                  <span
                    className={`text-[9px] text-[#dfbe96] transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    ▾
                  </span>
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-0.5 rounded-full bg-[#dfbe96] shadow-[0_0_8px_#dfbe96]" />
                  )}
                </button>

                {/* Dropdown Menu Panel */}
                {isOpen && item.items && (
                  <div
                    onMouseLeave={() => setOpenDropdown(null)}
                    className="absolute top-full left-0 mt-2 min-w-[240px] rounded-2xl border border-[#dfbe9640] bg-[#0c091ae6] backdrop-blur-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(223,190,150,0.18)] animate-in fade-in slide-in-from-top-2 duration-200 z-50"
                  >
                    <div className="flex flex-col gap-1">
                      {item.items.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            onClick={() => setOpenDropdown(null)}
                            className={`group relative flex flex-col px-3.5 py-2.5 rounded-xl transition-all duration-200 overflow-hidden cursor-pointer ${
                              isSubActive
                                ? "bg-[#dfbe9620] border border-[#dfbe9670] text-[#f4eee5] shadow-[0_0_15px_rgba(223,190,150,0.2)]"
                                : "hover:bg-[#dfbe9610] border border-transparent text-[#b8ada2] hover:text-[#fff4e3]"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-serif font-medium tracking-wide group-hover:text-[#fae2c0] transition-colors duration-200">
                                {sub.label}
                              </span>
                              <span
                                className={`text-xs transition-all duration-200 ${
                                  isSubActive
                                    ? "text-[#dfbe96] translate-x-0.5 opacity-100"
                                    : "text-[#dfbe96] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5"
                                }`}
                              >
                                →
                              </span>
                            </div>

                            {/* Gold sliding light bar snug right below the title */}
                            <div className="relative mt-1 h-[2px] w-full overflow-hidden rounded-full bg-white/[0.04]">
                              {/* Subtle base track */}
                              <div
                                className={`absolute inset-0 bg-[#dfbe9635] transition-opacity duration-300 ${
                                  isSubActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                                }`}
                              />
                              {/* Gold sliding light beam */}
                              <div
                                className={`absolute top-0 bottom-0 w-2/3 bg-gradient-to-r from-transparent via-[#ffdca8] via-[#dfbe96] to-transparent drop-shadow-[0_0_8px_#dfbe96] shadow-[0_0_12px_#dfbe96] ${
                                  isSubActive
                                    ? "opacity-100 animate-gold-light-sweep"
                                    : "opacity-0 group-hover:opacity-100 group-hover:animate-gold-light-sweep"
                                }`}
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Balancing spacer replacing removed desktop CTA */}
        <div className="hidden lg:block w-[140px] pointer-events-none" />

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden flex flex-col items-center justify-center w-9 h-9 rounded-lg border border-[#dfbe9630] bg-[#120f1c60] text-[#dfbe96] cursor-pointer"
          aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
        >
          <span
            className={`w-4 h-[1.5px] bg-[#dfbe96] transition-all duration-200 ${mobileMenuOpen ? "rotate-45 translate-y-[3.5px]" : "mb-1"
              }`}
          />
          <span
            className={`w-4 h-[1.5px] bg-[#dfbe96] transition-all duration-200 ${mobileMenuOpen ? "-rotate-45 -translate-y-[2px]" : ""
              }`}
          />
        </button>
      </div>

      {/* Mobile Drawer Menu (Accessible Accordion) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0a0812fa] backdrop-blur-2xl border-b border-[#dfbe9630] px-6 py-6 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-2.5 text-xs tracking-[0.14em] uppercase">
            {MENU.map((item) => {
              if (item.href) {
                const active = isItemActive(item);
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`py-3 px-3.5 rounded-xl border transition-all ${
                      active
                        ? "border-[#dfbe9680] bg-[#dfbe9624] text-[#fff4e3] font-medium shadow-[0_0_15px_rgba(223,190,150,0.2)]"
                        : "border-transparent text-[#c2b4a3] hover:text-[#fff4e3] hover:bg-[#dfbe9614] hover:border-[#dfbe9640]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              }

              // Accordion Group for Haritalarım & Günlük Deneyim
              const isExpanded = mobileExpanded[item.id];
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileGroup(item.id)}
                    className="w-full flex items-center justify-between p-3.5 text-left text-[#f4eee5] font-medium cursor-pointer"
                  >
                    <span>{item.label}</span>
                    <span className="text-[#dfbe96] text-xs">
                      {isExpanded ? "−" : "+"}
                    </span>
                  </button>

                  {isExpanded && item.items && (
                    <div className="px-3 pb-3 flex flex-col gap-1.5 border-t border-white/[0.04] pt-2">
                      {item.items.map((sub) => {
                        const isSubActive = pathname === sub.href;
                        return (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className={`group relative flex flex-col py-2.5 px-3 rounded-xl text-[12px] transition-all overflow-hidden ${
                              isSubActive
                                ? "bg-[#dfbe9620] border border-[#dfbe9660] text-[#dfbe96] font-medium"
                                : "text-[#a99e91] hover:text-[#f4eee5] hover:bg-white/[0.04] border border-transparent"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-serif tracking-wide">{sub.label}</span>
                              <span
                                className={`text-[10px] text-[#dfbe96] transition-opacity ${
                                  isSubActive
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                                }`}
                              >
                                →
                              </span>
                            </div>

                            {/* Gold sliding light bar snug right below text */}
                            <div className="relative mt-1 h-[1.5px] w-full overflow-hidden rounded-full bg-white/[0.04]">
                              <div
                                className={`absolute inset-0 bg-[#dfbe9630] transition-opacity duration-300 ${
                                  isSubActive
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                                }`}
                              />
                              <div
                                className={`absolute top-0 bottom-0 w-2/3 bg-gradient-to-r from-transparent via-[#ffdca8] via-[#dfbe96] to-transparent drop-shadow-[0_0_8px_#dfbe96] shadow-[0_0_12px_#dfbe96] ${
                                  isSubActive
                                    ? "opacity-100 animate-gold-light-sweep"
                                    : "opacity-0 group-hover:opacity-100 group-hover:animate-gold-light-sweep"
                                }`}
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}

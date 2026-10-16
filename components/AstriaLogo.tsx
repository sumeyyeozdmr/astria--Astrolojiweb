"use client";

interface AstriaLogoProps {
  size?: "sm" | "md" | "lg";
  showIconOnly?: boolean;
  className?: string;
}

export function AstriaLogoIcon({ className = "w-5 h-5 text-[#dfbe96]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="astriaGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffe7c2" stopOpacity="1" />
          <stop offset="40%" stopColor="#dfbe96" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#9a6e35" stopOpacity="0.2" />
        </radialGradient>
      </defs>
      {/* Soft halo */}
      <circle cx="12" cy="12" r="9" fill="url(#astriaGlow)" opacity="0.25" />
      {/* 8-pointed celestial star */}
      {/* Vertical ray */}
      <path
        d="M12 2C12 7.5 10 10.5 2 12C10 13.5 12 16.5 12 22C12 16.5 14 13.5 22 12C14 10.5 12 7.5 12 2Z"
        fill="url(#astriaGlow)"
      />
      {/* Diagonal rays */}
      <path
        d="M12 5C12 8.5 10.8 10.2 5 12C10.8 13.8 12 15.5 12 19C12 15.5 13.2 13.8 19 12C13.2 10.2 12 8.5 12 5Z"
        fill="#ffe7c2"
        opacity="0.85"
      />
      {/* Center radiant diamond spark */}
      <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
    </svg>
  );
}

export default function AstriaLogo({
  size = "md",
  showIconOnly = false,
  className = "",
}: AstriaLogoProps) {
  if (showIconOnly) {
    const iconSize =
      size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-5 h-5";
    return <AstriaLogoIcon className={`${iconSize} text-[#dfbe96] ${className}`} />;
  }

  const textSize =
    size === "sm"
      ? "text-xs tracking-[0.24em]"
      : size === "lg"
      ? "text-xl sm:text-2xl tracking-[0.3em]"
      : "text-sm sm:text-base tracking-[0.28em]";

  const symbolAboveI =
    size === "sm" ? "w-2.5 h-2.5 -top-2" : size === "lg" ? "w-4 h-4 -top-3.5" : "w-3 h-3 -top-2.5";

  return (
    <div
      className={`inline-flex items-center gap-2.5 select-none font-serif ${className}`}
      aria-label="ASTRIA Logo"
    >
      {/* Standalone Star Emblem (the exact same symbol as above the 'I') */}
      <AstriaLogoIcon
        className={`${
          size === "sm" ? "w-4 h-4" : size === "lg" ? "w-7 h-7" : "w-5 h-5"
        } text-[#dfbe96] transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_0_8px_rgba(223,190,150,0.8)]`}
      />

      {/* Wordmark with symbol specifically crowning the letter 'I' */}
      <span className={`uppercase font-light text-[#f4eee5] inline-flex items-center ${textSize}`}>
        <span>ASTR</span>
        {/* The letter 'I' with our celestial star symbol perched directly above it */}
        <span className="relative inline-flex flex-col items-center mx-[1px]">
          <span
            className={`absolute ${symbolAboveI} text-[#dfbe96] animate-pulse drop-shadow-[0_0_6px_#dfbe96]`}
          >
            <AstriaLogoIcon className="w-full h-full" />
          </span>
          <span className="pt-0.5">I</span>
        </span>
        <span>A</span>
      </span>
    </div>
  );
}

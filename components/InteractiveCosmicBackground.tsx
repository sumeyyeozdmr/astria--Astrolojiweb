"use client";

import { useEffect, useRef } from "react";

interface StarParticle {
  x: number;
  y: number;
  radius: number;
  baseAlpha: number;
  alpha: number;
  vx: number;
  vy: number;
  zDepth: number;
  twinkleSpeed: number;
  twinklePhase: number;
  hue: "gold" | "champagne" | "cyan" | "white";
  isFallingSpark?: boolean;
  hasSpikes?: boolean;
}

interface GoldGlitter {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  vx: number;
  vy: number;
  sparkleType: "diamond" | "cross" | "dust";
  rotation: number;
  rotationSpeed: number;
}

interface ShootingStar {
  x: number;
  y: number;
  length: number;
  speed: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  thickness: number;
}

export default function InteractiveCosmicBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const glow = glowRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouseTargetX = width / 2;
    let mouseTargetY = height / 2;
    let mouseCurrentX = width / 2;
    let mouseCurrentY = height / 2;
    let isMouseActive = false;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initStars();
      initGlitters();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    // Substantially increased star & glitter density (Rich Starry Night Sky)
    const starCount = Math.min(Math.floor((width * height) / 5500), 220);
    const glitterCount = Math.min(Math.floor((width * height) / 4500), 160); // Gold Simler / Glitter particles
    let stars: StarParticle[] = [];
    let glitters: GoldGlitter[] = [];
    const shootingStars: ShootingStar[] = [];
    let lastShootingStarTime = performance.now();

    const hues: ("gold" | "champagne" | "cyan" | "white")[] = [
      "gold",
      "gold",
      "champagne",
      "gold",
      "champagne",
      "white",
    ];

    const initStars = () => {
      stars = [];
      for (let i = 0; i < starCount; i++) {
        const zDepth = 0.3 + Math.random() * 1.7;
        const isFallingSpark = Math.random() > 0.35; // drift downward
        const hasSpikes = Math.random() > 0.85; // Glittering stars with light spikes

        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 0.35 + Math.random() * 1.25,
          baseAlpha: 0.2 + Math.random() * 0.65,
          alpha: 0.3 + Math.random() * 0.5,
          vx: (Math.random() - 0.5) * 0.08,
          vy: isFallingSpark
            ? 0.12 + Math.random() * 0.35 * zDepth
            : (Math.random() - 0.5) * 0.05,
          zDepth,
          twinkleSpeed: 0.02 + Math.random() * 0.05,
          twinklePhase: Math.random() * Math.PI * 2,
          hue: hues[i % hues.length],
          isFallingSpark,
          hasSpikes,
        });
      }
    };

    // Initialize shimmering Golden Glitters (Altın Simler)
    const initGlitters = () => {
      glitters = [];
      const types: ("diamond" | "cross" | "dust")[] = ["diamond", "cross", "dust", "dust", "diamond"];
      for (let i = 0; i < glitterCount; i++) {
        glitters.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: 0.8 + Math.random() * 2.6,
          alpha: 0.2 + Math.random() * 0.7,
          twinkleSpeed: 0.03 + Math.random() * 0.08,
          twinklePhase: Math.random() * Math.PI * 2,
          vx: (Math.random() - 0.5) * 0.12,
          vy: 0.08 + Math.random() * 0.28, // gentle floating golden dust
          sparkleType: types[i % types.length],
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.02,
        });
      }
    };

    initStars();
    initGlitters();

    const spawnShootingStar = () => {
      const startX = Math.random() * (width * 0.8) + width * 0.1;
      const startY = Math.random() * (height * 0.4);
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
      const speed = 7 + Math.random() * 5;

      shootingStars.push({
        x: startX,
        y: startY,
        length: 70 + Math.random() * 80,
        speed,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 0.95,
        decay: 0.016 + Math.random() * 0.012,
        thickness: 1.2 + Math.random() * 1.0,
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      isMouseActive = true;
      mouseTargetX = e.clientX;
      mouseTargetY = e.clientY;

      if (glow) {
        glow.style.opacity = "0.75";
      }
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
      if (glow) glow.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    let lastTime = performance.now();

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (!prefersReducedMotion) {
        mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.06;
        mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.06;

        if (glow) {
          glow.style.transform = `translate3d(${mouseCurrentX}px, ${mouseCurrentY}px, 0)`;
        }

        // Spawn occasional shooting star every ~3.5 to 6 seconds
        if (time - lastShootingStarTime > 4000 && Math.random() > 0.6) {
          spawnShootingStar();
          lastShootingStarTime = time;
        }
      }

      ctx.clearRect(0, 0, width, height);

      // --- 1. RENDER GOLD GLITTERS (ALTIN SİMLER) ---
      for (let i = 0; i < glitters.length; i++) {
        const g = glitters[i];

        if (!prefersReducedMotion) {
          g.x += g.vx * 60 * delta;
          g.y += g.vy * 60 * delta;
          g.rotation += g.rotationSpeed;

          // Parallax for glitters
          const normX = (mouseCurrentX / width - 0.5) * 2;
          const normY = (mouseCurrentY / height - 0.5) * 2;
          const px = normX * 8;
          const py = normY * 8;

          if (g.y > height + 15) {
            g.y = -10;
            g.x = Math.random() * width;
          }
          if (g.x < -15) g.x = width + 15;
          if (g.x > width + 15) g.x = -15;

          g.twinklePhase += g.twinkleSpeed;
          // Glitter sparkle flash effect (shimmers brightly like real gold flakes)
          const flash = Math.pow(Math.sin(g.twinklePhase), 4);
          const currentAlpha = Math.max(0.08, Math.min(1, 0.25 + flash * 0.75));

          const gx = g.x + px;
          const gy = g.y + py;

          ctx.save();
          ctx.translate(gx, gy);
          ctx.rotate(g.rotation);

          if (g.sparkleType === "diamond" || g.sparkleType === "cross") {
            // Draw sparkling 4-point gold star / diamond glitter
            const arm = g.size * (1.8 + flash * 2.2);
            const w = Math.max(0.6, g.size * 0.35);

            // Gold radiant gradient
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, arm);
            grad.addColorStop(0, `rgba(255, 248, 220, ${currentAlpha})`);
            grad.addColorStop(0.35, `rgba(255, 215, 110, ${currentAlpha * 0.85})`);
            grad.addColorStop(0.7, `rgba(218, 165, 32, ${currentAlpha * 0.4})`);
            grad.addColorStop(1, "rgba(218, 165, 32, 0)");

            ctx.fillStyle = grad;

            // 4-pointed diamond star
            ctx.beginPath();
            ctx.moveTo(0, -arm);
            ctx.quadraticCurveTo(w * 0.2, -w * 0.2, arm, 0);
            ctx.quadraticCurveTo(w * 0.2, w * 0.2, 0, arm);
            ctx.quadraticCurveTo(-w * 0.2, w * 0.2, -arm, 0);
            ctx.quadraticCurveTo(-w * 0.2, -w * 0.2, 0, -arm);
            ctx.closePath();
            ctx.fill();

            // Intense white-gold core highlight
            if (flash > 0.4) {
              ctx.beginPath();
              ctx.arc(0, 0, Math.max(0.6, g.size * 0.4), 0, Math.PI * 2);
              ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.9})`;
              ctx.fill();
            }
          } else {
            // Gold Dust particle (Altın tozu sim taneciği)
            const r = g.size * (0.8 + flash * 0.5);
            const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, r * 2);
            grad.addColorStop(0, `rgba(255, 235, 150, ${currentAlpha})`);
            grad.addColorStop(0.5, `rgba(223, 190, 150, ${currentAlpha * 0.6})`);
            grad.addColorStop(1, "rgba(223, 190, 150, 0)");

            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.fillStyle = grad;
            ctx.fill();
          }

          ctx.restore();
        }
      }

      // --- 2. RENDER FALLING & TWINKLING STARS ---
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];

        if (!prefersReducedMotion) {
          s.x += s.vx * 60 * delta;
          s.y += s.vy * 60 * delta;

          // Parallax
          const normalizedMouseX = (mouseCurrentX / width - 0.5) * 2;
          const normalizedMouseY = (mouseCurrentY / height - 0.5) * 2;
          const parallaxX = normalizedMouseX * s.zDepth * 10;
          const parallaxY = normalizedMouseY * s.zDepth * 10;

          // Loop downwards smoothly
          if (s.y > height + 20) {
            s.y = -10;
            s.x = Math.random() * width;
          }
          if (s.x < -20) s.x = width + 20;
          if (s.x > width + 20) s.x = -20;
          if (s.y < -20) s.y = height + 20;

          // Mouse cursor soft starlight ripple
          if (isMouseActive) {
            const dx = mouseCurrentX - (s.x + parallaxX);
            const dy = mouseCurrentY - (s.y + parallaxY);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 110 && dist > 1) {
              const force = (110 - dist) / 110;
              s.x -= (dx / dist) * force * 1.2;
              s.y -= (dy / dist) * force * 1.2;
            }
          }

          s.twinklePhase += s.twinkleSpeed;
          s.alpha = s.baseAlpha + Math.sin(s.twinklePhase) * (s.baseAlpha * 0.55);

          const renderX = s.x + parallaxX;
          const renderY = s.y + parallaxY;

          let r = 255,
            g = 250,
            b = 240;
          if (s.hue === "gold") {
            r = 255;
            g = 220;
            b = 135;
          } else if (s.hue === "champagne") {
            r = 235;
            g = 205;
            b = 165;
          } else if (s.hue === "cyan") {
            r = 200;
            g = 230;
            b = 255;
          }

          const currentAlpha = Math.max(0.12, Math.min(1, s.alpha));

          // Draw main star dot
          ctx.beginPath();
          ctx.arc(renderX, renderY, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha})`;
          ctx.fill();

          // Soft halo aura
          if (s.radius > 0.85 && currentAlpha > 0.4) {
            ctx.beginPath();
            ctx.arc(renderX, renderY, s.radius * 2.6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.22})`;
            ctx.fill();
          }

          // Glitter diffraction 4-point spikes on prominent stars
          if (s.hasSpikes && currentAlpha > 0.55) {
            const spikeLen = s.radius * 4.5;
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${currentAlpha * 0.35})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            // Horizontal spike
            ctx.moveTo(renderX - spikeLen, renderY);
            ctx.lineTo(renderX + spikeLen, renderY);
            // Vertical spike
            ctx.moveTo(renderX, renderY - spikeLen);
            ctx.lineTo(renderX, renderY + spikeLen);
            ctx.stroke();
          }
        } else {
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 225, 150, ${s.baseAlpha})`;
          ctx.fill();
        }
      }

      // Render Shooting Stars (Meteors streaking across the starry sky)
      if (!prefersReducedMotion) {
        for (let i = shootingStars.length - 1; i >= 0; i--) {
          const m = shootingStars[i];
          m.x += m.vx;
          m.y += m.vy;
          m.alpha -= m.decay;

          if (m.alpha <= 0 || m.x > width + 100 || m.y > height + 100) {
            shootingStars.splice(i, 1);
            continue;
          }

          const tailX = m.x - (m.vx / m.speed) * m.length;
          const tailY = m.y - (m.vy / m.speed) * m.length;

          const grad = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
          grad.addColorStop(0, `rgba(255, 245, 220, ${m.alpha})`);
          grad.addColorStop(0.3, `rgba(235, 195, 140, ${m.alpha * 0.7})`);
          grad.addColorStop(1, "rgba(223, 190, 150, 0)");

          ctx.strokeStyle = grad;
          ctx.lineWidth = m.thickness;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(tailX, tailY);
          ctx.stroke();

          // Shooting star bright head
          ctx.beginPath();
          ctx.arc(m.x, m.y, m.thickness * 1.2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${m.alpha})`;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#030206]"
      aria-hidden="true"
    >
      {/* 1. Gece Mavisi ve Obsidyen Kozmik Gökyüzü Gradyanı */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#030207] via-[#060413] to-[#040209]" />

      {/* 2. Yumuşak Gece Göğü Bulutsu (Nebula) Parıltıları */}
      <div className="absolute -top-[10%] left-[15%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,rgba(30,20,70,0.5)_0%,rgba(12,8,30,0.2)_50%,transparent_75%)] blur-[120px]" />
      <div className="absolute top-[35%] -right-[15%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(60,25,95,0.35)_0%,rgba(15,10,40,0.1)_50%,transparent_75%)] blur-[100px]" />
      <div className="absolute -bottom-[10%] left-[20%] w-[65vw] h-[65vw] rounded-full bg-[radial-gradient(circle,rgba(20,15,45,0.45)_0%,transparent_70%)] blur-[120px]" />

      {/* 3. Zengin Altın Yıldız Tozu ve Işıltı Kubbesi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(240,195,125,0.18)_0%,rgba(210,160,85,0.08)_45%,transparent_70%)] blur-3xl pointer-events-none" />
      <div className="absolute top-[35%] left-[8%] w-[55vw] h-[55vw] rounded-full bg-[radial-gradient(circle,rgba(223,190,150,0.14)_0%,rgba(180,135,70,0.05)_45%,transparent_70%)] blur-[110px] pointer-events-none" />
      <div className="absolute top-[60%] right-[5%] w-[50vw] h-[45vw] rounded-full bg-[radial-gradient(circle,rgba(245,210,140,0.15)_0%,transparent_70%)] blur-[100px] pointer-events-none" />

      {/* 4. Altın Simler, Kayan Yıldızlar ve Yıldız Tarlası Tuvali (Canvas) */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* 5. Fare İmlecini Takip Eden Yumuşak Işık Halesi */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 -ml-[220px] -mt-[220px] w-[440px] h-[440px] rounded-full bg-[radial-gradient(circle,rgba(255,220,140,0.22)_0%,rgba(223,190,150,0.12)_35%,rgba(160,90,250,0.05)_55%,transparent_75%)] blur-2xl pointer-events-none opacity-0 transition-opacity duration-300 will-change-transform"
      />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HERO_ORBIT_FRAMES } from "@/lib/hero-orbit-images";

const N = HERO_ORBIT_FRAMES.length;

export function HeroOrbit() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  useEffect(() => {
    if (paused || reduceMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % N);
    }, 5000);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: y * 6 });
  }, [reduceMotion]);

  const frame = HERO_ORBIT_FRAMES[active];

  return (
    <div
      className="relative mx-auto w-full max-w-[min(100%,520px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={onMove}
    >
      <div
        className="relative aspect-[4/5] w-full sm:aspect-square"
        style={{
          transform: reduceMotion
            ? undefined
            : `perspective(900px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: "transform 0.2s ease-out",
        }}
      >
        {!reduceMotion ? (
          <div
            className={`orbit-ring absolute inset-0 z-0 hidden xl:block ${paused ? "orbit-paused" : ""}`}
            aria-hidden
          >
            {HERO_ORBIT_FRAMES.map((item, i) => (
              <div
                key={item.src}
                className="orbit-node"
                style={
                  {
                    "--orbit-i": i,
                    "--orbit-n": N,
                  } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  className={`orbit-thumb block overflow-hidden rounded-lg border transition-all ${
                    active === i
                      ? "border-vi-pink-bright shadow-[0_0_20px_rgba(255,45,149,0.45)] ring-2 ring-vi-pink/30"
                      : "border-vi-pink/20 opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`Show ${item.label}`}
                >
                  <Image
                    src={item.src}
                    alt=""
                    width={72}
                    height={48}
                    className="h-11 w-[4.25rem] object-cover"
                  />
                </button>
              </div>
            ))}
          </div>
        ) : null}

        <Link
          href={frame.href}
          className="group absolute inset-[6%] z-10 overflow-hidden rounded-2xl border border-vi-pink/40 bg-card shadow-[0_24px_80px_-20px_rgba(255,45,149,0.35)] transition-transform duration-300 hover:scale-[1.01] sm:inset-[10%] xl:inset-[11%]"
        >
          <Image
            key={frame.src}
            src={frame.src}
            alt={frame.label}
            fill
            priority
            sizes="(max-width: 768px) 88vw, 420px"
            className="object-cover transition duration-700 group-hover:scale-[1.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/25 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
            <p className="font-display text-xs tracking-widest text-vi-pink-bright/90">
              Featured still
            </p>
            <p className="hero-title mt-1 text-2xl text-foreground sm:text-[1.65rem]">
              {frame.label}
            </p>
            <p className="mt-1 text-sm font-medium text-vi-pink-bright opacity-90 transition group-hover:opacity-100">
              Open in atlas →
            </p>
          </div>
        </Link>
      </div>

      <div
        className="mt-4 flex gap-2 overflow-x-auto pb-1 snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:mt-5"
        role="tablist"
        aria-label="Edition stills"
      >
        {HERO_ORBIT_FRAMES.map((item, i) => (
          <button
            key={item.src}
            type="button"
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`snap-start shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
              active === i
                ? "border-vi-pink-bright shadow-[0_0_16px_rgba(255,45,149,0.35)]"
                : "border-border/80 opacity-80 hover:opacity-100"
            }`}
          >
            <Image
              src={item.src}
              alt=""
              width={80}
              height={52}
              className="h-[3.25rem] w-[5rem] object-cover sm:h-14 sm:w-[5.5rem]"
            />
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        {HERO_ORBIT_FRAMES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1 rounded-full transition-all ${
              active === i ? "w-5 bg-vi-pink-bright" : "w-1 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { AtlasLogo } from "@/components/brand/AtlasLogo";
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
    }, 4500);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion]);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: y * 8 });
  }, [reduceMotion]);

  const frame = HERO_ORBIT_FRAMES[active];

  return (
    <div
      className="relative mx-auto w-full max-w-[min(100%,560px)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => {
        setPaused(false);
        setTilt({ x: 0, y: 0 });
      }}
      onMouseMove={onMove}
    >
      <div
        className="relative aspect-square w-full"
        style={{
          transform: `perspective(900px) rotateX(${-tilt.y}deg) rotateY(${tilt.x}deg)`,
          transition: "transform 0.15s ease-out",
        }}
      >
        {!reduceMotion ? (
          <div
            className={`orbit-ring absolute inset-0 z-0 ${paused ? "orbit-paused" : ""}`}
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
                  className={`orbit-thumb block overflow-hidden rounded-xl border-2 transition-all ${
                    active === i
                      ? "border-vi-pink-bright shadow-[0_0_24px_rgba(255,45,149,0.5)] scale-110"
                      : "border-vi-pink/30 opacity-85 hover:opacity-100"
                  }`}
                  aria-label={`Show ${item.label}`}
                >
                  <Image
                    src={item.src}
                    alt=""
                    width={88}
                    height={56}
                    className="h-14 w-[5.5rem] object-cover"
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 snap-x" aria-hidden>
            {HERO_ORBIT_FRAMES.map((item, i) => (
              <button
                key={item.src}
                type="button"
                onClick={() => setActive(i)}
                className={`snap-start shrink-0 overflow-hidden rounded-lg border-2 ${
                  active === i ? "border-vi-pink-bright" : "border-border"
                }`}
              >
                <Image
                  src={item.src}
                  alt=""
                  width={72}
                  height={48}
                  className="h-12 w-[4.5rem] object-cover"
                />
              </button>
            ))}
          </div>
        )}

        <div className="absolute inset-[14%] z-10 overflow-hidden rounded-2xl border-2 border-vi-pink/50 bg-card shadow-[0_0_60px_-10px_rgba(255,45,149,0.45)]">
          <Image
            key={frame.src}
            src={frame.src}
            alt={frame.label}
            fill
            priority
            sizes="(max-width: 768px) 80vw, 400px"
            className="object-cover transition-opacity duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-vi-pink/10" />
          <div className="absolute left-3 top-3 rounded-lg bg-background/70 px-2 py-1 backdrop-blur-sm">
            <AtlasLogo size={36} showPin={false} />
          </div>
          <Link
            href={frame.href}
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background px-4 py-3"
          >
            <p className="font-display text-sm tracking-wide text-vi-pink-bright">
              {frame.label}
            </p>
            <p className="text-xs text-muted">Tap orbit or open →</p>
          </Link>
        </div>
      </div>

      <div className="mt-4 flex justify-center gap-1.5">
        {HERO_ORBIT_FRAMES.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              active === i ? "w-6 bg-vi-pink-bright" : "w-1.5 bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
"use client";

import Image from "next/image";
import { useRef, useCallback } from "react";

export default function HeroLogo() {
  const floatRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!tiltRef.current) return;
    const rect = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltRef.current.style.transform = `rotateX(${y * -60}deg) rotateY(${x * 60}deg) scale(1.08)`;
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!tiltRef.current || !floatRef.current) return;
    tiltRef.current.style.transition = "transform 0.08s ease-out, filter 0.3s ease";
    tiltRef.current.style.filter =
      "drop-shadow(0 30px 55px rgba(19, 41, 75, 0.6)) drop-shadow(0 0 40px rgba(255, 216, 77, 0.35))";
    floatRef.current.style.animationPlayState = "paused";
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!tiltRef.current || !floatRef.current) return;
    tiltRef.current.style.transition =
      "transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.4s ease";
    tiltRef.current.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
    tiltRef.current.style.filter = "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))";
    floatRef.current.style.animationPlayState = "running";
  }, []);

  return (
    <div className="flex items-center justify-center">
      <div ref={floatRef} className="logo-float">
        <div className="logo-perspective">
          <div
            ref={tiltRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
              willChange: "transform",
              filter: "drop-shadow(0 20px 40px rgba(0, 0, 0, 0.5))",
            }}
          >
            <div className="relative h-72 w-72 md:h-96 md:w-96">
              <Image
                src="/images/home/elhilocologo.png"
                alt="El Hilo Co"
                fill
                sizes="(max-width: 640px) 60vw, 400px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

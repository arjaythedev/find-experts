"use client";

import { useEffect, useRef } from "react";
import { EXPERTS } from "@/data/experts";

// Top experts by signup count for the carousel
const TOP_EXPERTS = EXPERTS.slice(0, 40);

// Split into four rows for bidirectional scrolling
const ROW_1 = TOP_EXPERTS.slice(0, 10);
const ROW_2 = TOP_EXPERTS.slice(10, 20);
const ROW_3 = TOP_EXPERTS.slice(20, 30);
const ROW_4 = TOP_EXPERTS.slice(30, 40);

function ExpertPill({ name, title, imgUrl }: { name: string; title: string; imgUrl: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 rounded-full border border-navy-700/60 bg-navy-900/40 backdrop-blur-sm shrink-0 max-w-[420px]">
      <img
        src={imgUrl}
        alt={name}
        className="w-12 h-12 rounded-full object-cover border border-navy-700 shrink-0"
        loading="lazy"
      />
      <div className="min-w-0">
        <p className="text-base font-medium text-white/70 truncate">{name}</p>
        <p className="text-sm text-white/40 truncate">{title}</p>
      </div>
    </div>
  );
}

function ScrollRow({
  experts,
  direction,
  speed,
}: {
  experts: typeof ROW_1;
  direction: "left" | "right";
  speed: number;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    // Duplicate content width for seamless loop
    const contentWidth = el.scrollWidth / 2;

    const animate = () => {
      if (direction === "left") {
        posRef.current -= speed;
        if (posRef.current <= -contentWidth) posRef.current += contentWidth;
      } else {
        posRef.current += speed;
        if (posRef.current >= 0) posRef.current -= contentWidth;
      }
      el.style.transform = `translateX(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    // Start right row offset
    if (direction === "right") {
      posRef.current = -contentWidth;
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [direction, speed]);

  // Double the items for seamless loop
  const doubled = [...experts, ...experts];

  return (
    <div className="overflow-hidden">
      <div ref={rowRef} className="flex gap-3 will-change-transform">
        {doubled.map((expert, i) => (
          <ExpertPill key={`${expert.name}-${i}`} name={expert.name} title={expert.title} imgUrl={expert.imgUrl} />
        ))}
      </div>
    </div>
  );
}

export function ExpertCarousel() {
  return (
    <div className="absolute inset-x-0 top-[-80px] bottom-[-120px] flex flex-col justify-center gap-4 pointer-events-none opacity-[0.65] overflow-hidden">
      <ScrollRow experts={ROW_1} direction="left" speed={0.3} />
      <ScrollRow experts={ROW_2} direction="right" speed={0.25} />
      <ScrollRow experts={ROW_3} direction="left" speed={0.28} />
      <ScrollRow experts={ROW_4} direction="right" speed={0.22} />
    </div>
  );
}

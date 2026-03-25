"use client";

import { useEffect, useRef } from "react";
import { EXPERTS } from "@/data/experts";

const TOP_EXPERTS = EXPERTS.slice(0, 20);

const COL_LEFT = TOP_EXPERTS.slice(0, 10);
const COL_RIGHT = TOP_EXPERTS.slice(10, 20);

function ExpertPill({ name, title, imgUrl }: { name: string; title: string; imgUrl: string }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-navy-700/60 bg-navy-900/40 backdrop-blur-sm shrink-0">
      <img
        src={imgUrl}
        alt={name}
        className="w-10 h-10 rounded-full object-cover border border-navy-700 shrink-0"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/70 truncate">{name}</p>
        <p className="text-xs text-white/40 line-clamp-2 leading-[1.4]">{title}</p>
      </div>
    </div>
  );
}

function ScrollColumn({
  experts,
  direction,
  speed,
}: {
  experts: typeof COL_LEFT;
  direction: "up" | "down";
  speed: number;
}) {
  const colRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const el = colRef.current;
    if (!el) return;

    const contentHeight = el.scrollHeight / 2;

    const animate = () => {
      if (direction === "up") {
        posRef.current -= speed;
        if (posRef.current <= -contentHeight) posRef.current += contentHeight;
      } else {
        posRef.current += speed;
        if (posRef.current >= 0) posRef.current -= contentHeight;
      }
      el.style.transform = `translateY(${posRef.current}px)`;
      rafRef.current = requestAnimationFrame(animate);
    };

    if (direction === "down") {
      posRef.current = -contentHeight;
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [direction, speed]);

  const doubled = [...experts, ...experts];

  return (
    <div className="overflow-hidden h-full w-full">
      <div ref={colRef} className="flex flex-col gap-3 will-change-transform">
        {doubled.map((expert, i) => (
          <ExpertPill
            key={`${expert.name}-${i}`}
            name={expert.name}
            title={expert.title}
            imgUrl={expert.imgUrl}
          />
        ))}
      </div>
    </div>
  );
}

export function ExpertCarousel() {
  return (
    <>
      {/* Left column */}
      <div className="absolute left-3 top-0 bottom-0 w-[240px] pointer-events-none opacity-[0.65] overflow-hidden hidden lg:block z-[5]">
        <ScrollColumn experts={COL_LEFT} direction="up" speed={0.3} />
      </div>
      {/* Right column */}
      <div className="absolute right-3 top-0 bottom-0 w-[240px] pointer-events-none opacity-[0.65] overflow-hidden hidden lg:block z-[5]">
        <ScrollColumn experts={COL_RIGHT} direction="down" speed={0.25} />
      </div>
    </>
  );
}

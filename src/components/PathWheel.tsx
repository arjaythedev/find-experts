"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GRAPH, W, H,
  getTopicsForInterests,
  traceActive,
  traceTeaser,
} from "@/data/graph";

interface Props {
  step: number;
  selectedFamily: string | null;
  selectedInterests: Set<string>;
  emailSubmitted: boolean;
}

export function PathWheel({ step, selectedFamily, selectedInterests, emailSubmitted }: Props) {
  const [hovered, setHovered] = useState<number | null>(null);

  const topics = useMemo(
    () => selectedFamily ? getTopicsForInterests(selectedFamily, selectedInterests) : new Set<string>(),
    [selectedFamily, selectedInterests],
  );

  const active = useMemo(
    () => traceActive(selectedFamily, selectedInterests, emailSubmitted, topics),
    [selectedFamily, selectedInterests, emailSubmitted, topics],
  );

  const showTeaser = selectedInterests.size > 0 && !emailSubmitted;
  const teaser = useMemo(
    () => showTeaser ? traceTeaser(active.nodes, topics) : { nodes: new Set<number>(), edges: new Set<number>() },
    [showTeaser, active.nodes, topics],
  );

  const hovNode = hovered !== null ? GRAPH.nodes[hovered] : null;

  // ── Classify each edge ──
  function edgeStyle(i: number) {
    if (active.edges.has(i)) return { color: "#cdff92", width: 2, opacity: 1 };
    if (teaser.edges.has(i)) return { color: "#ffffff", width: 1.4, opacity: 0.9 };
    // Dim when path is active
    if (active.nodes.size > 1) {
      if (teaser.nodes.size > 0) return { color: "rgba(200,210,240,0.25)", width: 0.4, opacity: 0.08 };
      return { color: "rgba(200,210,240,0.3)", width: 0.4, opacity: 0.2 };
    }
    return { color: "rgba(200,210,240,0.35)", width: 0.4, opacity: 0.4 };
  }

  // ── Classify each node ──
  function nodeStyle(idx: number) {
    const n = GRAPH.nodes[idx];
    const isActive = active.nodes.has(idx);
    const isTeaser = teaser.nodes.has(idx);
    const isHov = hovered === idx;
    const isCore = n.kind === "core";

    let opacity = 0.5;
    let stroke = "rgba(200,210,240,0.45)";
    let fill = "rgba(200,210,240,0.15)";
    let r = n.r;

    if (isCore) {
      opacity = 1; stroke = "#cdff92"; fill = "#101531";
    } else if (isActive) {
      opacity = 1; stroke = "#cdff92"; fill = "rgba(205,255,146,0.2)"; r = n.r * 1.4;
    } else if (isTeaser) {
      opacity = 1; stroke = "#ffffff"; fill = "rgba(255,255,255,0.2)"; r = n.r * 1.2;
    } else if (active.nodes.size > 1) {
      opacity = teaser.nodes.size > 0 ? 0.1 : 0.25;
    }

    if (isHov) {
      opacity = 1; stroke = "#cdff92"; fill = "rgba(205,255,146,0.3)"; r = n.r * 2;
    }

    return { opacity, stroke, fill, r, strokeWidth: isActive ? 2 : isHov ? 1.5 : isCore ? 1.5 : 0.5 };
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        viewBox={`-20 -10 ${W + 40} ${H + 20}`}
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <radialGradient id="cg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#cdff92" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#cdff92" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Edges ── */}
        {GRAPH.edges.map((e, i) => {
          const s = edgeStyle(i);
          return (
            <motion.line
              key={`e${i}`}
              x1={GRAPH.nodes[e.from].x} y1={GRAPH.nodes[e.from].y}
              x2={GRAPH.nodes[e.to].x}   y2={GRAPH.nodes[e.to].y}
              stroke={s.color}
              strokeWidth={s.width}
              initial={{ opacity: 0 }}
              animate={{ opacity: s.opacity }}
              transition={{ duration: 0.5 }}
              style={{ pointerEvents: "none" }}
            />
          );
        })}

        {/* Core glow */}
        <circle cx={GRAPH.nodes[0].x} cy={GRAPH.nodes[0].y} r={28} fill="url(#cg)" />

        {/* ── Nodes ── */}
        {GRAPH.nodes.map((n, idx) => {
          const s = nodeStyle(idx);
          const isActive = active.nodes.has(idx);
          return (
            <motion.g
              key={n.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: s.opacity }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              style={{ cursor: "pointer" }}
            >
              {isActive && n.kind !== "core" && (
                <circle cx={n.x} cy={n.y} r={s.r + 7} fill="rgba(205,255,146,0.05)" />
              )}
              <circle
                cx={n.x} cy={n.y} r={s.r}
                fill={s.fill} stroke={s.stroke} strokeWidth={s.strokeWidth}
              />
              {/* Hit area */}
              <circle cx={n.x} cy={n.y} r={14} fill="transparent" style={{ pointerEvents: "all" }} />
            </motion.g>
          );
        })}
      </svg>

      {/* ── Hover card ── */}
      <AnimatePresence>
        {hovNode && (
          <motion.div
            key={hovNode.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.12 }}
            className="absolute pointer-events-none w-[220px] z-[100]"
            style={{
              left: `calc(${(hovNode.x / W) * 100}% + 16px)`,
              top: `calc(${(hovNode.y / H) * 100}% - 30px)`,
            }}
          >
            <div className="rounded-xl border border-lime/20 bg-navy-900/95 backdrop-blur-md shadow-2xl shadow-black/40 overflow-hidden">
              {hovNode.kind === "expert" && hovNode.imgUrl && (
                <div className="relative w-full aspect-[3/2] overflow-hidden bg-navy-800">
                  <img src={hovNode.imgUrl} alt={hovNode.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-transparent to-transparent" />
                </div>
              )}
              <div className="p-3">
                <p className="text-sm font-medium text-lime leading-tight truncate">{hovNode.label}</p>
                {hovNode.subtitle && (
                  <p className="text-xs text-white/45 mt-1 leading-[1.4] line-clamp-2">{hovNode.subtitle}</p>
                )}
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/25">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    hovNode.kind === "expert" ? "bg-lime/50"
                    : hovNode.kind === "ll" ? "bg-brand-blue/50"
                    : hovNode.kind === "family" ? "bg-lime/40"
                    : hovNode.kind === "core" ? "bg-lime/60"
                    : "bg-white/30"
                  }`} />
                  {hovNode.kind === "core" ? "Start"
                    : hovNode.kind === "family" ? "Job Family"
                    : hovNode.kind === "interest" ? "Interest"
                    : hovNode.kind === "expert" ? "Maven Expert"
                    : "Lightning Lesson"}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

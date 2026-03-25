/**
 * Directed graph built from real data relationships.
 *
 * Layers:
 *   0  YOU (center)
 *   1  Job Families (8)
 *   2  Interests (6-8 per family, ~64 total)
 *   3  Experts + Lightning Lessons (outermost, connected via topic overlap)
 *
 * Every edge represents a real relationship:
 *   YOU → Family
 *   Family → Interest
 *   Interest → Expert/LL (if they share a topic)
 */

import { JOB_FAMILIES, INTERESTS_BY_ROLE } from "./job-families";
import { EXPERTS } from "./experts";
import { LIGHTNING_LESSONS } from "./lightning-lessons";

// ── Types ──────────────────────────────────────────────────────────────────

export type NodeKind = "core" | "family" | "interest" | "expert" | "ll";

export interface GraphNode {
  id: string;
  x: number;
  y: number;
  r: number;
  kind: NodeKind;
  label: string;
  subtitle: string;
  imgUrl: string;
  famId: string;          // which family this belongs to (empty for core)
  interestId: string;     // which interest this belongs to (only for interest nodes)
  topics: string[];       // topics this node covers
}

export interface GraphEdge {
  from: number;
  to: number;
}

// ── Layout constants ───────────────────────────────────────────────────────

const W = 1400;
const H = 420;
const CX = W / 2;
const CY = H / 2;

// Radii for each layer
const R_FAMILY = 75;
const R_INTEREST = 165;
const R_OUTER = 250;      // experts / LLs base radius

export { W, H, CX, CY };

// ── Seeded random ──────────────────────────────────────────────────────────

function seed(n: number) {
  const x = Math.sin(n * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

// ── Build graph ────────────────────────────────────────────────────────────

function buildGraph() {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Helper: add node, return its index
  const add = (n: Omit<GraphNode, "x" | "y"> & { x: number; y: number }) => {
    const idx = nodes.length;
    nodes.push(n as GraphNode);
    return idx;
  };

  // ── Layer 0: Core ──
  add({
    id: "core",
    x: CX,
    y: CY,
    r: 8,
    kind: "core",
    label: "YOU",
    subtitle: "Your starting point",
    imgUrl: "",
    famId: "",
    interestId: "",
    topics: [],
  });

  // ── Layer 1: Job Families ──
  const famIdx: Record<string, number> = {};
  JOB_FAMILIES.forEach((fam, i) => {
    const angle = (i / JOB_FAMILIES.length) * Math.PI * 2 - Math.PI / 2;
    const jx = (seed(i * 31) - 0.5) * 20;
    const jy = (seed(i * 47) - 0.5) * 12;
    const idx = add({
      id: `fam-${fam.id}`,
      x: CX + Math.cos(angle) * R_FAMILY + jx,
      y: CY + Math.sin(angle) * R_FAMILY + jy,
      r: 6,
      kind: "family",
      label: fam.label,
      subtitle: "Job Family",
      imgUrl: "",
      famId: fam.id,
      interestId: "",
      topics: [],
    });
    famIdx[fam.id] = idx;
    edges.push({ from: 0, to: idx });
  });

  // ── Layer 2: Interests ──
  const intIdx: Record<string, number> = {}; // "famId:interestId" → node index
  JOB_FAMILIES.forEach((fam, fi) => {
    const parentIdx = famIdx[fam.id];
    const parentNode = nodes[parentIdx];
    const interests = INTERESTS_BY_ROLE[fam.id] ?? [];
    const famAngle = Math.atan2(parentNode.y - CY, parentNode.x - CX);

    interests.forEach((int, ii) => {
      const spread = 1.2;
      const angle = famAngle + (ii - (interests.length - 1) / 2) * (spread / Math.max(interests.length - 1, 1));
      const jx = (seed(fi * 100 + ii * 17) - 0.5) * 30;
      const jy = (seed(fi * 100 + ii * 23) - 0.5) * 18;

      const key = `${fam.id}:${int.id}`;
      const idx = add({
        id: `int-${key}`,
        x: CX + Math.cos(angle) * R_INTEREST + jx,
        y: CY + Math.sin(angle) * R_INTEREST + jy,
        r: 4,
        kind: "interest",
        label: int.label,
        subtitle: `Interest · ${fam.label}`,
        imgUrl: "",
        famId: fam.id,
        interestId: int.id,
        topics: int.topics,
      });
      intIdx[key] = idx;
      edges.push({ from: parentIdx, to: idx });
    });
  });

  // ── Layer 3: Experts ──
  // For each expert, connect to every interest whose topics overlap
  const expertIdx: Record<string, number> = {}; // expert name → first node index
  EXPERTS.slice(0, 50).forEach((expert, ei) => {
    // Find all interest nodes this expert connects to
    const parentInterests: number[] = [];
    Object.entries(intIdx).forEach(([key, idx]) => {
      const intNode = nodes[idx];
      if (intNode.topics.some((t) => expert.topics.includes(t))) {
        parentInterests.push(idx);
      }
    });

    if (parentInterests.length === 0) return;

    // Position: average of parent positions, pushed outward + jitter
    let avgX = 0, avgY = 0;
    parentInterests.forEach((pi) => { avgX += nodes[pi].x; avgY += nodes[pi].y; });
    avgX /= parentInterests.length;
    avgY /= parentInterests.length;

    const angleFromCenter = Math.atan2(avgY - CY, avgX - CX);
    const jitter = (seed(ei * 73) - 0.5) * 0.6;
    const distJitter = seed(ei * 91) * 40;
    const x = CX + Math.cos(angleFromCenter + jitter) * (R_OUTER + distJitter) + (seed(ei * 53) - 0.5) * 40;
    const y = CY + Math.sin(angleFromCenter + jitter) * (R_OUTER + distJitter) + (seed(ei * 67) - 0.5) * 25;

    const idx = add({
      id: `expert-${ei}`,
      x,
      y,
      r: 2.5 + seed(ei * 37) * 1.5,
      kind: "expert",
      label: expert.name,
      subtitle: expert.title,
      imgUrl: expert.imgUrl,
      famId: "",
      interestId: "",
      topics: expert.topics,
    });

    expertIdx[expert.name] = idx;

    // Connect to parent interests (max 4 to avoid clutter)
    const connParents = parentInterests.slice(0, 4);
    connParents.forEach((pi) => {
      edges.push({ from: pi, to: idx });
    });
  });

  // ── Layer 3b: Lightning Lessons ──
  LIGHTNING_LESSONS.forEach((ll, li) => {
    // Find parent interests
    const parentInterests: number[] = [];
    Object.entries(intIdx).forEach(([key, idx]) => {
      const intNode = nodes[idx];
      if (intNode.topics.some((t) => ll.topics.includes(t))) {
        parentInterests.push(idx);
      }
    });

    if (parentInterests.length === 0) return;

    // If the instructor is an expert node, connect via them instead
    const instructorNodeIdx = expertIdx[ll.instructor];

    let avgX = 0, avgY = 0;
    if (instructorNodeIdx !== undefined) {
      avgX = nodes[instructorNodeIdx].x;
      avgY = nodes[instructorNodeIdx].y;
    } else {
      parentInterests.forEach((pi) => { avgX += nodes[pi].x; avgY += nodes[pi].y; });
      avgX /= parentInterests.length;
      avgY /= parentInterests.length;
    }

    const angleFromCenter = Math.atan2(avgY - CY, avgX - CX);
    const jitter = (seed(li * 97 + 500) - 0.5) * 0.5;
    const distJitter = seed(li * 83 + 500) * 35;
    const baseR = instructorNodeIdx !== undefined ? R_OUTER + 30 : R_OUTER;
    const x = CX + Math.cos(angleFromCenter + jitter) * (baseR + distJitter) + (seed(li * 61 + 500) - 0.5) * 35;
    const y = CY + Math.sin(angleFromCenter + jitter) * (baseR + distJitter) + (seed(li * 79 + 500) - 0.5) * 20;

    const idx = add({
      id: `ll-${li}`,
      x,
      y,
      r: 1.5 + seed(li * 41 + 500) * 1,
      kind: "ll",
      label: ll.title,
      subtitle: `by ${ll.instructor}`,
      imgUrl: "",
      famId: "",
      interestId: "",
      topics: ll.topics,
    });

    // Connect to instructor expert node if exists, otherwise to interest
    if (instructorNodeIdx !== undefined) {
      edges.push({ from: instructorNodeIdx, to: idx });
    } else {
      const connParents = parentInterests.slice(0, 2);
      connParents.forEach((pi) => {
        edges.push({ from: pi, to: idx });
      });
    }
  });

  // ── Soft clamp: allow nodes to go slightly past edges but not far ──
  nodes.forEach((n, i) => {
    if (n.kind === "core") return; // core stays centered
    const minX = -30;
    const maxX = W + 30;
    const minY = -20;
    const maxY = H + 20;
    // If out of bounds, nudge back with some randomness so they don't stack
    if (n.x < minX) n.x = minX + seed(i * 11) * 30;
    if (n.x > maxX) n.x = maxX - seed(i * 13) * 30;
    if (n.y < minY) n.y = minY + seed(i * 17) * 20;
    if (n.y > maxY) n.y = maxY - seed(i * 19) * 20;
  });

  return { nodes, edges };
}

export const GRAPH = buildGraph();

// ── Path tracing helpers ─────────────────────────────────────────────────

/** Get all topics from a set of interest IDs under a family */
export function getTopicsForInterests(famId: string, interestIds: Set<string>): Set<string> {
  const topics = new Set<string>();
  const interests = INTERESTS_BY_ROLE[famId] ?? [];
  for (const int of interests) {
    if (interestIds.has(int.id)) {
      int.topics.forEach((t) => topics.add(t));
    }
  }
  return topics;
}

/** Trace the active (lime) path through the graph */
export function traceActive(
  famId: string | null,
  interestIds: Set<string>,
  unlocked: boolean,
  topics: Set<string>,
): { nodes: Set<number>; edges: Set<number> } {
  const activeN = new Set<number>();
  const activeE = new Set<number>();
  if (!famId) return { nodes: activeN, edges: activeE };

  // Core
  activeN.add(0);

  // Family node
  const famNodeIdx = GRAPH.nodes.findIndex((n) => n.kind === "family" && n.famId === famId);
  if (famNodeIdx === -1) return { nodes: activeN, edges: activeE };
  activeN.add(famNodeIdx);

  // Edge core → family
  GRAPH.edges.forEach((e, i) => {
    if (e.from === 0 && e.to === famNodeIdx) activeE.add(i);
  });

  // Interest nodes
  if (interestIds.size > 0) {
    GRAPH.nodes.forEach((n, idx) => {
      if (n.kind === "interest" && n.famId === famId && interestIds.has(n.interestId)) {
        activeN.add(idx);
        // Edge family → interest
        GRAPH.edges.forEach((e, i) => {
          if (e.from === famNodeIdx && e.to === idx) activeE.add(i);
        });
      }
    });
  }

  // If unlocked, light up all expert/LL nodes reachable from active interests
  if (unlocked && topics.size > 0) {
    GRAPH.nodes.forEach((n, idx) => {
      if ((n.kind === "expert" || n.kind === "ll") && n.topics.some((t) => topics.has(t))) {
        activeN.add(idx);
      }
    });
    // Edges connecting active nodes
    GRAPH.edges.forEach((e, i) => {
      if (activeN.has(e.from) && activeN.has(e.to)) activeE.add(i);
    });
  }

  return { nodes: activeN, edges: activeE };
}

/** Trace teaser (white) paths: expert/LL nodes directly reachable from active nodes */
export function traceTeaser(
  activeNodes: Set<number>,
  topics: Set<string>,
): { nodes: Set<number>; edges: Set<number> } {
  const teaserE = new Set<number>();
  const teaserN = new Set<number>();
  if (topics.size === 0) return { nodes: teaserN, edges: teaserE };

  // Candidate nodes: expert/LL matching topics
  const candidates = new Set<number>();
  GRAPH.nodes.forEach((n, idx) => {
    if ((n.kind === "expert" || n.kind === "ll") && n.topics.some((t) => topics.has(t))) {
      candidates.add(idx);
    }
  });

  // Only mark edges that directly bridge an active node to a candidate node.
  // Only mark the candidate node as teaser if it has such a bridge edge.
  GRAPH.edges.forEach((e, i) => {
    const fromActive = activeNodes.has(e.from);
    const toActive = activeNodes.has(e.to);
    const fromCandidate = candidates.has(e.from);
    const toCandidate = candidates.has(e.to);

    // Bridge: one end is active (lime), other end is a candidate
    if (fromActive && toCandidate) {
      teaserE.add(i);
      teaserN.add(e.to);
    } else if (toActive && fromCandidate) {
      teaserE.add(i);
      teaserN.add(e.from);
    }
  });

  return { nodes: teaserN, edges: teaserE };
}

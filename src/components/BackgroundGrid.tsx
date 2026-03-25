"use client";

const S = 160;
const STROKE = "rgba(51, 58, 90, 0.8)";
const SW = 1;

type Tile = "e" | "d1" | "d2" | "atl" | "atr" | "abl" | "abr" | "c";

function TileSVG({ type }: { type: Tile }) {
  const common = {
    stroke: STROKE,
    strokeWidth: SW,
    fill: "none",
    vectorEffect: "non-scaling-stroke" as const,
  };

  let shape = null;
  switch (type) {
    case "d1":
      shape = <line x1="0" y1="0" x2={S} y2={S} {...common} />;
      break;
    case "d2":
      shape = <line x1={S} y1="0" x2="0" y2={S} {...common} />;
      break;
    case "atl":
      shape = <path d={`M ${S} 0 A ${S} ${S} 0 0 1 0 ${S}`} {...common} />;
      break;
    case "atr":
      shape = <path d={`M 0 0 A ${S} ${S} 0 0 0 ${S} ${S}`} {...common} />;
      break;
    case "abl":
      shape = (
        <path
          d={`M 0 0 A ${S} ${S} 0 0 0 ${S} ${S}`}
          transform={`rotate(90 ${S / 2} ${S / 2})`}
          {...common}
        />
      );
      break;
    case "abr":
      shape = <path d={`M 0 ${S} A ${S} ${S} 0 0 0 ${S} 0`} {...common} />;
      break;
    case "c":
      shape = <circle cx={S / 2} cy={S / 2} r={S / 2 - 2} {...common} />;
      break;
  }

  return (
    <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} className="block">
      {shape}
    </svg>
  );
}

const ROW: Tile[][] = [
  ["atl", "atr", "e", "d1", "e", "e", "e", "d1", "e", "abr"],
  ["e", "e", "e", "e", "e", "e", "e", "d2", "e", "e"],
  ["e", "d2", "e", "e", "atr", "atl", "e", "e", "c", "e"],
  ["e", "e", "e", "e", "e", "e", "e", "e", "e", "d2"],
  ["abl", "e", "e", "e", "e", "d1", "e", "abr", "abl", "e"],
  ["e", "e", "e", "e", "e", "e", "e", "e", "e", "d2"],
];

function GridLines({ cols, rows }: { cols: number; rows: number }) {
  const w = cols * S;
  const h = rows * S;
  const lines = [];

  for (let i = 0; i <= cols; i++) {
    lines.push(
      <line key={`v${i}`} x1={i * S} y1={0} x2={i * S} y2={h} stroke={STROKE} strokeWidth={SW} />
    );
  }
  for (let j = 0; j <= rows; j++) {
    lines.push(
      <line key={`h${j}`} x1={0} y1={j * S} x2={w} y2={j * S} stroke={STROKE} strokeWidth={SW} />
    );
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="absolute inset-0">
      {lines}
    </svg>
  );
}

export function BackgroundGrid() {
  const baseCols = ROW[0].length;
  const baseRows = ROW.length;
  const cols = Math.ceil(3840 / S);
  const rows = Math.ceil(2160 / S);

  const tiles: Tile[] = [];
  for (let r = 0; r < rows; r++) {
    const srcRow = ROW[r % baseRows];
    for (let c = 0; c < cols; c++) {
      tiles.push(srcRow[c % baseCols]);
    }
  }

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none opacity-70 z-0"
      aria-hidden="true"
    >
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ width: cols * S, height: rows * S }}
      >
        <GridLines cols={cols} rows={rows} />
        <div
          className="absolute inset-0"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cols}, ${S}px)`,
            gridTemplateRows: `repeat(${rows}, ${S}px)`,
          }}
        >
          {tiles.map((tile, i) => (
            <TileSVG key={i} type={tile} />
          ))}
        </div>
      </div>
    </div>
  );
}

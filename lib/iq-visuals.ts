// SVG Visual Pattern Renderer for IQ Test
// Cell encoding: <shape><fill><color>[_rotation]
// shape: c=circle s=square t=triangle d=diamond x=cross h=hexagon p=pentagon a=star m=moon r=ring u=up n=down l=left i=right +=plus -=minus
// fill: n=none s=solid h=half-left v=half-bottom d=diagonal c=checkers
// color: 1=indigo 2=red 3=emerald 4=amber
// rotation: degrees appended after _

const COLORS = ['#4F46E5', '#DC2626', '#059669', '#D97706'];
const CELL = 80, MARGIN = 12;

function shapeSVG(type: string, cx: number, cy: number, r: number): string {
  const h = r * 0.866, r2 = r * 0.5;
  switch (type) {
    case 'c': return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
    case 's': return `<rect x="${cx - r}" y="${cy - r}" width="${2 * r}" height="${2 * r}" rx="${r * 0.12}"/>`;
    case 't': return `<polygon points="${cx},${cy - r} ${cx - h},${cy + r2} ${cx + h},${cy + r2}"/>`;
    case 'd': return `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}"/>`;
    case 'x': return `<path d="M${cx - r2},${cy - r} L${cx + r2},${cy - r} L${cx + r2},${cy - r2} L${cx + r},${cy - r2} L${cx + r},${cy + r2} L${cx + r2},${cy + r2} L${cx + r2},${cy + r} L${cx - r2},${cy + r} L${cx - r2},${cy + r2} L${cx - r},${cy + r2} L${cx - r},${cy - r2} L${cx - r2},${cy - r2} Z"/>`;
    case 'h': return `<polygon points="${cx},${cy - r} ${cx + r * 0.866},${cy - r2} ${cx + r * 0.866},${cy + r2} ${cx},${cy + r} ${cx - r * 0.866},${cy + r2} ${cx - r * 0.866},${cy - r2}"/>`;
    case 'p': return `<polygon points="${cx},${cy - r} ${cx + r * 0.951},${cy - r * 0.309} ${cx + r * 0.588},${cy + r * 0.809} ${cx - r * 0.588},${cy + r * 0.809} ${cx - r * 0.951},${cy - r * 0.309}"/>`;
    case 'a': const p: string[] = []; for (let i = 0; i < 10; i++) { const ang = Math.PI * 2 * i / 10 - Math.PI / 2; const rad = i % 2 === 0 ? r : r * 0.45; p.push(`${(cx + rad * Math.cos(ang)).toFixed(1)},${(cy + rad * Math.sin(ang)).toFixed(1)}`); } return `<polygon points="${p.join(' ')}"/>`;
    case 'm': return `<path d="M${cx + r * 0.6},${cy - r} A${r} ${r} 0 1 1 ${cx + r * 0.6},${cy + r} A${r * 0.55} ${r * 0.55} 0 1 0 ${cx + r * 0.6},${cy - r}"/>`;
    case 'r': return `<circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="none" stroke-width="${r * 0.2}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.35}" fill="none" stroke-width="${r * 0.2}"/>`;
    case 'u': return `<polygon points="${cx},${cy - r} ${cx + r},${cy + r * 0.6} ${cx - r},${cy + r * 0.6}"/>`;
    case 'n': return `<polygon points="${cx},${cy + r} ${cx + r},${cy - r * 0.6} ${cx - r},${cy - r * 0.6}"/>`;
    case 'l': return `<polygon points="${cx - r},${cy} ${cx + r * 0.6},${cy - r} ${cx + r * 0.6},${cy + r}"/>`;
    case 'i': return `<polygon points="${cx + r},${cy} ${cx - r * 0.6},${cy - r} ${cx - r * 0.6},${cy + r}"/>`;
    case '+': return `<path d="M${cx - r * 0.3},${cy - r} L${cx + r * 0.3},${cy - r} L${cx + r * 0.3},${cy - r * 0.3} L${cx + r},${cy - r * 0.3} L${cx + r},${cy + r * 0.3} L${cx + r * 0.3},${cy + r * 0.3} L${cx + r * 0.3},${cy + r} L${cx - r * 0.3},${cy + r} L${cx - r * 0.3},${cy + r * 0.3} L${cx - r},${cy + r * 0.3} L${cx - r},${cy - r * 0.3} L${cx - r * 0.3},${cy - r * 0.3} Z"/>`;
    case '-': return `<rect x="${cx - r}" y="${cy - r * 0.28}" width="${2 * r}" height="${r * 0.56}" rx="${r * 0.12}"/>`;
    default: return `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
  }
}

function fillDefs(): string {
  return `<defs>
    <pattern id="hd" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="6" stroke="currentColor" stroke-width="2" opacity="0.3"/>
    </pattern>
    <pattern id="ck" width="8" height="8" patternUnits="userSpaceOnUse">
      <rect width="4" height="4" fill="currentColor" opacity="0.25"/>
      <rect x="4" y="4" width="4" height="4" fill="currentColor" opacity="0.25"/>
    </pattern>
  </defs>`;
}

function decodeCell(encoded: string): { shape: string; fill: string; color: number; rotation: number } | null {
  if (!encoded) return null;
  const shape = encoded[0]; let fill = 'n', color = 1, rotation = 0;
  if (encoded.length >= 2) fill = encoded[1];
  if (encoded.length >= 3) color = parseInt(encoded[2]) || 1;
  const usIdx = encoded.indexOf('_');
  if (usIdx > 0) rotation = parseInt(encoded.slice(usIdx + 1)) || 0;
  return { shape, fill, color, rotation };
}

function fillAttr(fill: string, color: string): string {
  switch (fill) {
    case 's': return `fill="${color}"`;
    case 'h': return `fill="${color}" opacity="0.25"`;
    case 'v': return `fill="${color}" opacity="0.4"`;
    case 'd': return `fill="url(#hd)" stroke="${color}"`;
    case 'c': return `fill="url(#ck)" stroke="${color}"`;
    default: return `fill="none"`;
  }
}

export function matrixSVG(grid: (string | null)[][]): string {
  const rows = grid.length, cols = grid[0].length;
  const W = cols * CELL + MARGIN * 2, H = rows * CELL + MARGIN * 2;
  let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" style="max-width:${W}px;max-height:${H}px" xmlns="http://www.w3.org/2000/svg">${fillDefs()}`;

  // Grid lines
  for (let r = 0; r <= rows; r++) {
    const y = MARGIN + r * CELL;
    svg += `<line x1="${MARGIN}" y1="${y}" x2="${MARGIN + cols * CELL}" y2="${y}" stroke="#CBD5E1" stroke-width="1.5"/>`;
  }
  for (let c = 0; c <= cols; c++) {
    const x = MARGIN + c * CELL;
    svg += `<line x1="${x}" y1="${MARGIN}" x2="${x}" y2="${MARGIN + rows * CELL}" stroke="#CBD5E1" stroke-width="1.5"/>`;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = MARGIN + c * CELL + CELL / 2;
      const cy = MARGIN + r * CELL + CELL / 2;
      const cell = grid[r][c];
      if (cell === null || cell === '?') {
        svg += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="28" font-weight="bold" fill="#94A3B8" font-family="Georgia,serif">?</text>`;
      } else {
        const dec = decodeCell(cell);
        if (dec) {
          const sc = COLORS[(dec.color - 1) % COLORS.length] || COLORS[0];
          const el = shapeSVG(dec.shape, cx, cy, CELL * 0.32);
          const fill = dec.fill === 's' ? `fill="${sc}"` : fillAttr(dec.fill, sc);
          const stroke = dec.fill === 's' ? `stroke="${sc}" stroke-width="1.5"` : `stroke="${sc}" stroke-width="2.5"`;
          const g = dec.rotation ? `<g transform="rotate(${dec.rotation}, ${cx}, ${cy})">` : '<g>';
          svg += `${g}${el.replace('/>', ` ${fill} ${stroke}/>`)}</g>`;
        }
      }
    }
  }

  svg += '</svg>';
  return svg;
}

  // Sequence SVG (horizontal shapes)
export function sequenceSVG(shapes: string[]): string {
  const n = shapes.length, W = n * CELL + MARGIN * 2, H = CELL + MARGIN * 2;
  let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" height="100%" style="max-width:${W}px;max-height:${H}px" xmlns="http://www.w3.org/2000/svg">${fillDefs()}`;

  for (let i = 0; i < n; i++) {
    const cx = MARGIN + i * CELL + CELL / 2, cy = H / 2;
    const cell = shapes[i];
    if (cell === '?') {
      svg += `<text x="${cx}" y="${cy + 6}" text-anchor="middle" font-size="28" font-weight="bold" fill="#94A3B8" font-family="Georgia,serif">?</text>`;
    } else {
      const dec = decodeCell(cell);
      if (dec) {
        const sc = COLORS[(dec.color - 1) % COLORS.length];
        const el = shapeSVG(dec.shape, cx, cy, CELL * 0.32);
        const fill = dec.fill === 's' ? `fill="${sc}"` : fillAttr(dec.fill, sc);
        const stroke = dec.fill === 's' ? `stroke="${sc}" stroke-width="1.5"` : `stroke="${sc}" stroke-width="2.5"`;
        const g = dec.rotation ? `<g transform="rotate(${dec.rotation}, ${cx}, ${cy})">` : '<g>';
        svg += `${g}${el.replace('/>', ` ${fill} ${stroke}/>`)}</g>`;
      }
    }
  }

  svg += '</svg>';
  return svg;
}

// Single cell SVG for option display
export function cellSVG(code: string): string {
  const S = 56;
  let svg = `<svg viewBox="0 0 ${S} ${S}" width="100%" height="100%" style="max-width:${S}px;max-height:${S}px" xmlns="http://www.w3.org/2000/svg">${fillDefs()}`;
  const dec = decodeCell(code);
  if (dec) {
    const cx = S / 2, cy = S / 2;
    const sc = COLORS[(dec.color - 1) % COLORS.length];
    const el = shapeSVG(dec.shape, cx, cy, S * 0.35);
    const fill = dec.fill === 's' ? `fill="${sc}"` : fillAttr(dec.fill, sc);
    const stroke = dec.fill === 's' ? `stroke="${sc}" stroke-width="1.5"` : `stroke="${sc}" stroke-width="2.5"`;
    const g = dec.rotation ? `<g transform="rotate(${dec.rotation}, ${cx}, ${cy})">` : '<g>';
    svg += `${g}${el.replace('/>', ` ${fill} ${stroke}/>`)}</g>`;
  }
  svg += '</svg>';
  return svg;
}

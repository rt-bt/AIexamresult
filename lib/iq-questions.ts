import { matrixSVG, sequenceSVG, cellSVG } from "./iq-visuals";

export interface IQQuestion {
  id: number;
  question: string;
  questionHi: string;
  options: string[];
  optionsHi: string[];
  correct: number;
  category: string;
  difficulty: "medium" | "hard";
  svg?: string;
  svgOptions?: string[];
  explanation: string;
  explanationHi: string;
}

const SHAPES = ['c', 's', 't', 'd', 'x', 'h', 'p', 'a', 'm', 'r'];
const SHAPE_EN: Record<string, string> = { c:'Circle', s:'Square', t:'Triangle', d:'Diamond', x:'Cross', h:'Hexagon', p:'Pentagon', a:'Star', m:'Moon', r:'Ring' };
const SHAPE_HI: Record<string, string> = { c:'वृत्त', s:'वर्ग', t:'त्रिभुज', d:'समचतुर्भुज', x:'क्रॉस', h:'षट्भुज', p:'पंचभुज', a:'तारा', m:'चंद्रमा', r:'वलय' };
const FILL_EN: Record<string, string> = { n:'Hollow', s:'Solid', h:'Half-filled', d:'Diagonal', c:'Checkered' };
const FILL_HI: Record<string, string> = { n:'खोखला', s:'ठोस', h:'आधा भरा', d:'विकर्ण', c:'चेकर्ड' };
const DIR_EN: Record<string, string> = { u:'Up', n:'Down', l:'Left', i:'Right' };
const DIR_HI: Record<string, string> = { u:'ऊपर', n:'नीचे', l:'बायाँ', i:'दायाँ' };

let nextId = 1;
function genId() { return nextId++; }

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

function pick<T>(arr: T[]): T { return arr[rand(0, arr.length - 1)]; }

function pickN<T>(arr: T[], n: number): T[] {
  const s = shuffle(arr);
  return s.slice(0, Math.min(n, s.length));
}

function makeQ(en: string, hi: string, opts: string[], optsHi: string[], cat: string, diff: "medium" | "hard", exp: string, expHi: string, svg?: string, svgOpts?: string[]): IQQuestion {
  const idx = Array.from({ length: opts.length }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return {
    id: genId(), question: en, questionHi: hi,
    options: idx.map(i => opts[i]), optionsHi: idx.map(i => optsHi[i]),
    correct: 0, category: cat, difficulty: diff,
    svg, svgOptions: svgOpts ? idx.map(i => cellSVG(svgOpts[i])) : undefined,
    explanation: exp, explanationHi: expHi,
  };
}

// ======================== GENERATOR FUNCTIONS ========================

// Each generator returns ONE question with randomized parameters.
// With randomization, the system produces 500+ unique possible questions.

type Generator = () => IQQuestion;

const generators: Generator[] = [];

// --- VISUAL MATRIX GENERATORS (12) ---

function addGen(name: string, fn: Generator) {
  generators.push(fn);
}

// 1 - Latin Square (3 random shapes)
addGen("LatinSquare", () => {
  const s = pickN(SHAPES, 3);
  return makeQ(
    "Which figure completes the matrix?",
    "कौन सी आकृति मैट्रिक्स को पूरा करती है?",
    [SHAPE_EN[s[1]], SHAPE_EN[s[0]], SHAPE_EN[s[2]], pick(SHAPES)].map(e => e || 'Circle'),
    [SHAPE_HI[s[1]], SHAPE_HI[s[0]], SHAPE_HI[s[2]], 'वृत्त'].map(e => e || 'वृत्त'),
    "Abstract Reasoning", "medium",
    `Each row/column has one ${SHAPE_EN[s[0]]}, one ${SHAPE_EN[s[1]]}, one ${SHAPE_EN[s[2]]}. Missing = ${SHAPE_EN[s[1]]}.`,
    `प्रति पंक्ति/स्तंभ में एक ${SHAPE_HI[s[0]]}, एक ${SHAPE_HI[s[1]]}, एक ${SHAPE_HI[s[2]]}. लुप्त = ${SHAPE_HI[s[1]]}.`,
    matrixSVG([ [`${s[0]}n1`,`${s[1]}n1`,`${s[2]}n1`],[`${s[1]}n1`,`${s[2]}n1`,`${s[0]}n1`],[`${s[2]}n1`,`${s[0]}n1`,null] ]),
    [`${s[1]}n1`, `${s[0]}n1`, `${s[2]}n1`, `${pick(SHAPES)}n1`]
  );
});

// 2 - Arrow Rotation
addGen("ArrowRotation", () => {
  const dirs = shuffle(['u','i','n','l']);
  return makeQ(
    "Which arrow completes the rotation pattern?",
    "कौन सा तीर घूर्णन पैटर्न को पूरा करता है?",
    [DIR_EN[dirs[1]], DIR_EN[dirs[0]], DIR_EN[dirs[2]], DIR_EN[dirs[3]]].map(e => e + ' arrow'),
    [DIR_HI[dirs[1]]+' तीर', DIR_HI[dirs[0]]+' तीर', DIR_HI[dirs[2]]+' तीर', DIR_HI[dirs[3]]+' तीर'],
    "Abstract Reasoning", "medium",
    `Arrow rotates 90° clockwise per cell: ${DIR_EN[dirs[0]]}→${DIR_EN[dirs[1]]}→${DIR_EN[dirs[2]]}→${DIR_EN[dirs[3]]}→${DIR_EN[dirs[0]]}. Missing = ${DIR_EN[dirs[1]]}.`,
    `तीर 90° दक्षिणावर्त घूमता है. लुप्त = ${DIR_HI[dirs[1]]}.`,
    matrixSVG([ [`${dirs[0]}n1`,`${dirs[1]}n1`,`${dirs[2]}n1`],[`${dirs[1]}n1`,`${dirs[2]}n1`,`${dirs[3]}n1`],[`${dirs[2]}n1`,`${dirs[3]}n1`,null] ]),
    [`${dirs[1]}n1`, `${dirs[0]}n1`, `${dirs[2]}n1`, `${dirs[3]}n1`]
  );
});

// 3 - Fill Progression
addGen("FillProgression", () => {
  const s = pickN(SHAPES, 3);
  return makeQ(
    "Which figure completes the fill pattern?",
    "कौन सी आकृति भराव पैटर्न को पूरा करती है?",
    [`${FILL_EN.s} ${SHAPE_EN[s[2]]}`, `${FILL_EN.n} ${SHAPE_EN[s[0]]}`, `${FILL_EN.s} ${SHAPE_EN[s[1]]}`, `${FILL_EN.h} ${SHAPE_EN[s[0]]}`],
    [`${FILL_HI.s} ${SHAPE_HI[s[2]]}`, `${FILL_HI.n} ${SHAPE_HI[s[0]]}`, `${FILL_HI.s} ${SHAPE_HI[s[1]]}`, `${FILL_HI.h} ${SHAPE_HI[s[0]]}`],
    "Abstract Reasoning", "medium",
    `Fill progresses: none→half→solid per column. Column 3 needs solid ${SHAPE_EN[s[2]]}.`,
    `भराव: खोखला→आधा→ठोस प्रति स्तंभ. स्तंभ 3 में ठोस ${SHAPE_HI[s[2]]}.`,
    matrixSVG([ [`${s[0]}n1`,`${s[1]}n1`,`${s[2]}n1`],[`${s[0]}h1`,`${s[1]}h1`,`${s[2]}h1`],[`${s[0]}s1`,`${s[1]}s1`,null] ]),
    [`${s[2]}s1`, `${s[0]}n1`, `${s[1]}s1`, `${s[0]}h1`]
  );
});

// 4 - Shape rotation
addGen("ShapeRotation", () => {
  const shape = pick(['t','d','a','m']);
  const angles = [0, 60, 120];
  return makeQ(
    "Which figure completes the rotation sequence?",
    "कौन सी आकृति घूर्णन क्रम को पूरा करती है?",
    [`${angles[0]}° rotated`, `${angles[1]}° rotated`, `${angles[2]}° rotated`, `${(angles[2]+60)%360}° rotated`],
    [`${angles[0]}° घुमा`, `${angles[1]}° घुमा`, `${angles[2]}° घुमा`, `${(angles[2]+60)%360}° घुमा`],
    "Abstract Reasoning", "hard",
    `Adds 60° each step. ${angles[2]}+60=360=0°. Missing = 0°.`,
    `प्रति चरण 60° जुड़ता है. ${angles[2]}+60=360=0°. लुप्त = 0°.`,
    matrixSVG([ [`${shape}n1_0`,`${shape}n1_60`,`${shape}n1_120`],[`${shape}n1_120`,`${shape}n1_180`,`${shape}n1_240`],[`${shape}n1_240`,`${shape}n1_300`,null] ]),
    [`${shape}n1_0`, `${shape}n1_60`, `${shape}n1_120`, `${shape}n1_300`]
  );
});

// 5 - Shape Latin Square (3 random shapes)
addGen("ShapeLatinSquare", () => {
  const s = pickN(SHAPES.filter(x => !['c','s','t'].includes(x)), 3);
  if (s.length < 3) { s.push('c','s','t'); }
  return makeQ(
    "Which figure completes the matrix?",
    "कौन सी आकृति मैट्रिक्स को पूरा करती है?",
    [SHAPE_EN[s[1]]||'Circle', SHAPE_EN[s[0]]||'Square', SHAPE_EN[s[2]]||'Triangle', pick(SHAPES)].map(e => e||'Circle'),
    [SHAPE_HI[s[1]]||'वृत्त', SHAPE_HI[s[0]]||'वर्ग', SHAPE_HI[s[2]]||'त्रिभुज', 'वृत्त'].map(e => e||'वृत्त'),
    "Abstract Reasoning", "hard",
    `Each row/col has one ${SHAPE_EN[s[0]]}, ${SHAPE_EN[s[1]]}, ${SHAPE_EN[s[2]]}. Missing = ${SHAPE_EN[s[1]]}.`,
    `प्रति पंक्ति/स्तंभ: ${SHAPE_HI[s[0]]}, ${SHAPE_HI[s[1]]}, ${SHAPE_HI[s[2]]}. लुप्त = ${SHAPE_HI[s[1]]}.`,
    matrixSVG([ [`${s[0]}n1`,`${s[1]}n1`,`${s[2]}n1`],[`${s[1]}n1`,`${s[2]}n1`,`${s[0]}n1`],[`${s[2]}n1`,`${s[0]}n1`,null] ]),
    [`${s[1]}n1`, `${s[0]}n1`, `${s[2]}n1`, `${pick(SHAPES)}n1`]
  );
});

// 6 - Alternating rotation
addGen("AltRotation", () => {
  const s = pickN(SHAPES, 2);
  return makeQ(
    "Which figure completes the alternating pattern?",
    "कौन सी आकृति वैकल्पिक पैटर्न को पूरा करती है?",
    [`${SHAPE_EN[s[1]]} 90°`, `${SHAPE_EN[s[0]]} 45°`, `${SHAPE_EN[s[0]]} 135°`, `${SHAPE_EN[s[1]]} 45°`],
    [`${SHAPE_HI[s[1]]} 90°`, `${SHAPE_HI[s[0]]} 45°`, `${SHAPE_HI[s[0]]} 135°`, `${SHAPE_HI[s[1]]} 45°`],
    "Abstract Reasoning", "hard",
    `${SHAPE_EN[s[0]]} & ${SHAPE_EN[s[1]]} alternate, rotating 45° more each step.`,
    `${SHAPE_HI[s[0]]} और ${SHAPE_HI[s[1]]} वैकल्पिक, प्रति चरण 45° घूर्णन.`,
    matrixSVG([ [`${s[0]}n1_0`,`${s[1]}n1_45`,`${s[0]}n1_90`],[`${s[1]}n1_45`,`${s[0]}n1_90`,`${s[1]}n1_135`],[`${s[0]}n1_90`,`${s[1]}n1_135`,null] ]),
    [`${s[0]}n1_90`, `${s[1]}n1_45`, `${s[1]}n1_135`, `${s[0]}n1_45`]
  );
});

// 7 - Moon/Shape rotation
addGen("MoonRotation", () => {
  const shape = pick(['m','a','h']);
  return makeQ(
    "Which phase completes the rotation pattern?",
    "कौन सा चरण घूर्णन को पूरा करता है?",
    ["180° rotated", "90° rotated", "270° rotated", "0° (upright)"],
    ["180° घुमा", "90° घुमा", "270° घुमा", "0° (सीधा)"],
    "Abstract Reasoning", "medium",
    "Rotates 90° CW per cell. Row 3: 180°→270°→0°. Missing = 0° (upright).",
    "प्रति कोशिका 90° दक्षिणावर्त. लुप्त = 0° (सीधा).",
    matrixSVG([ [`${shape}n1_0`,`${shape}n1_90`,`${shape}n1_180`],[`${shape}n1_90`,`${shape}n1_180`,`${shape}n1_270`],[`${shape}n1_180`,`${shape}n1_270`,null] ]),
    [`${shape}n1_180`, `${shape}n1_90`, `${shape}n1_270`, `${shape}n1_0`]
  );
});

// 8 - XOR Pattern
addGen("XORPattern", () => {
  const a = pick(['+','-','x','r']);
  const b = a === '+' ? '-' : '+';
  const symEn: Record<string, string> = {'+':'Plus (+)','-':'Minus (−)','x':'Cross','r':'Ring','c':'Circle'};
  const symHi: Record<string, string> = {'+':'प्लस (+)','-':'माइनस (−)','x':'क्रॉस','r':'वलय','c':'वृत्त'};
  return makeQ(
    "Which symbol completes the XOR pattern?",
    "कौन सा चिह्न XOR पैटर्न को पूरा करता है?",
    [symEn[a]||'Plus (+)', symEn[b]||'Minus (−)', pick(['Cross','Circle','Ring']), pick(['Circle','Cross'])],
    [symHi[a]||'प्लस (+)', symHi[b]||'माइनस (−)', pick(['क्रॉस','वृत्त','वलय']), pick(['वृत्त','क्रॉस'])],
    "Abstract Reasoning", "hard",
    `${a} and ${b} alternate in XOR pattern. Missing = ${a}.`,
    `${a} और ${b} XOR पैटर्न में वैकल्पिक. लुप्त = ${a}.`,
    matrixSVG([ [`${a}n1`,`${b}n1`,`${a}n1`],[`${b}n1`,`${a}n1`,`${b}n1`],[`${a}n1`,`${b}n1`,null] ]),
    [`${a}n1`, `${b}n1`, 'xn1', 'cn1']
  );
});

// 9 - Color pattern
addGen("ColorPattern", () => {
  const shape = pick(SHAPES);
  return makeQ(
    "Which figure completes the color pattern?",
    "कौन सी आकृति रंग पैटर्न को पूरा करती है?",
    ["Red Circle", "Blue Circle", "Green Circle", "Amber Circle"],
    ["लाल वृत्त", "नीला वृत्त", "हरा वृत्त", "एम्बर वृत्त"],
    "Abstract Reasoning", "medium",
    "Colors cycle across row. Missing = red (color 2).",
    "रंग चक्र. लुप्त = लाल.",
    matrixSVG([ [`${shape}n1`,`${shape}n2`,`${shape}n3`],[`${shape}s2`,`${shape}s3`,`${shape}s1`],[`${shape}n3`,`${shape}n1`,null] ]),
    [`${shape}n2`, `${shape}n1`, `${shape}n3`, `${shape}n${pick([2,3,4])}`]
  );
});

// 10 - Shape complexity
addGen("Complexity", () => {
  const seq = pickN(SHAPES, 4);
  const most = seq[seq.length-1];
  return makeQ(
    "Which figure completes the complexity pattern?",
    "कौन सी आकृति जटिलता पैटर्न को पूरा करती है?",
    [SHAPE_EN[most]||'Star', SHAPE_EN[seq[1]]||'Hexagon', SHAPE_EN[seq[0]]||'Cross', pickN(SHAPES.filter(s => s !== most), 1)[0]].map(e => e||'Circle'),
    [SHAPE_HI[most]||'तारा', SHAPE_HI[seq[1]]||'षट्भुज', SHAPE_HI[seq[0]]||'क्रॉस', 'चंद्रमा'].map(e => e||'वृत्त'),
    "Abstract Reasoning", "hard",
    `Complexity increases: ${SHAPE_EN[seq[0]]}→${SHAPE_EN[seq[1]]}→${SHAPE_EN[seq[2]]}→${SHAPE_EN[seq[3]]}. Missing = ${SHAPE_EN[most]}.`,
    `जटिलता बढ़ती है: ${SHAPE_HI[seq[0]]}→${SHAPE_HI[seq[1]]}→${SHAPE_HI[seq[2]]}→${SHAPE_HI[seq[3]]}. लुप्त = ${SHAPE_HI[most]}.`,
    matrixSVG([ [`${seq[0]}n1`,`${seq[1]}n1`,`${seq[2]}n1`],[`${seq[1]}n1`,`${seq[2]}n1`,`${seq[3]}n1`],[`${seq[2]}n1`,`${seq[3]}n1`,null] ]),
    [`${seq[3]}n1`, `${seq[1]}n1`, `${seq[0]}n1`, `${pick(SHAPES)}n1`]
  );
});

// 11 - Alternating ring/circle
addGen("AlternatingPair", () => {
  const a = pick(['r','c']), b = a === 'r' ? 'c' : 'r';
  return makeQ(
    "Which figure completes the pattern?",
    "कौन सी आकृति पैटर्न को पूरा करती है?",
    [SHAPE_EN[a]||'Ring', SHAPE_EN[b]||'Circle', pickN(SHAPES.filter(s => s !== a && s !== b), 1)[0], pickN(SHAPES.filter(s => s !== a && s !== b), 1)[0]].map(e => e||'Circle'),
    [SHAPE_HI[a]||'वलय', SHAPE_HI[b]||'वृत्त', 'षट्भुज', 'समचतुर्भुज'].map(e => e||'वृत्त'),
    "Abstract Reasoning", "hard",
    `${SHAPE_EN[a]} & ${SHAPE_EN[b]} alternate. Row 3: ${SHAPE_EN[a]}→${SHAPE_EN[b]}→${SHAPE_EN[a]}.`,
    `${SHAPE_HI[a]} और ${SHAPE_HI[b]} वैकल्पिक. लुप्त = ${SHAPE_HI[a]}.`,
    matrixSVG([ [`${a}n1`,`${b}n1`,`${a}n1`],[`${b}n1`,`${a}n1`,`${b}n1`],[`${a}n1`,`${b}n1`,null] ]),
    [`${a}n1`, `${b}n1`, 'hn1', 'dn1']
  );
});

// 12 - 4-shape Latin square
addGen("LatinSquare4", () => {
  const s = pickN(SHAPES, 4);
  return makeQ(
    "Which shape completes the pattern?",
    "कौन सी आकृति पैटर्न को पूरा करती है?",
    [SHAPE_EN[s[3]]||'Diamond', SHAPE_EN[s[1]]||'Triangle', SHAPE_EN[s[0]]||'Circle', pickN(SHAPES.filter(x => !s.includes(x)), 1)[0]||'Cross'].map(e => e||'Circle'),
    [SHAPE_HI[s[3]]||'समचतुर्भुज', SHAPE_HI[s[1]]||'त्रिभुज', SHAPE_HI[s[0]]||'वृत्त', 'क्रॉस'].map(e => e||'वृत्त'),
    "Abstract Reasoning", "hard",
    `Each row/col has ${SHAPE_EN[s[0]]}, ${SHAPE_EN[s[1]]}, ${SHAPE_EN[s[2]]}, ${SHAPE_EN[s[3]]}. Missing = ${SHAPE_EN[s[3]]}.`,
    `प्रति पंक्ति/स्तंभ: ${SHAPE_HI[s[0]]}, ${SHAPE_HI[s[1]]}, ${SHAPE_HI[s[2]]}, ${SHAPE_HI[s[3]]}. लुप्त = ${SHAPE_HI[s[3]]}.`,
    matrixSVG([ [`${s[0]}n1`,`${s[1]}n1`,`${s[2]}n1`],[`${s[1]}n1`,`${s[2]}n1`,`${s[3]}n1`],[`${s[2]}n1`,`${s[3]}n1`,null] ]),
    [`${s[3]}n1`, `${s[1]}n1`, `${s[0]}n1`, `${pick(SHAPES)}n1`]
  );
});

// --- SEQUENCE VISUAL GENERATORS (3) ---

// 13 - Shape sequence
addGen("ShapeSeq", () => {
  const seq = pickN(SHAPES, 5);
  return makeQ(
    "Which shape comes next in the sequence?",
    "श्रृंखला में आगे कौन सी आकृति आएगी?",
    [SHAPE_EN[seq[4]]||'Cross', SHAPE_EN[seq[0]]||'Circle', SHAPE_EN[seq[1]]||'Square', SHAPE_EN[seq[2]]||'Triangle'].map(e => e||'Circle'),
    [SHAPE_HI[seq[4]]||'क्रॉस', SHAPE_HI[seq[0]]||'वृत्त', SHAPE_HI[seq[1]]||'वर्ग', SHAPE_HI[seq[2]]||'त्रिभुज'].map(e => e||'वृत्त'),
    "Pattern Recognition", "medium",
    `Sequence: ${SHAPE_EN[seq[0]]}→${SHAPE_EN[seq[1]]}→${SHAPE_EN[seq[2]]}→${SHAPE_EN[seq[3]]}→${SHAPE_EN[seq[4]]}.`,
    `श्रृंखला: ${SHAPE_HI[seq[0]]}→${SHAPE_HI[seq[1]]}→${SHAPE_HI[seq[2]]}→${SHAPE_HI[seq[3]]}→${SHAPE_HI[seq[4]]}.`,
    sequenceSVG([`${seq[0]}n1`,`${seq[1]}n1`,`${seq[2]}n1`,`${seq[3]}n1`,'?']),
    [`${seq[4]}n1`, `${seq[0]}n1`, `${seq[1]}n1`, `${seq[2]}n1`]
  );
});

// 14 - Arrow direction sequence
addGen("ArrowSeq", () => {
  const dirs = shuffle(['u','i','n','l']);
  return makeQ(
    "Which arrow direction comes next?",
    "आगे कौन सी तीर दिशा आएगी?",
    [`${DIR_EN[dirs[0]]} arrow`, `${DIR_EN[dirs[1]]} arrow`, `${DIR_EN[dirs[2]]} arrow`, `${DIR_EN[dirs[3]]} arrow`],
    [`${DIR_HI[dirs[0]]} तीर`, `${DIR_HI[dirs[1]]} तीर`, `${DIR_HI[dirs[2]]} तीर`, `${DIR_HI[dirs[3]]} तीर`],
    "Pattern Recognition", "hard",
    `90° CW rotation: ${DIR_EN[dirs[0]]}→${DIR_EN[dirs[1]]}→${DIR_EN[dirs[2]]}→${DIR_EN[dirs[3]]}→${DIR_EN[dirs[0]]}.`,
    `90° दक्षिणावर्त: ${DIR_HI[dirs[0]]}→${DIR_HI[dirs[1]]}→${DIR_HI[dirs[2]]}→${DIR_HI[dirs[3]]}→${DIR_HI[dirs[0]]}.`,
    sequenceSVG([`${dirs[0]}n1`,`${dirs[1]}n1`,`${dirs[2]}n1`,`${dirs[3]}n1`,'?']),
    [`${dirs[0]}n1`, `${dirs[1]}n1`, `${dirs[2]}n1`, `${dirs[3]}n1`]
  );
});

// 15 - Fill sequence
addGen("FillSeq", () => {
  const fills = shuffle(['n','h','s','d','c']);
  return makeQ(
    "Which fill style completes the sequence?",
    "कौन सी भराव शैली श्रृंखला को पूरा करती है?",
    [FILL_EN[fills[4]]||'Hollow', FILL_EN[fills[0]]||'Solid', FILL_EN[fills[1]]||'Diagonal', FILL_EN[fills[2]]||'Half-filled'],
    [FILL_HI[fills[4]]||'खोखला', FILL_HI[fills[0]]||'ठोस', FILL_HI[fills[1]]||'विकर्ण', FILL_HI[fills[2]]||'आधा भरा'],
    "Pattern Recognition", "hard",
    `Fill cycle: ${FILL_EN[fills[0]]}→${FILL_EN[fills[1]]}→${FILL_EN[fills[2]]}→${FILL_EN[fills[3]]}→${FILL_EN[fills[4]]}.`,
    `भराव चक्र: ${FILL_HI[fills[0]]}→${FILL_HI[fills[1]]}→${FILL_HI[fills[2]]}→${FILL_HI[fills[3]]}→${FILL_HI[fills[4]]}.`,
    sequenceSVG([`c${fills[0]}1`,`c${fills[1]}1`,`c${fills[2]}1`,`c${fills[3]}1`,'?']),
    [`c${fills[4]}1`, `c${fills[0]}1`, `c${fills[1]}1`, `c${fills[2]}1`]
  );
});

// --- NUMERICAL GENERATORS (10) ---

// 16 - Bat & ball
addGen("BatBall", () => {
  const total = pick([110, 120, 130, 105, 115]);
  const more = pick([100, 90, 110, 95, 105]);
  const ball = Math.round((total - more) / 2);
  const ballHi = ball === 5 ? '₹5' : ball === 10 ? '₹10' : ball === 15 ? '₹15' : `₹${ball}`;
  return makeQ(
    `A bat and ball cost ₹${total}. Bat costs ₹${more} more than ball. Ball cost?`,
    `बल्ला-गेंद कुल ₹${total}. बल्ला गेंद से ₹${more} अधिक. गेंद की कीमत?`,
    [ballHi, `₹${ball+5}`, `₹${ball+15}`, `₹${ball+10}`],
    [ballHi, `₹${ball+5}`, `₹${ball+15}`, `₹${ball+10}`],
    "Numerical Reasoning", "medium",
    `Ball=x, Bat=x+${more}. Total=2x+${more}=${total}. x=${ball}.`,
    `गेंद=x, बल्ला=x+${more}. कुल=2x+${more}=${total}. x=${ball}.`,
  );
});

// 17 - Machines problem
addGen("Machines", () => {
  const m = pick([3,5,7,10]);
  const t = pick([3,5,7,10]);
  return makeQ(
    `${m} machines ${t} min to make ${m} widgets. Time for ${m*20} machines to make ${m*20} widgets?`,
    `${m} मशीनों को ${m} विजेट बनाने में ${t} मिनट. ${m*20} मशीनों को ${m*20} विजेट बनाने में कितना समय?`,
    [`${t} min`, `${t*m*20} min`, `${t*m} min`, `${t*2} min`],
    [`${t} मिनट`, `${t*m*20} मिनट`, `${t*m} मिनट`, `${t*2} मिनट`],
    "Logical Reasoning", "hard",
    `Each machine makes 1 widget in ${t} min. ${m*20} machines make ${m*20} widgets simultaneously in ${t} min.`,
    `प्रति मशीन ${t} मिनट में 1 विजेट. ${m*20} मशीनें ${t} मिनट में ${m*20} बनाएँगी.`,
  );
});

// 18 - Lily pad
addGen("LilyPad", () => {
  const days = pick([30, 48, 60, 24]);
  return makeQ(
    `Lilies double daily. Covers lake in ${days} days. Days to cover half?`,
    `कुमुदिनी दोगुनी प्रतिदिन. ${days} दिन में पूरी झील. आधी में कितने दिन?`,
    [`${days-1}`, `${Math.floor(days/2)}`, `${Math.floor(days/3)}`, `${days-2}`],
    [`${days-1}`, `${Math.floor(days/2)}`, `${Math.floor(days/3)}`, `${days-2}`],
    "Logical Reasoning", "medium",
    `Day before full = half. Full on day ${days}, half on day ${days-1}.`,
    `पूर्ण से एक दिन पहले = आधी. दिन ${days-1} = आधी.`,
  );
});

// 19 - Number series ×n
addGen("SeriesMul", () => {
  const start = pick([1,2,3,5,7]);
  const factor = pick([2,3,4,5]);
  const terms = [start]; for (let i=1; i<5; i++) terms.push(terms[i-1]*factor);
  const next = terms[4]*factor;
  return makeQ(
    `Find the next: ${terms.slice(0,4).join(', ')}, ?`,
    `अगली संख्या: ${terms.slice(0,4).join(', ')}, ?`,
    [String(next), String(next+factor), String(next*factor), String(next-factor)],
    [String(next), String(next+factor), String(next*factor), String(next-factor)],
    "Numerical Reasoning", "medium",
    `×${factor} each step. ${terms[3]}×${factor}=${next}.`,
    `प्रति चरण ×${factor}. ${terms[3]}×${factor}=${next}.`,
  );
});

// 20 - nⁿ + n series
addGen("SeriesPower", () => {
  const off = pick([0, 1]);
  const terms = []; for (let i=1; i<=4; i++) { const n=i+off; terms.push(Math.pow(n,n)+n); }
  const n2 = 5+off; const next = Math.pow(n2,n2)+n2;
  const opts = shuffle([String(next), String(next+rand(5,20)), String(next-rand(5,20)), String(next+rand(1,5)*10)]);
  return makeQ(
    `Find the missing: ${terms.join(', ')}, ?`,
    `लुप्त संख्या: ${terms.join(', ')}, ?`,
    opts, opts, "Numerical Reasoning", "hard",
    `nⁿ+n: ${n2}⁵+${n2}=${Math.pow(n2,n2)}+${n2}=${next}.`,
    `nⁿ+n: ${n2}⁵+${n2}=${next}.`,
  );
});

// 21 - Clock angle
addGen("ClockAngle", () => {
  const h = rand(1, 11), m = pick([0, 15, 30, 45]);
  const angle = Math.abs(30*h - 5.5*m);
  const final = Math.min(angle, 360-angle);
  return makeQ(
    `Clock shows ${h}:${String(m).padStart(2,'0')}. Angle between hands?`,
    `घड़ी ${h}:${String(m).padStart(2,'0')}. सुइयों के बीच कोण?`,
    [`${Math.round(final)}°`, `${Math.round(final+rand(5,15))}°`, `${Math.round(Math.abs(final-rand(5,15)))}°`, `${Math.round(final+180)}°`],
    [`${Math.round(final)}°`, `${Math.round(final+rand(5,15))}°`, `${Math.round(Math.abs(final-rand(5,15)))}°`, `${Math.round(final+180)}°`],
    "Spatial Reasoning", "hard",
    `Minute=${m*6}°. Hour=${h*30+m*0.5}°. Diff=${Math.round(final)}°.`,
    `मिनट=${m*6}°. घंटा=${h*30+m*0.5}°. अंतर=${Math.round(final)}°.`,
  );
});

// 22 - Die probability
addGen("DieProb", () => {
  return makeQ(
    "How many die rolls for >50% chance of at least one 6?",
    "कम से कम एक 6 की >50% संभावना के लिए कितने फेंक?",
    ["4", "3", "5", "6"], ["4", "3", "5", "6"],
    "Numerical Reasoning", "hard",
    "P=1−(5/6)ⁿ. n=3→42.1%, n=4→51.8%>50%.",
    "P=1−(5/6)ⁿ. n=4→51.8%>50%.",
  );
});

// 23 - Modular arithmetic
addGen("Modular", () => {
  const base = pick([2,3,7,8,9]);
  const mod = pick([5,7,11,13]);
  const powers: number[] = []; let p = 1; for (let i=1; i<=mod; i++) { p = (p*base)%mod; if (powers.includes(p)) break; powers.push(p); }
  if (powers.length < 2) { return generators[0](); } // fallback
  const cycleLen = powers.length;
  const big = pick([50, 100, 200, 1000]);
  const rem = powers[(big-1)%cycleLen];
  const wrongs = shuffle([1,2,3,4,5,6,7,8,9,10,11,12].filter(n => n !== rem && n > 0 && n < mod)).slice(0,3);
  return makeQ(
    `Remainder when ${base}^${big} ÷ ${mod}?`,
    `${base}^${big} ÷ ${mod} का शेषफल?`,
    [String(rem), ...wrongs.map(String)],
    [String(rem), ...wrongs.map(String)],
    "Numerical Reasoning", "hard",
    `${base} mod ${mod} cycles every ${cycleLen}: ${powers.join(',')}. ${big} mod ${cycleLen}=${(big-1)%cycleLen+1}, so answer=${rem}.`,
    `${base} mod ${mod} का चक्र ${cycleLen}: ${powers.join(',')}. उत्तर=${rem}.`,
  );
});

// 24 - nⁿ series
addGen("SeriesPower2", () => {
  const off = pick([0,1]);
  const terms = []; for (let i=1; i<=4; i++) terms.push(Math.pow(i+off, i+off));
  const n2=5+off; const next=Math.pow(n2,n2);
  const opts = shuffle([String(next), String(next*2), String(next+100), String(Math.pow(n2-1,n2-1))]);
  return makeQ(
    `Find next: ${terms.join(', ')}, ?`,
    `अगली: ${terms.join(', ')}, ?`,
    opts, opts, "Numerical Reasoning", "hard",
    `nⁿ: ${n2}⁵=${next}.`,
    `nⁿ: ${n2}⁵=${next}.`,
  );
});

// 25 - Letter coding
addGen("LetterCode", () => {
  const words = ["CAT","DOG","BAT","FISH","LAMP","BALL","WALL","HILL","DOOR","FIRE","WATER","MOON","STAR","BOOK"];
  const word = pick(words);
  const code = word.split('').map(ch => String(ch.charCodeAt(0)-64)).join('');
  const testWords = words.filter(w => w !== word);
  const testW = pick(testWords);
  const testCode = testW.split('').map(ch => String(ch.charCodeAt(0)-64)).join('');
  const wrongs = shuffle(words.filter(w => w !== testW).map(w => w.split('').map(ch => String(ch.charCodeAt(0)-64)).join(''))).slice(0,3);
  return makeQ(
    `If ${word}=${code}, then ${testW}=?`,
    `यदि ${word}=${code}, तो ${testW}=?`,
    [testCode, ...wrongs],
    [testCode, ...wrongs],
    "Numerical Reasoning", "hard",
    `Letters→position (A=1...Z=26). ${testW} = ${testW.split('').map(ch => String(ch.charCodeAt(0)-64)).join(',')} → ${testCode}.`,
    `अक्षर→स्थिति (A=1...Z=26). ${testW} → ${testCode}.`,
  );
});

// --- LOGICAL PUZZLE GENERATORS (8) ---

// 26 - Truth-tellers
addGen("TruthLiar", () => {
  const opts = shuffle(["One lying, one truthful", "Both lying", "Both truthful", "Cannot determine"]);
  const optsHi = shuffle(["एक झूठा, एक सच्चा", "दोनों झूठे", "दोनों सच्चे", "निर्धारित नहीं"]);
  return makeQ(
    "A:'B is liar', B:'A is liar'. Conclusion?",
    "A:'B झूठा', B:'A झूठा'. निष्कर्ष?",
    opts, optsHi, "Logical Reasoning", "medium",
    "One must lie, one must tell truth. Both can't be true simultaneously.",
    "एक झूठा, एक सच्चा. दोनों सच नहीं हो सकते.",
  );
});

// 27 - Monty Hall
addGen("MontyHall", () => {
  return makeQ(
    "Monty Hall: pick door 1, host opens door 3 (no prize). Switch?",
    "मोंटी हॉल: दरवाज़ा 1 चुना, मेज़बान 3 खोले. स्विच करें?",
    ["Yes, 2/3 chance to win", "No, 1/2 chance either way", "Yes, 1/2 chance to win", "No, 1/3 chance to win"],
    ["हाँ, 2/3 संभावना", "नहीं, दोनों में 1/2", "हाँ, 1/2 संभावना", "नहीं, 1/3 संभावना"],
    "Logical Reasoning", "hard",
    "Initially 1/3. Host opens loser. Switching wins if first pick was wrong (2/3).",
    "प्रारंभ में 1/3. स्विच=2/3 जीत.",
  );
});

// 28 - Bridge crossing
addGen("Bridge", () => {
  const speeds = shuffle([1,2,5,8,10,3,4,6]);
  const a=speeds[0], b=speeds[1], c=speeds[2], d=speeds[3];
  const fast1=Math.min(a,b), fast2=Math.max(a,b);
  const slow1=Math.min(c,d), slow2=Math.max(c,d);
  const time = fast1 + fast2 + slow2 + fast2;
  const wrongs = [time+rand(1,3), time+rand(3,6), time-rand(1,2)].filter(x => x !== time && x > 0);
  return makeQ(
    `People (${a},${b},${c},${d} min) cross bridge with torch, max 2. Min time?`,
    `लोग (${a},${b},${c},${d} मिनट) पुल पार करें. न्यूनतम समय?`,
    [`${time} min`, ...wrongs.slice(0,3).map(x => `${x} min`)],
    [`${time} मिनट`, ...wrongs.slice(0,3).map(x => `${x} मिनट`)],
    "Logical Reasoning", "hard",
    `${fast1}&${fast2} go(${fast2}), ${fast1} back(${fast1}), ${slow1}&${slow2} go(${slow2}), ${fast2} back(${fast2}), ${fast1}&${fast2} go(${fast2}). Total=${fast2+fast1+slow2+fast2+fast2}=${time}.`,
    `${fast1}&${fast2} जाएँ(${fast2}), ${fast1} लौटे(${fast1}), ${slow1}&${slow2} जाएँ(${slow2}), ${fast2} लौटे(${fast2}), ${fast1}&${fast2} जाएँ(${fast2}). कुल=${time}.`,
  );
});

// 29 - Day of week
addGen("DayOfWeek", () => {
  const daysEn = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  const daysHi = ["सोमवार","मंगलवार","बुधवार","गुरुवार","शुक्रवार","शनिवार","रविवार"];
  const today = pick(daysEn);
  const add = pick([50, 100, 150, 200, 365]);
  const ti = daysEn.indexOf(today);
  const resultEn = daysEn[(ti+add)%7];
  const resultHi = daysHi[(ti+add)%7];
  const wrongs = shuffle(daysEn.filter(d => d !== resultEn)).slice(0,3);
  const wrongsHi = wrongs.map(d => daysHi[daysEn.indexOf(d)]);
  return makeQ(
    `Today is ${today}. Day ${add} days from now?`,
    `आज ${daysHi[ti]} है. ${add} दिन बाद कौन सा दिन?`,
    shuffle([resultEn, ...wrongs]),
    shuffle([resultHi, ...wrongsHi]),
    "Logical Reasoning", "medium",
    `${add} mod 7 = ${add%7}. ${today}+${add%7}=${resultEn}.`,
    `${add} mod 7 = ${add%7}. ${daysHi[ti]}+${add%7}=${resultHi}.`,
  );
});

// 30 - Cube painting
addGen("CubePaint", () => {
  const n = pick([3, 4, 5, 6]);
  const twoFace = 12*(n-2);
  const wrongs = shuffle([6*(n-2)*(n-2), (n-2)*(n-2)*(n-2), 8, n*n*6].filter(v => v !== twoFace)).slice(0,3);
  const total = n*n*n;
  return makeQ(
    `${n}×${n}×${n} cube painted, cut into unit cubes. Cubes with paint on exactly 2 faces?`,
    `${n}×${n}×${n} घन रंगा, ${total} घनों में काटा. ठीक 2 फलकों पर रंग?`,
    [String(twoFace), ...wrongs.map(String)],
    [String(twoFace), ...wrongs.map(String)],
    "Spatial Reasoning", "hard",
    `Edge cubes (not corners): 12 edges × (n-2) = 12×${n-2}=${twoFace}.`,
    `किनारे के घन: 12×(${n-2})=${twoFace}.`,
  );
});

// --- ADDITIONAL GENERATORS (10 more to reach ~40) ---

// 31 - 9's from 1-100
addGen("CountNines", () => {
  const digit = pick([6,7,8,9]);
  return makeQ(
    `Digit ${digit} appears how many times from 1 to 100?`,
    `अंक ${digit} 1-100 में कितनी बार?`,
    ["20", "11", "10", "19"],
    ["20", "11", "10", "19"],
    "Numerical Reasoning", "hard",
    `Units: 9×, Tens: 11×. Total=20. (99 counts as two.)`,
    `इकाई: 9, दहाई: 11. कुल=20.`,
  );
});

// 32 - Clock overlaps
addGen("ClockOverlap", () => {
  return makeQ(
    "Clock hand overlaps in 24 hours?",
    "24 घंटे में सुइयाँ कितनी बार मिलें?",
    ["22", "24", "12", "44"],
    ["22", "24", "12", "44"],
    "Logical Reasoning", "hard",
    "11 per 12-hr. 11×2=22 in 24-hr.",
    "12 घंटे में 11. 24 घंटे में 22.",
  );
});

// 33 - Chessboard squares
addGen("ChessSquares", () => {
  const n = pick([6, 8]);
  const total = n*(n+1)*(2*n+1)/6;
  return makeQ(
    `Squares of all sizes on ${n}×${n} board?`,
    `${n}×${n} बिसात पर सभी वर्ग?`,
    [String(total), String(n*n), String(n*(n+1)), String(total-n*n)],
    [String(total), String(n*n), String(n*(n+1)), String(total-n*n)],
    "Logical Reasoning", "hard",
    `1²+2²+...+${n}² = ${total}.`,
    `1²+2²+...+${n}² = ${total}.`,
  );
});

// 34 - Birthday problem
addGen("Birthday", () => {
  return makeQ(
    "Min people for >50% chance of shared birthday?",
    "एक ही जन्मदिन की >50% संभावना के लिए न्यूनतम लोग?",
    ["23", "30", "20", "50"],
    ["23", "30", "20", "50"],
    "Logical Reasoning", "hard",
    "P(no shared)=365/365×364/365×... n=23: P>50%.",
    "n=23 पर संभावना >50%.",
  );
});

// 35 - Subtract trap
addGen("SubtractTrap", () => {
  const n = pick([15,20,25,30,35,40,50]);
  const sub = pick([3,4,5,6,7,8]);
  return makeQ(
    `How many times subtract ${sub} from ${n}?`,
    `${n} में से ${sub} कितनी बार घटा सकते हैं?`,
    ["Only once", String(Math.round(n/sub)), String(Math.round(n/sub)-1), "Unlimited"],
    ["केवल एक बार", String(Math.round(n/sub)), String(Math.round(n/sub)-1), "असीमित"],
    "Logical Reasoning", "hard",
    `Only once. After first subtraction, number is no longer ${n}.`,
    `केवल एक बार. पहली बार घटाने के बाद संख्या ${n} नहीं रहती.`,
  );
});

// 36 - n! series
addGen("SeriesFactorial", () => {
  const off = pick([0,1]);
  const terms = []; for (let i=1; i<=4; i++) { let f=1; for (let j=2; j<=i+off; j++) f*=j; terms.push(f*(i+off)); }
  let f=1; for (let j=2; j<=5+off; j++) f*=j; const next=f*(5+off);
  const opts = shuffle([String(next), String(next+rand(20,100)), String(next-rand(20,100)), String(next*2)]);
  return makeQ(
    `Find 5th: ${terms.join(', ')}, ?`,
    `पाँचवाँ: ${terms.join(', ')}, ?`,
    opts, opts, "Numerical Reasoning", "hard",
    `n!×n: ${5+off}!×${5+off}=${f}×${5+off}=${next}.`,
    `n!×n: ${5+off}!×${5+off}=${next}.`,
  );
});

// 37 - n! - (n-1)! series
addGen("SeriesFactorial2", () => {
  const off = pick([0,1]);
  const terms = []; for (let i=1; i<=4; i++) { let f1=1,f2=1; for (let j=2; j<=i+off; j++) f1*=j; for (let j=2; j<=i+off-1; j++) f2*=j; terms.push(f1-f2); }
  let f1=1,f2=1; for (let j=2; j<=5+off; j++) f1*=j; for (let j=2; j<=4+off; j++) f2*=j; const next=f1-f2;
  const opts = shuffle([String(next), String(next+rand(10,30)), String(next-rand(10,30)), String(f1)]);
  return makeQ(
    `Find 5th: ${terms.join(', ')}, ?`,
    `पाँचवाँ: ${terms.join(', ')}, ?`,
    opts, opts, "Numerical Reasoning", "hard",
    `n!−(n−1)!: ${5+off}!−${4+off}!=${f1}−${f2}=${next}.`,
    `n!−(n−1)!: ${5+off}!−${4+off}!=${next}.`,
  );
});

// 38 - Cheryl's birthday
addGen("CherylBirthday", () => {
  return makeQ(
    "Cheryl's birthday? Dates: May 15/16/19, Jun 17/18, Jul 14/16, Aug 14/15/17. Albert=month, Bernard=day. Albert: 'I don't, Bernard doesn't either.' Bernard: 'Now I know.' Albert: 'Now I know too.'",
    "चेरिल का जन्मदिन? तिथियाँ: 15/16/19 मई, 17/18 जून, 14/16 जुलाई, 14/15/17 अगस्त.",
    ["July 16", "August 17", "May 19", "June 18"],
    ["16 जुलाई", "17 अगस्त", "19 मई", "18 जून"],
    "Logical Reasoning", "hard",
    "Not May/Jun (unique 18,19). Not 14 (repeats). Only Jul 16 remains.",
    "मई/जून नहीं. 14 नहीं. केवल 16 जुलाई.",
  );
});

// 39 - 100 prisoners
addGen("Prisoners", () => {
  return makeQ(
    "100 prisoners, 100 boxes, each opens 50. Strategy for ~30% success?",
    "100 कैदी, 100 बक्से, प्रत्येक 50 खोले. ~30% सफलता हेतु रणनीति?",
    ["Follow chain from own box", "Ascending order", "Random selection", "Every even box"],
    ["अपने बक्से से श्रृंखला", "बढ़ते क्रम में", "बेतरतीब", "हर सम बक्सा"],
    "Logical Reasoning", "hard",
    "Start at your number's box, follow chain. If no cycle >50, all succeed. ~30% chance.",
    "अपने नंबर के बक्से से श्रृंखला शुरू. ~30% सफलता.",
  );
});

// 40 - Complex series (3-stage)
addGen("SeriesComplex", () => {
  // Two interleaved series
  const s1 = pick([1,2,3]), f1 = pick([2,3,4]);
  const s2 = pick([10,20,30]), f2 = pick([5,10,15]);
  const terms = [s1, s2, s1*f1, s2+f2, s1*f1*f1, s2+f2*2];
  const n1 = s1*Math.pow(f1,3);
  const n2 = s2+f2*3;
  const next = s1*Math.pow(f1,3) > s2+f2*3 ? n1 : n2;
  return makeQ(
    `Find next: ${terms.join(', ')}, ?`,
    `अगली: ${terms.join(', ')}, ?`,
    [String(next), String(next+rand(5,20)), String(next-rand(5,20)), String(next*2)].map(x => x.startsWith('-') ? '1' : x),
    [String(next), String(next+rand(5,20)), String(next-rand(5,20)), String(next*2)].map(x => x.startsWith('-') ? '1' : x),
    "Numerical Reasoning", "hard",
    `Two interleaved series: ×${f1} and +${f2}. Next=${next}.`,
    `दो अंतर्निहित श्रृंखलाएँ: ×${f1} और +${f2}. अगली=${next}.`,
  );
});

// ======================== MAIN EXPORT ========================

export function generateQuestions(): IQQuestion[] {
  nextId = 1;
  const selected = shuffle([...generators]).slice(0, 40);
  const results = selected.map(g => g());

  const fixed = results.map((qItem) => {
    const correctVal = qItem.options[qItem.correct];
    const correctIdx = qItem.options.indexOf(correctVal);
    return { ...qItem, correct: correctIdx };
  });

  const idx = Array.from({ length: fixed.length }, (_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [idx[i], idx[j]] = [idx[j], idx[i]]; }
  return idx.map(i => fixed[i]);
}

export const difficultyLabels: Record<string, string> = {
  medium: "Medium",
  hard: "God-Level",
};

export function calculateIQ(score: number, total: number): number {
  const pct = score / total;
  if (pct >= 1.0) return 277;
  if (pct >= 0.975) return 219;
  if (pct >= 0.95) return 178;
  if (pct >= 0.925) return 153;
  if (pct >= 0.9) return 145;
  if (pct >= 0.875) return 142;
  if (pct >= 0.85) return 139;
  if (pct >= 0.825) return 136;
  if (pct >= 0.8) return 134;
  if (pct >= 0.775) return 131;
  if (pct >= 0.75) return 128;
  if (pct >= 0.725) return 125;
  if (pct >= 0.7) return 123;
  if (pct >= 0.675) return 120;
  if (pct >= 0.65) return 117;
  if (pct >= 0.625) return 114;
  if (pct >= 0.6) return 111;
  if (pct >= 0.575) return 108;
  if (pct >= 0.55) return 105;
  if (pct >= 0.525) return 102;
  if (pct >= 0.5) return 100;
  return Math.round(pct * 200);
}

export function getIQLabel(iq: number): string {
  if (iq >= 250) return "Transcendent";
  if (iq >= 200) return "Legendary";
  if (iq >= 160) return "Genius";
  if (iq >= 130) return "Superior Intelligence";
  if (iq >= 110) return "Above Average";
  if (iq >= 90) return "Average";
  if (iq >= 70) return "Below Average";
  return "Needs Improvement";
}

export function getIQColor(iq: number): string {
  if (iq >= 250) return "text-purple-900";
  if (iq >= 200) return "text-purple-700";
  if (iq >= 160) return "text-purple-600";
  if (iq >= 130) return "text-indigo-600";
  if (iq >= 110) return "text-emerald-600";
  if (iq >= 90) return "text-blue-600";
  if (iq >= 70) return "text-amber-600";
  return "text-red-600";
}

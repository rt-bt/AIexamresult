"use client";

import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import * as THREE from "three";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import type { PostCard } from "@/lib/data";

export interface JobConstellationItem {
  id: string;
  title: string;
  fullTitle: string;
  org: string;
  category: string;
  status: string;
  slug: string;
  date: string;
  state?: string;
  sector: "all" | "railway" | "ssc" | "police" | "teaching" | "banking" | "upsc" | "other";
  color: string;
  hexColor: number;
}

const SECTOR_CONFIG: Record<
  string,
  { label: string; color: string; hex: number }
> = {
  all: { label: "All Sectors", color: "#00f0ff", hex: 0x00f0ff },
  railway: { label: "Railway", color: "#00f5d4", hex: 0x00f5d4 },
  ssc: { label: "SSC & Central", color: "#ffb703", hex: 0xffb703 },
  police: { label: "Police & Defence", color: "#10b981", hex: 0x10b981 },
  teaching: { label: "Teaching", color: "#c084fc", hex: 0xc084fc },
  banking: { label: "Banking & PSU", color: "#38bdf8", hex: 0x38bdf8 },
  upsc: { label: "UPSC & State PSC", color: "#fb7185", hex: 0xfb7185 },
};

// Exact jobhunt.asmcleod.com 7-stop continuous hot → cold heat ramp
const HEAT_STOPS = [
  { at: 0.00, color: new THREE.Color("#FF6A00") }, // Hot core solar orange
  { at: 0.10, color: new THREE.Color("#FF9500") }, // Amber glow
  { at: 0.22, color: new THREE.Color("#FFC870") }, // Golden ember
  { at: 0.35, color: new THREE.Color("#FFF1DC") }, // Warm white-hot
  { at: 0.52, color: new THREE.Color("#8ADFFF") }, // Bright electric cyan
  { at: 0.75, color: new THREE.Color("#65DFFF") }, // Bioluminescent aqua
  { at: 1.00, color: new THREE.Color("#2B6FA8") }, // Deep cosmic blue
];

function getHeatColor(d: number, sectorTint?: THREE.Color): THREE.Color {
  const clamped = Math.max(0, Math.min(1, d));
  let result = HEAT_STOPS[0].color.clone();
  for (let i = 1; i < HEAT_STOPS.length; i++) {
    const prev = HEAT_STOPS[i - 1];
    const curr = HEAT_STOPS[i];
    if (clamped <= curr.at) {
      const factor = (clamped - prev.at) / (curr.at - prev.at);
      result = prev.color.clone().lerp(curr.color, factor);
      break;
    }
  }
  if (sectorTint && clamped > 0.45) {
    const tintWeight = Math.min(0.35, (clamped - 0.45) * 0.7);
    result.lerp(sectorTint, tintWeight);
  }
  return result;
}

// 3D Simplex noise for organic gaseous star turbulence (exact jobhunt.asmcleod.com math)
const SNOISE_GLSL = `
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

function parseItem(item: PostCard, index: number): JobConstellationItem {
  const t = item.title;
  let org = "GOVT OF INDIA";
  let sector: JobConstellationItem["sector"] = "other";
  let status = "ACTIVE VACANCY";

  if (/rrb|railway|rrc/i.test(t)) {
    org = "RAILWAY RECRUITMENT BOARD";
    sector = "railway";
  } else if (/ssc/i.test(t)) {
    org = "STAFF SELECTION COMMISSION";
    sector = "ssc";
  } else if (/upsc/i.test(t)) {
    org = "UNION PUBLIC SERVICE COMM.";
    sector = "upsc";
  } else if (/bpsc/i.test(t)) {
    org = "BIHAR PUBLIC SERVICE COMM.";
    sector = "upsc";
  } else if (/police|army|navy|air force|afcat|coast guard|cisf|bsf|crpf|itbp|home guard/i.test(t)) {
    org = "DEFENCE & POLICE SERVICES";
    sector = "police";
  } else if (/teacher|tet|ctet|stet|tre|tgt|prt|pgt|school|headmaster|education/i.test(t)) {
    org = "TEACHER RECRUITMENT / BOARD";
    sector = "teaching";
  } else if (/bank|sbi|ibps|rbi|bob|uco|pnb|canara|insurance|nicl|lic|uiic/i.test(t)) {
    org = "BANKING & FINANCIAL PSU";
    sector = "banking";
  } else if (/isro/i.test(t)) {
    org = "ISRO SPACE RESEARCH";
    sector = "other";
  } else if (/ongc|iocl|bhel|sail|coal india/i.test(t)) {
    org = "MAHARATNA / PSU";
    sector = "other";
  } else if (item.state && item.state !== "India") {
    org = `${item.state.toUpperCase()} GOVT`;
    sector = "other";
  }

  const vacMatch = t.match(/\((\d[\d,]*\s*posts?)\)/i) || t.match(/\b(\d[\d,]*\+?\s*posts?)\b/i);
  if (vacMatch) {
    status = vacMatch[1].replace(/posts?/i, "Posts").trim();
  } else if (/revised/i.test(t)) {
    status = "REVISED RESULT";
  } else if (/result/i.test(t)) {
    status = "RESULT OUT";
  } else if (/admit card|hall ticket/i.test(t)) {
    status = "ADMIT CARD";
  } else if (/answer key/i.test(t)) {
    status = "ANSWER KEY";
  } else if (/extend/i.test(t)) {
    status = "DATE EXTENDED";
  } else if (/exam date|exam city/i.test(t)) {
    status = "EXAM DATE";
  } else {
    status = "APPLY ONLINE";
  }

  let cleanTitle = t
    .replace(/\s*Online Form\s*\d{4}.*$/i, "")
    .replace(/\s*Recruitment\s*\d{4}.*$/i, "")
    .replace(/\s*–\s*Out.*$/i, "")
    .replace(/\s*–\s*Start.*$/i, "")
    .replace(/\s*\(.*?\)/g, "")
    .trim();

  if (cleanTitle.length > 32) {
    cleanTitle = cleanTitle.substring(0, 30) + "…";
  }

  const cfg = SECTOR_CONFIG[sector] || SECTOR_CONFIG.all;

  return {
    id: item.slug || `job-${index}`,
    title: cleanTitle,
    fullTitle: t,
    org,
    category: item.category || "latestJobs",
    status,
    slug: item.slug || "latest-jobs",
    date: item.date || "Today",
    state: item.state || "India",
    sector,
    color: cfg.color,
    hexColor: cfg.hex,
  };
}

interface ProjectedLabel {
  item: JobConstellationItem;
  x: number;
  y: number;
  visible: boolean;
  opacity: number;
  scale: number;
  isHovered: boolean;
  distance: number;
}

interface TendrilEntry {
  line: THREE.Line;
  companionLines: THREE.Line[];
  curve: THREE.CatmullRomCurve3;
  tipVec: THREE.Vector3;
  tipMesh: THREE.Mesh;
  item: JobConstellationItem;
  pulseOffset: number;
  growStart: number;
  growDur: number;
  segments: number;
  currentGrowth: number;
}

interface BranchEntry {
  line: THREE.Line;
  curve: THREE.CatmullRomCurve3;
  tipMesh: THREE.Mesh;
  growStart: number;
  growDur: number;
  segments: number;
}

interface CrossLinkEntry {
  line: THREE.Line;
  nodeAIndex: number;
  nodeBIndex: number;
}

interface JobHuntConstellationProps {
  items: PostCard[];
  title?: string;
  subtitle?: string;
  className?: string;
  height?: string;
  variant?: "card" | "background";
}

export function JobHuntConstellation({
  items = [],
  title = "Live Recruitment Constellation",
  subtitle = "Bioluminescent 3D job galaxy · Synced with All India Exam Result",
  className = "",
  height = "h-[480px] sm:h-[520px]",
  variant = "card",
}: JobHuntConstellationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // States
  const [selectedSector, setSelectedSector] = useState<string>("all");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<JobConstellationItem | null>(null);
  const [projectedLabels, setProjectedLabels] = useState<ProjectedLabel[]>([]);
  const [isOrbiting, setIsOrbiting] = useState(false);

  // Parse items into constellation data (32 jobs)
  const constellationData = useMemo(() => {
    const raw = items.slice(0, 32);
    return raw.map((item, idx) => parseItem(item, idx));
  }, [items]);

  // Keep a mutable ref for animation loop
  const animStateRef = useRef({
    scene: null as THREE.Scene | null,
    camera: null as THREE.PerspectiveCamera | null,
    renderer: null as THREE.WebGLRenderer | null,
    nucleus: null as THREE.Mesh | null,
    starGlowMesh: null as THREE.Mesh | null,
    starHaloMesh: null as THREE.Mesh | null,
    starGlowMat: null as THREE.ShaderMaterial | null,
    starParticles: null as THREE.Points | null,
    tendrilEntries: [] as TendrilEntry[],
    branchEntries: [] as BranchEntry[],
    crossLinks: [] as CrossLinkEntry[],
    rotX: 0.18,
    rotY: 0,
    targetRotX: 0.18,
    targetRotY: 0,
    zoom: variant === "background" ? 9.8 : 8.4,
    targetZoom: variant === "background" ? 9.8 : 8.4,
    isPointerDown: false,
    pointerStartX: 0,
    pointerStartY: 0,
    lastPointerX: 0,
    lastPointerY: 0,
    startTime: Date.now(),
    activeHoverId: null as string | null,
    reqId: 0,
    autoRotate: true,
    sector: "all",
  });

  // Sync state changes to anim ref
  useEffect(() => {
    animStateRef.current.autoRotate = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    animStateRef.current.sector = selectedSector;
  }, [selectedSector]);

  useEffect(() => {
    animStateRef.current.activeHoverId = hoveredItem ? hoveredItem.id : null;
  }, [hoveredItem]);

  // Reset Camera & restart intro growth
  const handleResetCamera = useCallback(() => {
    animStateRef.current.targetRotX = 0.18;
    animStateRef.current.targetRotY = 0;
    animStateRef.current.targetZoom = variant === "background" ? 9.8 : 8.4;
    animStateRef.current.startTime = Date.now(); // restarts organic growth sequence!
  }, [variant]);

  // Set up Three.js scene
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const isBackground = variant === "background";

    // 1. Scene — pitch-black deep cosmos
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x010408, isBackground ? 0.028 : 0.040);
    animStateRef.current.scene = scene;

    // 2. Camera — FOV=40, optical view offset shifts center to ~72% width on desktop
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const updateCameraProjection = (w: number, h: number) => {
      camera.aspect = w / h;
      if (isBackground) {
        // Desktop (>= 1024px): shift center to ~72% screen width, leaving left 50% for search & H1
        const offsetRatio = w >= 1024 ? 0.22 : w >= 768 ? 0.14 : 0;
        if (offsetRatio > 0) {
          camera.setViewOffset(w, h, -w * offsetRatio, 0, w, h);
        } else {
          camera.clearViewOffset();
        }
      } else {
        camera.clearViewOffset();
      }
      camera.updateProjectionMatrix();
    };
    updateCameraProjection(width, height);

    const initialZoom = animStateRef.current.zoom;
    camera.position.set(0, 1.5, initialZoom);
    camera.lookAt(0, 0, 0);
    animStateRef.current.camera = camera;

    // 3. WebGL Renderer — alpha so HeroBackground shows through cleanly
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.25;
      animStateRef.current.renderer = renderer;
    } catch (e) {
      console.warn("WebGL initialization failed:", e);
      return;
    }

    // 4. Lights — bioluminescent core lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xff7700, 3.5, 20);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const cyanLight = new THREE.PointLight(0x00f5d4, 3.0, 25);
    cyanLight.position.set(3, 4, 5);
    scene.add(cyanLight);

    const cyanLight2 = new THREE.PointLight(0x00b4d8, 2.0, 18);
    cyanLight2.position.set(-3, -2, 3);
    scene.add(cyanLight2);

    // 5. Central Solar Organism — EXACT jobhunt.asmcleod.com Gaseous Star
    // Replaces wireframe icosahedron cage & square pixels with true volumetric solar gas shaders
    const nucleusGroup = new THREE.Group();
    nucleusGroup.position.set(0, 0, 0);
    scene.add(nucleusGroup);

    // 5a. Core white-hot inner sphere (anchors tendril origins)
    const nucleusGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleusGroup.add(nucleusMesh);
    animStateRef.current.nucleus = nucleusMesh;

    // 5b. Billboard Gaseous Corona with turbulent snoise flares & filaments
    const starGlowGeo = new THREE.PlaneGeometry(3.15, 3.15);
    const starGlowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        ${SNOISE_GLSL}
        uniform float uTime;
        uniform float uBreath;
        uniform float uIntensity;
        uniform vec3 uCore;
        uniform vec3 uHot;
        uniform vec3 uDeep;
        varying vec2 vUv;

        void main() {
          vec2 p = (vUv - 0.5) * 2.0;
          float r = length(p);
          float t = uTime;

          vec2 dir = p / max(r, 1e-4);
          float n = snoise(vec3(dir * 1.6, r * 3.0 - t * 0.35)) * 0.6
                  + snoise(vec3(p * 4.5, t * 0.3)) * 0.4;
          float rr = r * (1.0 + n * 0.22 * smoothstep(0.02, 0.35, r));
          float s = 1.0 + uBreath;

          float heart  = exp(-pow(rr / (0.085 * s), 2.0));
          float body   = exp(-pow(rr / (0.2 * s), 1.5));
          float corona = exp(-rr * (4.2 / s));

          float wisps = smoothstep(0.25, 0.9, snoise(vec3(dir * 3.0, t * 0.12 - r * 1.5))) * corona * 0.5;

          vec3 col = uDeep * (corona * 0.55 + wisps)
                   + uCore * body * 1.5
                   + uHot * heart * 1.9;
          col *= uIntensity;
          float edge = 1.0 - smoothstep(0.75, 1.0, r);
          gl_FragColor = vec4(col * edge, edge);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uBreath: { value: 0 },
        uIntensity: { value: 1.0 },
        uCore: { value: new THREE.Color("#FF6A00") },
        uHot: { value: new THREE.Color("#FF9500") },
        uDeep: { value: new THREE.Color("#E04A00") },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const starGlowMesh = new THREE.Mesh(starGlowGeo, starGlowMat);
    starGlowMesh.renderOrder = 5;
    nucleusGroup.add(starGlowMesh);
    animStateRef.current.starGlowMesh = starGlowMesh;
    animStateRef.current.starGlowMat = starGlowMat;

    // 5c. Outer soft radial glow halo
    const starHaloGeo = new THREE.PlaneGeometry(3.8, 3.8);
    const starHaloMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        uniform float uStrength;
        uniform float uFalloff;
        varying vec2 vUv;
        void main() {
          float r = length(vUv - 0.5) * 2.0;
          float a = exp(-r * r * uFalloff) * (1.0 - smoothstep(0.85, 1.0, r));
          gl_FragColor = vec4(uColor * uStrength, a);
        }
      `,
      uniforms: {
        uColor: { value: new THREE.Color("#FF5A00") },
        uStrength: { value: 0.22 },
        uFalloff: { value: 3.8 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const starHaloMesh = new THREE.Mesh(starHaloGeo, starHaloMat);
    starHaloMesh.renderOrder = 4;
    nucleusGroup.add(starHaloMesh);
    animStateRef.current.starHaloMesh = starHaloMesh;

    // 6. Deep stardust particle field
    const starsCount = isBackground ? 500 : 350;
    const starsGeo = new THREE.BufferGeometry();
    const starsPos = new Float32Array(starsCount * 3);
    for (let i = 0; i < starsCount; i++) {
      starsPos[i * 3] = (Math.random() - 0.5) * 55;
      starsPos[i * 3 + 1] = (Math.random() - 0.5) * 40;
      starsPos[i * 3 + 2] = (Math.random() - 0.5) * 55;
    }
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starsPos, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.04,
      transparent: true,
      opacity: 0.32,
      sizeAttenuation: true,
    });
    const starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);
    animStateRef.current.starParticles = starField;

    // 7. Dynamic Tendril & Neural Graph Network System
    const tendrilGroup = new THREE.Group();
    tendrilGroup.position.set(0, 0, 0);
    scene.add(tendrilGroup);

    const tendrilEntries: TendrilEntry[] = [];
    const branchEntries: BranchEntry[] = [];
    const crossLinks: CrossLinkEntry[] = [];
    const count = constellationData.length;
    const baseRadius = 0.38; // roots emerge right from the star core
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    const MAIN_SEGMENTS = 52;
    const allNodeTips: THREE.Vector3[] = [];

    constellationData.forEach((item, idx) => {
      // Fibonacci sphere distribution for primary rays
      const y = 1 - (idx / (count - 1 || 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = 2 * Math.PI * idx / phi;

      const dirX = Math.cos(theta) * radiusAtY;
      const dirY = y;
      const dirZ = Math.sin(theta) * radiusAtY;
      const normDir = new THREE.Vector3(dirX, dirY, dirZ).normalize();

      const p0 = normDir.clone().multiplyScalar(baseRadius);
      const strandLen = 4.8 + (idx % 6) * 0.42 + (idx % 2 === 0 ? 0.3 : -0.2);

      // Organic curvature with 3D harmonic variation
      const curveVariation = 0.75;
      const p1 = normDir.clone().multiplyScalar(strandLen * 0.32).add(
        new THREE.Vector3(
          Math.sin(idx * 1.6 + 0.5) * curveVariation,
          Math.cos(idx * 2.2 + 0.3) * curveVariation * 0.8,
          Math.sin(idx * 3.1 + 0.9) * curveVariation
        )
      );
      const p2 = normDir.clone().multiplyScalar(strandLen * 0.68).add(
        new THREE.Vector3(
          Math.cos(idx * 1.8 + 1.2) * (curveVariation * 0.9),
          Math.sin(idx * 2.4 + 1.5) * (curveVariation * 0.6),
          Math.cos(idx * 3.0 + 2.1) * (curveVariation * 0.9)
        )
      );
      const tipVec = normDir.clone().multiplyScalar(strandLen);
      allNodeTips.push(tipVec);

      const curve = new THREE.CatmullRomCurve3([p0, p1, p2, tipVec]);
      const samplePoints = curve.getPoints(MAIN_SEGMENTS);

      // 7-stop continuous heat ramp along the strand
      const colors = new Float32Array(samplePoints.length * 3);
      const sectorCol = new THREE.Color(item.hexColor);
      for (let s = 0; s < samplePoints.length; s++) {
        const u = s / (samplePoints.length - 1);
        const col = getHeatColor(u, sectorCol);
        colors[s * 3] = col.r;
        colors[s * 3 + 1] = col.g;
        colors[s * 3 + 2] = col.b;
      }

      const curveGeo = new THREE.BufferGeometry().setFromPoints(samplePoints);
      curveGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      curveGeo.setDrawRange(0, 0); // starts hidden for organic intro growth!

      const curveMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(curveGeo, curveMat);
      tendrilGroup.add(line);

      // 4 Fiber-Optic Companion Hair Strands per tendril (like jobhunt.asmcleod.com)
      const companionLines: THREE.Line[] = [];
      const hairOffsets = [
        [-0.14, -0.08],
        [0.14, -0.08],
        [-0.08, 0.14],
        [0.08, 0.14],
      ];

      hairOffsets.forEach(([ox, oy]) => {
        const subTip = tipVec.clone().add(
          new THREE.Vector3(
            Math.sin(idx + ox * 3) * 0.35,
            oy * 0.45,
            Math.cos(idx + oy * 3) * 0.35
          )
        );
        const subCurve = new THREE.CatmullRomCurve3([
          p0,
          p1.clone().multiplyScalar(0.97).add(new THREE.Vector3(ox * 0.08, oy * 0.08, 0)),
          p2.clone().add(new THREE.Vector3(ox * 0.22, oy * 0.22, ox * 0.1)),
          subTip,
        ]);
        const subPoints = subCurve.getPoints(28);
        const subColors = new Float32Array(subPoints.length * 3);
        for (let s = 0; s < subPoints.length; s++) {
          const u = s / (subPoints.length - 1);
          const col = getHeatColor(u, sectorCol);
          subColors[s * 3] = col.r;
          subColors[s * 3 + 1] = col.g;
          subColors[s * 3 + 2] = col.b;
        }
        const subGeo = new THREE.BufferGeometry().setFromPoints(subPoints);
        subGeo.setAttribute("color", new THREE.BufferAttribute(subColors, 3));
        subGeo.setDrawRange(0, 0);

        const subMat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.28,
          blending: THREE.AdditiveBlending,
        });
        const subLine = new THREE.Line(subGeo, subMat);
        tendrilGroup.add(subLine);
        companionLines.push(subLine);
      });

      // Tip Node glowing orb
      const tipGeo = new THREE.SphereGeometry(0.08, 16, 16);
      const tipMat = new THREE.MeshBasicMaterial({
        color: item.hexColor,
        transparent: true,
        opacity: 0, // starts hidden until strand completes growth!
      });
      const tipMesh = new THREE.Mesh(tipGeo, tipMat);
      tipMesh.position.copy(tipVec);
      tendrilGroup.add(tipMesh);

      // Intro growth parameters (staggered organic ignition)
      const growStart = 0.2 + ((idx * 0.12) % 2.8);
      const growDur = 1.5 + (idx % 4) * 0.22;

      tendrilEntries.push({
        line,
        companionLines,
        curve,
        tipVec,
        tipMesh,
        item,
        pulseOffset: Math.random(),
        growStart,
        growDur,
        segments: MAIN_SEGMENTS,
        currentGrowth: 0,
      });

      // Secondary Branch Tendril (for ~18 primary tendrils, like jobhunt axons)
      if (idx % 2 === 0) {
        const branchStartPoint = curve.getPoint(0.50);
        const branchDir = normDir
          .clone()
          .applyAxisAngle(new THREE.Vector3(0, 1, 0), 0.65)
          .normalize();
        const branchTip = branchStartPoint
          .clone()
          .add(branchDir.multiplyScalar(strandLen * 0.42));
        allNodeTips.push(branchTip);

        const branchCurve = new THREE.CatmullRomCurve3([
          branchStartPoint,
          branchStartPoint.clone().lerp(branchTip, 0.5).add(new THREE.Vector3(0, 0.25, 0.2)),
          branchTip,
        ]);
        const branchPoints = branchCurve.getPoints(24);
        const branchColors = new Float32Array(branchPoints.length * 3);
        for (let s = 0; s < branchPoints.length; s++) {
          const u = 0.5 + 0.5 * (s / (branchPoints.length - 1));
          const col = getHeatColor(u, sectorCol);
          branchColors[s * 3] = col.r;
          branchColors[s * 3 + 1] = col.g;
          branchColors[s * 3 + 2] = col.b;
        }
        const branchGeo = new THREE.BufferGeometry().setFromPoints(branchPoints);
        branchGeo.setAttribute("color", new THREE.BufferAttribute(branchColors, 3));
        branchGeo.setDrawRange(0, 0);

        const branchMat = new THREE.LineBasicMaterial({
          vertexColors: true,
          transparent: true,
          opacity: 0.55,
          blending: THREE.AdditiveBlending,
        });
        const branchLine = new THREE.Line(branchGeo, branchMat);
        tendrilGroup.add(branchLine);

        const branchTipGeo = new THREE.SphereGeometry(0.045, 12, 12);
        const branchTipMat = new THREE.MeshBasicMaterial({
          color: 0x8adfff,
          transparent: true,
          opacity: 0,
        });
        const branchTipMesh = new THREE.Mesh(branchTipGeo, branchTipMat);
        branchTipMesh.position.copy(branchTip);
        tendrilGroup.add(branchTipMesh);

        branchEntries.push({
          line: branchLine,
          curve: branchCurve,
          tipMesh: branchTipMesh,
          growStart: growStart + growDur * 0.48, // emerges once parent reaches 50%
          growDur: growDur * 0.65,
          segments: 24,
        });
      }
    });

    // 8. Interconnected Constellation Cross-Links (Neural Web Mesh)
    for (let i = 0; i < allNodeTips.length; i++) {
      for (let j = i + 1; j < allNodeTips.length; j++) {
        const dist = allNodeTips[i].distanceTo(allNodeTips[j]);
        if (dist > 1.2 && dist < 2.8) {
          const crossGeo = new THREE.BufferGeometry().setFromPoints([
            allNodeTips[i],
            allNodeTips[j],
          ]);
          const crossMat = new THREE.LineBasicMaterial({
            color: 0x65dfff,
            transparent: true,
            opacity: 0, // starts invisible, fades in as nodes mature
            blending: THREE.AdditiveBlending,
          });
          const crossLine = new THREE.Line(crossGeo, crossMat);
          tendrilGroup.add(crossLine);
          crossLinks.push({
            line: crossLine,
            nodeAIndex: i,
            nodeBIndex: j,
          });
        }
      }
    }

    animStateRef.current.tendrilEntries = tendrilEntries;
    animStateRef.current.branchEntries = branchEntries;
    animStateRef.current.crossLinks = crossLinks;

    // 9. Resize Handler with Optical View Offset
    const handleResize = () => {
      if (!containerRef.current || !animStateRef.current.renderer || !animStateRef.current.camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      updateCameraProjection(w, h);
      animStateRef.current.renderer.setSize(w, h);
    };

    window.addEventListener("resize", handleResize);

    // 10. Animation & Render Loop
    let frameCount = 0;

    const animate = () => {
      const state = animStateRef.current;
      const elapsedTime = (Date.now() - state.startTime) * 0.001;

      // Smooth camera position damping / orbit
      if (state.autoRotate && !state.isPointerDown) {
        state.targetRotY += 0.0010; // cosmic spin
      }

      state.rotX += (state.targetRotX - state.rotX) * 0.08;
      state.rotY += (state.targetRotY - state.rotY) * 0.08;
      state.zoom += (state.targetZoom - state.zoom) * 0.08;

      const camX = Math.sin(state.rotY) * Math.cos(state.rotX) * state.zoom;
      const camY = Math.sin(state.rotX) * state.zoom;
      const camZ = Math.cos(state.rotY) * Math.cos(state.rotX) * state.zoom;

      camera.position.set(camX, camY, camZ);
      camera.lookAt(0, 0, 0);

      // BILLBOARDS: Keep solar star corona facing camera at all angles
      if (starGlowMesh && starHaloMesh) {
        starGlowMesh.quaternion.copy(camera.quaternion);
        starHaloMesh.quaternion.copy(camera.quaternion);
      }

      // Animate solar gas turbulence and breathing glow
      if (starGlowMat) {
        starGlowMat.uniforms.uTime.value = elapsedTime;
        starGlowMat.uniforms.uBreath.value = Math.sin(elapsedTime * 1.8) * 0.08;
      }

      // Pulsate central white-hot nucleus core
      if (nucleusMesh) {
        const pulseScale = 1 + Math.sin(elapsedTime * 2.2) * 0.04;
        nucleusMesh.scale.set(pulseScale, pulseScale, pulseScale);
      }

      // ORGANIC INTRO GROWTH SIMULATION:
      const activeSector = state.sector;
      const activeHoverId = state.activeHoverId;

      tendrilEntries.forEach((tEntry) => {
        let growth = 0;
        if (elapsedTime > tEntry.growStart) {
          const k = Math.min(1, (elapsedTime - tEntry.growStart) / tEntry.growDur);
          growth = 1 - Math.pow(1 - k, 1.6);
        }
        tEntry.currentGrowth = growth;

        // Dynamic draw range extends the line along the curve
        const drawCount = Math.round(growth * (tEntry.segments + 1));
        tEntry.line.geometry.setDrawRange(0, drawCount);

        // Companion hairs follow
        tEntry.companionLines.forEach((cLine) => {
          cLine.geometry.setDrawRange(0, Math.round(growth * 29));
        });

        // Tip node lights up on arrival (growth >= 0.94)
        const tipArrival = Math.max(0, (growth - 0.94) / 0.06);
        const matchesSec = activeSector === "all" || tEntry.item.sector === activeSector;
        const isHovered = activeHoverId === tEntry.item.id;

        const tipMat = tEntry.tipMesh.material as THREE.MeshBasicMaterial;
        tipMat.opacity = tipArrival * (isHovered ? 1.0 : matchesSec ? 0.9 : 0.2);

        // Strand highlight / sector filtering
        const lineMat = tEntry.line.material as THREE.LineBasicMaterial;
        if (isHovered) {
          lineMat.opacity = 1.0;
          tEntry.companionLines.forEach((l) => ((l.material as THREE.LineBasicMaterial).opacity = 0.7));
        } else if (matchesSec) {
          lineMat.opacity = activeSector === "all" ? 0.82 : 0.95;
          tEntry.companionLines.forEach((l) => ((l.material as THREE.LineBasicMaterial).opacity = 0.28));
        } else {
          lineMat.opacity = 0.15;
          tEntry.companionLines.forEach((l) => ((l.material as THREE.LineBasicMaterial).opacity = 0.05));
        }
      });

      // Branch tendril growth
      branchEntries.forEach((bEntry) => {
        let bGrowth = 0;
        if (elapsedTime > bEntry.growStart) {
          const k = Math.min(1, (elapsedTime - bEntry.growStart) / bEntry.growDur);
          bGrowth = 1 - Math.pow(1 - k, 1.6);
        }
        bEntry.line.geometry.setDrawRange(0, Math.round(bGrowth * (bEntry.segments + 1)));
        const tipArrival = Math.max(0, (bGrowth - 0.94) / 0.06);
        (bEntry.tipMesh.material as THREE.MeshBasicMaterial).opacity = tipArrival * 0.7;
      });

      // Constellation Cross-Links fade in as interconnected network matures
      const crossFadeProgress = Math.max(0, Math.min(1, (elapsedTime - 2.5) / 2.0));
      if (crossFadeProgress > 0) {
        crossLinks.forEach((cLink) => {
          (cLink.line.material as THREE.LineBasicMaterial).opacity = crossFadeProgress * 0.18;
        });
      }

      // 11. Project 3D tips to 2D HTML labels every 2 frames for performance
      frameCount++;
      if (frameCount % 2 === 0 && containerRef.current) {
        const w = containerRef.current.clientWidth;
        const h = containerRef.current.clientHeight;
        const halfW = w / 2;
        const halfH = h / 2;

        const newLabels: ProjectedLabel[] = [];

        tendrilEntries.forEach((tEntry) => {
          if (tEntry.currentGrowth < 0.90) return;

          const matchesSec = activeSector === "all" || tEntry.item.sector === activeSector;
          if (!matchesSec) return;

          const tipWorld = tEntry.tipVec.clone();
          const distToCam = tipWorld.distanceTo(camera.position);

          // Project to NDC (-1 to +1) — camera.setViewOffset accounts for offset automatically!
          tipWorld.project(camera);

          if (tipWorld.z < 1) {
            const screenX = tipWorld.x * halfW + halfW;
            const screenY = -(tipWorld.y * halfH) + halfH;

            if (screenX >= 15 && screenX <= w - 15 && screenY >= 15 && screenY <= h - 15) {
              const isHovered = activeHoverId === tEntry.item.id;

              // In background mode: block labels in left 46% so H1 heading and search bar stay clean
              if (isBackground && !isHovered && screenX < w * 0.46) {
                return;
              }

              // Depth fade + growth fade-in
              const growthFade = Math.min(1, (tEntry.currentGrowth - 0.90) / 0.10);
              let depthOpacity = Math.max(0, 1 - (distToCam - 4.0) / 9.0) * growthFade;
              if (isHovered) depthOpacity = 1;

              newLabels.push({
                item: tEntry.item,
                x: screenX,
                y: screenY,
                visible: depthOpacity > 0.12 || isHovered,
                opacity: depthOpacity,
                scale: isHovered ? 1.08 : 1,
                isHovered,
                distance: distToCam,
              });
            }
          }
        });

        // Sort by distance — closest on top
        newLabels.sort((a, b) => a.distance - b.distance);

        // Cap labels for clean presentation
        setProjectedLabels(newLabels.slice(0, 14));
      }

      renderer.render(scene, camera);
      state.reqId = requestAnimationFrame(animate);
    };

    animStateRef.current.reqId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animStateRef.current.reqId);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
    };
  }, [constellationData, variant]);

  // Pointer Interaction Handlers for 3D Orbit & Drag
  const handlePointerDown = (e: React.PointerEvent) => {
    animStateRef.current.isPointerDown = true;
    animStateRef.current.pointerStartX = e.clientX;
    animStateRef.current.pointerStartY = e.clientY;
    animStateRef.current.lastPointerX = e.clientX;
    animStateRef.current.lastPointerY = e.clientY;
    setIsOrbiting(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!animStateRef.current.isPointerDown) return;
    const deltaX = e.clientX - animStateRef.current.lastPointerX;
    const deltaY = e.clientY - animStateRef.current.lastPointerY;

    animStateRef.current.lastPointerX = e.clientX;
    animStateRef.current.lastPointerY = e.clientY;

    animStateRef.current.targetRotY += deltaX * 0.005;
    animStateRef.current.targetRotX = Math.max(
      -Math.PI * 0.42,
      Math.min(Math.PI * 0.42, animStateRef.current.targetRotX + deltaY * 0.005)
    );
  };

  const handlePointerUp = () => {
    animStateRef.current.isPointerDown = false;
    setIsOrbiting(false);
  };

  // Zoom wheel handler
  const handleWheel = (e: React.WheelEvent) => {
    const isBackground = variant === "background";
    if (isBackground) return; // don't hijack page scroll in background mode

    e.preventDefault();
    const zoomDelta = e.deltaY * 0.005;
    animStateRef.current.targetZoom = Math.max(
      5.5,
      Math.min(14, animStateRef.current.targetZoom + zoomDelta)
    );
  };

  return (
    <div
      ref={containerRef}
      className={
        variant === "background"
          ? `absolute inset-0 w-full h-full overflow-hidden select-none z-0 ${
              isFullscreen ? "fixed inset-0 z-50 h-screen bg-[#020610]" : ""
            } ${className}`
          : `relative w-full rounded-2xl border border-white/15 bg-[#020610] overflow-hidden select-none shadow-[0_12px_48px_rgba(0,0,0,0.6)] ${
              isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : height
            } ${className}`
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      style={{ touchAction: "none" }}
    >
      {/* 1. Canvas element for WebGL 3D rendering */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Layered overlays for Background Mode — matches jobhunt.asmcleod.com edge darkening */}
      {variant === "background" && (
        <>
          {/* Left-side gradient: ensures text stays 100% readable over 3D scene */}
          <div
            className="absolute inset-0 pointer-events-none z-[1]"
            style={{
              background: "linear-gradient(to right, rgba(7,19,34,0.92) 0%, rgba(7,19,34,0.72) 30%, rgba(7,19,34,0.2) 52%, rgba(7,19,34,0.0) 65%)"
            }}
            aria-hidden="true"
          />
          {/* Top fade */}
          <div
            className="absolute top-0 left-0 right-0 h-24 pointer-events-none z-[1]"
            style={{ background: "linear-gradient(to bottom, rgba(7,19,34,0.75) 0%, transparent 100%)" }}
            aria-hidden="true"
          />
          {/* Bottom fade */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-[1]"
            style={{ background: "linear-gradient(to top, rgba(7,19,34,0.95) 0%, transparent 100%)" }}
            aria-hidden="true"
          />
        </>
      )}

      {/* 2. Top Controls Bar */}
      <div className={`absolute top-3 right-3 z-20 flex items-center justify-between gap-2 pointer-events-none ${
        variant === "background" ? "left-auto" : "left-3"
      }`}>
        {variant !== "background" && (
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md px-3.5 py-1.5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] sm:text-xs font-bold tracking-wider uppercase text-emerald-300 font-mono">
              LIVE JOB CONSTELLATION
            </span>
            <span className="hidden sm:inline text-white/30">|</span>
            <span className="hidden sm:inline text-[11px] text-white/60 font-mono">
              {constellationData.length} Tendrils
            </span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Play/Pause Rotation */}
          <button
            type="button"
            onClick={() => setAutoRotate((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-md transition hover:border-[#00f0ff] hover:text-[#00f0ff]"
            title={autoRotate ? "Pause Orbit" : "Play Orbit"}
            aria-label={autoRotate ? "Pause Orbit" : "Play Orbit"}
          >
            {autoRotate ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>

          {/* Reset View & Restart Growth Sequence */}
          <button
            type="button"
            onClick={handleResetCamera}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-md transition hover:border-[#00f0ff] hover:text-[#00f0ff]"
            title="Reset 3D Camera & Replay Intro"
            aria-label="Reset 3D Camera & Replay Intro"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>

          {/* Fullscreen Expand */}
          <button
            type="button"
            onClick={() => setIsFullscreen((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-black/60 text-white/70 backdrop-blur-md transition hover:border-[#00f0ff] hover:text-[#00f0ff]"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Galaxy Mode"}
            aria-label={isFullscreen ? "Exit Fullscreen" : "Fullscreen Galaxy Mode"}
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* 3. Floating 3D-Projected HTML Labels (Exact match to jobhunt.asmcleod.com .tlabel) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
        {projectedLabels.map((lbl) => {
          if (!lbl.visible) return null;
          const isSelected = hoveredItem?.id === lbl.item.id;

          return (
            <div
              key={lbl.item.id}
              className="absolute pointer-events-auto transition-transform duration-75 ease-out"
              style={{
                transform: `translate3d(${lbl.x}px, ${lbl.y}px, 0px) translate(-50%, -50%) scale(${lbl.scale})`,
                opacity: lbl.opacity,
                zIndex: isSelected ? 30 : 15,
              }}
              onMouseEnter={() => setHoveredItem(lbl.item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              <Link
                href={`/post/${lbl.item.slug}`}
                className={`group flex items-center gap-2 rounded-xl px-2.5 py-1.5 backdrop-blur-md transition-all duration-200 border ${
                  isSelected
                    ? "bg-[#061226]/95 border-[#00f0ff] shadow-[0_0_24px_rgba(0,240,255,0.4)] scale-105"
                    : "bg-[#040a16]/80 border-white/10 hover:border-white/30 hover:bg-[#061226]/90 shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
                }`}
              >
                {/* Glowing Node Dot */}
                <span
                  className="h-2 w-2 rounded-full shrink-0 animate-pulse"
                  style={{ backgroundColor: lbl.item.color, boxShadow: `0 0 8px ${lbl.item.color}` }}
                />

                <div className="flex flex-col text-left">
                  {/* Org / Commission */}
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/50 font-mono">
                    {lbl.item.org}
                  </span>

                  {/* Clean Job Title */}
                  <span className="text-[11px] sm:text-xs font-bold text-white tracking-tight group-hover:text-[#00f0ff] transition-colors line-clamp-1 max-w-[200px]">
                    {lbl.item.title}
                  </span>

                  {/* Status / Vacancy Tag */}
                  <span
                    className="text-[9px] font-semibold tracking-wider uppercase mt-0.5"
                    style={{ color: lbl.item.color }}
                  >
                    {lbl.item.status}
                  </span>
                </div>

                <ChevronRight className="h-3 w-3 text-white/30 group-hover:text-white group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          );
        })}
      </div>

      {/* 4. Bottom Controls: Sector Category Filtering Pills */}
      <div className={`absolute z-20 pointer-events-none ${
        variant === "background"
          ? "bottom-14 sm:bottom-16 left-4 right-4 flex flex-col items-center justify-center gap-2"
          : "bottom-3 left-3 right-3 flex flex-col sm:flex-row items-center justify-between gap-2"
      }`}>
        {/* Sector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-hide pointer-events-auto bg-black/40 backdrop-blur-md p-1 px-2.5 rounded-full border border-white/10 shadow-lg">
          <span className="hidden sm:inline text-[10px] uppercase font-mono text-white/50 px-1 font-semibold">
            Sector:
          </span>
          {Object.entries(SECTOR_CONFIG).map(([secKey, sec]) => {
            const isSelected = selectedSector === secKey;
            return (
              <button
                key={secKey}
                type="button"
                onClick={() => setSelectedSector(secKey)}
                className={`whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] sm:text-[11px] font-semibold transition backdrop-blur-md border ${
                  isSelected
                    ? "bg-white text-slate-950 border-white shadow-sm font-bold scale-[1.02]"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/15 hover:text-white"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>

        {variant !== "background" && (
          <div className="hidden lg:flex items-center gap-2 text-[10px] text-white/40 font-mono tracking-wider uppercase bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5 pointer-events-auto">
            <span>{isOrbiting ? "Orbiting Galaxy..." : "Drag to Orbit · Tap Strand to View"}</span>
          </div>
        )}
      </div>

      {/* 5. Active Hover Card Snapshot (Desktop Drawer) */}
      {hoveredItem && (
        <div className="absolute bottom-14 left-4 z-30 max-w-xs rounded-2xl border border-[#00f0ff]/40 bg-[#061226]/95 backdrop-blur-xl p-3.5 shadow-[0_0_32px_rgba(0,240,255,0.25)] pointer-events-auto transition-all animate-in fade-in zoom-in-95">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#00f0ff] font-mono">
              {hoveredItem.org}
            </span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-bold text-white">
              {hoveredItem.status}
            </span>
          </div>

          <p className="text-xs font-bold text-white leading-snug mb-2">
            {hoveredItem.fullTitle}
          </p>

          <div className="flex items-center justify-between text-[10px] text-white/50 pt-2 border-t border-white/10">
            <span>Posted: {hoveredItem.date}</span>
            <Link
              href={`/post/${hoveredItem.slug}`}
              className="inline-flex items-center gap-1 font-bold text-[#00f0ff] hover:underline"
            >
              Open Post <ExternalLink className="h-3 w-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

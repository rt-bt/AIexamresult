"use client";

import { useEffect, useRef } from "react";

// Colors from URL: ?c1=0E877D&c2=3FA8A5&c3=0E877D&c4=0E877D&c5=4AB5AD&amount=0.16&speed=0.07&fx=2.3&fy=6
const COLORS = [
  [0.0549, 0.5294, 0.4902], // #0E877D (c1)
  [0.2471, 0.6588, 0.6471], // #3FA8A5 (c2)
  [0.0549, 0.5294, 0.4902], // #0E877D (c3)
  [0.0549, 0.5294, 0.4902], // #0E877D (c4)
  [0.2902, 0.7098, 0.6784], // #4AB5AD (c5)
];

const VS_SOURCE = `
  attribute vec3 aPosition;
  attribute vec2 aUv;

  uniform mat4 uProjectionMatrix;
  uniform mat4 uViewMatrix;
  uniform vec2 uFrequency;
  uniform float uTime;
  uniform float uAmount;
  uniform float uSpeed;
  uniform vec3 uColor[5];

  varying vec3 vColor;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}

  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0);
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

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

    float n_ = 1.0/7.0; 
    vec3  ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);    

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
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
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  void main() {
    vec2 noiseCoord = aUv * vec2(uFrequency.x, uFrequency.y);
    float noise = snoise(vec3(noiseCoord.x + uTime * 0.02, noiseCoord.y, uTime * uSpeed));

    vec4 modelPos = vec4(aPosition, 1.0);
    modelPos.y += noise * uAmount;

    vColor = uColor[4];

    for(int i = 0; i < 4; i++){
      float noiseFlow = 0.0002 + float(i) * 0.05;
      float noiseSpeed = 0.0001 + float(i) * 0.03;
      float noiseSeed = 1.0 + float(i) * 10.0;
      vec2 noiseFreq = vec2(0.3, 0.6);
      float noiseFloor = 0.1;
      float noiseCeiling = 0.6 + float(i) * 0.08;

      float n = smoothstep(noiseFloor, noiseCeiling, snoise(vec3(noiseCoord.x * noiseFreq.x + uTime * noiseFlow, noiseCoord.y * noiseFreq.y, uTime * noiseSpeed + noiseSeed)));

      vColor = mix(vColor, uColor[i], n);
    }

    gl_Position = uProjectionMatrix * uViewMatrix * modelPos;
  }
`;

const FS_SOURCE = `
  precision mediump float;
  varying vec3 vColor;
  void main() {
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

function perspective(fovRad: number, aspect: number, near: number, far: number) {
  const f = 1.0 / Math.tan(fovRad / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0
  ]);
}

function lookAt(eye: [number, number, number], target: [number, number, number], up: [number, number, number]) {
  const [eyex, eyey, eyez] = eye;
  const [tx, ty, tz] = target;
  const [upx, upy, upz] = up;

  let z0 = eyex - tx, z1 = eyey - ty, z2 = eyez - tz;
  let len = 1 / Math.hypot(z0, z1, z2);
  z0 *= len; z1 *= len; z2 *= len;

  let x0 = upy * z2 - upz * z1, x1 = upz * z0 - upx * z2, x2 = upx * z1 - upy * z0;
  len = 1 / Math.hypot(x0, x1, x2);
  x0 *= len; x1 *= len; x2 *= len;

  const y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0;

  return new Float32Array([
    x0, y0, z0, 0,
    x1, y1, z1, 0,
    x2, y2, z2, 0,
    -(x0 * eyex + x1 * eyey + x2 * eyez),
    -(y0 * eyex + y1 * eyey + y2 * eyez),
    -(z0 * eyex + z1 * eyey + z2 * eyez),
    1
  ]);
}

export function HeroGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });

    if (!gl) return;

    function compileShader(src: string, type: number) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn("Shader compile error:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compileShader(VS_SOURCE, gl.VERTEX_SHADER);
    const fs = compileShader(FS_SOURCE, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.warn("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Plane geometry (segmented grid)
    const segX = 110;
    const segY = 110;
    const width = 5.0;
    const height = 5.0;
    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let y = 0; y <= segY; y++) {
      const v = y / segY;
      const posY = (v - 0.5) * height;
      for (let x = 0; x <= segX; x++) {
        const u = x / segX;
        const posX = (u - 0.5) * width;
        // Rotated -90deg on X: (x, 0, -y)
        positions.push(posX, 0, -posY);
        uvs.push(u, 1.0 - v);
      }
    }

    const row = segX + 1;
    for (let y = 0; y < segY; y++) {
      for (let x = 0; x < segX; x++) {
        const a = y * row + x;
        const b = a + 1;
        const c = a + row;
        const d = c + 1;
        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    const aPosLoc = gl.getAttribLocation(prog, "aPosition");
    gl.enableVertexAttribArray(aPosLoc);
    gl.vertexAttribPointer(aPosLoc, 3, gl.FLOAT, false, 0, 0);

    const uvBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uvs), gl.STATIC_DRAW);
    const aUvLoc = gl.getAttribLocation(prog, "aUv");
    gl.enableVertexAttribArray(aUvLoc);
    gl.vertexAttribPointer(aUvLoc, 2, gl.FLOAT, false, 0, 0);

    const idxBuf = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, idxBuf);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // Uniforms
    const uProjLoc = gl.getUniformLocation(prog, "uProjectionMatrix");
    const uViewLoc = gl.getUniformLocation(prog, "uViewMatrix");
    const uFreqLoc = gl.getUniformLocation(prog, "uFrequency");
    const uTimeLoc = gl.getUniformLocation(prog, "uTime");
    const uAmountLoc = gl.getUniformLocation(prog, "uAmount");
    const uSpeedLoc = gl.getUniformLocation(prog, "uSpeed");
    const uColorLoc = gl.getUniformLocation(prog, "uColor");

    const flatColors = new Float32Array(COLORS.flat());
    gl.uniform3fv(uColorLoc, flatColors);
    gl.uniform2f(uFreqLoc, 1.9, 6.0); // fx=1.9, fy=6.0 as requested
    gl.uniform1f(uAmountLoc, 0.16);    // amount=0.16
    gl.uniform1f(uSpeedLoc, 0.07);     // speed=0.07

    let isVisible = true;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      if (!canvas || !gl) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.floor(canvas.clientWidth * dpr);
      const h = Math.floor(canvas.clientHeight * dpr);
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);

        const aspect = w / h;
        // Adapt camera distance so the hero banner captures the full wave landscape without being zoomed in
        const zoom = Math.max(1.0, aspect / 1.5);
        const eyeY = 0.58 * zoom;
        const eyeZ = 0.48 * zoom;

        const viewMatrix = lookAt([0, eyeY, eyeZ], [0, 0, 0], [0, 1, 0]);
        gl.uniformMatrix4fv(uViewLoc, false, viewMatrix);

        const fov = (38 * Math.PI) / 180;
        const proj = perspective(fov, aspect, 0.1, 100);
        gl.uniformMatrix4fv(uProjLoc, false, proj);
      }
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    let animId: number;
    const startTime = performance.now();

    function render() {
      if (!canvas || !gl) return;
      if (isVisible) {
        resize();
        const elapsed = (performance.now() - startTime) * 0.001;
        gl.uniform1f(uTimeLoc, elapsed);
        gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
      }

      if (!prefersReducedMotion) {
        animId = requestAnimationFrame(render);
      }
    }

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
      observer.disconnect();
      if (gl) {
        gl.deleteBuffer(posBuf);
        gl.deleteBuffer(uvBuf);
        gl.deleteBuffer(idxBuf);
        gl.deleteProgram(prog);
        gl.deleteShader(vs);
        gl.deleteShader(fs);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* CSS Gradient fallback during SSR / WebGL loading */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          background: "radial-gradient(ellipse at top, #3FA8A5 0%, #0E877D 50%, #084c47 100%)"
        }}
      />
      {/* Live WebGL Animated Shader Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Subtle vignette / contrast overlay to guarantee WCAG AA text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
    </div>
  );
}

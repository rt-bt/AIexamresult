"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";

const RATIOS: { label: string; w: number; h: number }[] = [
  { label: "Free", w: 0, h: 0 },
  { label: "Passport 2×2″", w: 2, h: 2 },
  { label: "Passport 1×1″", w: 1, h: 1 },
  { label: "ID Card 3.5×4.5 cm", w: 35, h: 45 },
  { label: "Poster 4×6″", w: 4, h: 6 },
  { label: "Square 1:1", w: 1, h: 1 },
];

export default function ImageCompressorPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const cropRef = useRef<HTMLDivElement>(null);

  const [src, setSrc] = useState<string | null>(null);
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [quality, setQuality] = useState(0.8);
  const [ratio, setRatio] = useState(RATIOS[0]);
  const [crop, setCrop] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [downloading, setDownloading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);

  const handleFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const image = new Image();
    image.onload = () => {
      setImg(image);
      setSrc(url);
      setCrop({ x: 0, y: 0, w: image.naturalWidth, h: image.naturalHeight });
    };
    image.src = url;
  }, []);

  const drawPreview = useCallback(() => {
    const c = previewRef.current;
    const i = img;
    if (!c || !i) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    const maxW = 600;
    const scale = Math.min(maxW / i.naturalWidth, 500 / i.naturalHeight, 1);
    c.width = i.naturalWidth * scale;
    c.height = i.naturalHeight * scale;
    ctx.drawImage(i, 0, 0, c.width, c.height);

    // crop overlay
    const cx = crop.x * scale;
    const cy = crop.y * scale;
    const cw = crop.w * scale;
    const ch = crop.h * scale;
    ctx.fillStyle = "rgba(0,0,0,0.4)";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.clearRect(cx, cy, cw, ch);
    ctx.strokeStyle = "#0D9488";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx, cy, cw, ch);
  }, [img, crop]);

  useEffect(() => {
    drawPreview();
  }, [drawPreview]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!previewRef.current || !img) return;
      const rect = previewRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) * (img.naturalWidth / rect.width);
      const y = (e.clientY - rect.top) * (img.naturalHeight / rect.height);
      setIsDragging(true);
      setDragStart({ x, y });
      setCrop((prev) => ({ ...prev, x, y, w: 0, h: 0 }));
      previewRef.current.setPointerCapture(e.pointerId);
    },
    [img]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDragging || !previewRef.current || !img) return;
      const rect = previewRef.current.getBoundingClientRect();
      const x = Math.min(Math.max(0, (e.clientX - rect.left) * (img.naturalWidth / rect.width)), img.naturalWidth);
      const y = Math.min(Math.max(0, (e.clientY - rect.top) * (img.naturalHeight / rect.height)), img.naturalHeight);
      const w = x - dragStart.x;
      let h = y - dragStart.y;

      if (ratio.w && ratio.h) {
        const r = ratio.w / ratio.h;
        const absW = Math.abs(w);
        h = Math.sign(h) * (absW / r);
      }

      setCrop((prev) => {
        const nx = w < 0 ? x : dragStart.x;
        const ny = h < 0 ? y : dragStart.y;
        return { x: nx, y: ny, w: Math.abs(w), h: Math.abs(h) };
      });
    },
    [isDragging, dragStart, ratio, img]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const resetCrop = useCallback(() => {
    if (!img) return;
    setCrop({ x: 0, y: 0, w: img.naturalWidth, h: img.naturalHeight });
  }, [img]);

  const compress = useCallback(() => {
    const c = canvasRef.current;
    const i = img;
    if (!c || !i) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    c.width = Math.round(crop.w);
    c.height = Math.round(crop.h);
    ctx.drawImage(i, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h);

    setDownloading(true);
    const link = document.createElement("a");
    link.download = `compressed-${Math.round(crop.w)}x${Math.round(crop.h)}.jpg`;
    link.href = c.toDataURL("image/jpeg", quality);
    link.click();
    setTimeout(() => setDownloading(false), 500);
  }, [img, crop, quality]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
                Free Tool
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Image Compressor &amp; Cropper</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Compress and crop images for competitive exam applications
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-gray-100">
              {!src ? (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                  <div className="mb-4 h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                    <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-gray-700">Upload an image</p>
                  <p className="mt-1 text-xs text-gray-400">PNG, JPG, WEBP up to 10 MB</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-4 rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-500 transition-colors"
                  >
                    Choose Image
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Controls */}
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Change Image
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
                    <button
                      onClick={resetCrop}
                      className="rounded-lg bg-gray-100 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                    >
                      Reset Crop
                    </button>
                  </div>

                  {/* Ratio Pills */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">Crop Aspect Ratio</label>
                    <div className="flex flex-wrap gap-2">
                      {RATIOS.map((r) => (
                        <button
                          key={r.label}
                          onClick={() => setRatio(r)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            ratio.label === r.label
                              ? "bg-teal-600 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preview with crop overlay */}
                  <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                    <canvas
                      ref={previewRef}
                      onPointerDown={handlePointerDown}
                      onPointerMove={handlePointerMove}
                      onPointerUp={handlePointerUp}
                      className="w-full h-auto cursor-crosshair touch-none"
                      style={{ maxHeight: "70vh" }}
                    />
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-1 text-[10px] text-white">
                      {Math.round(crop.w)} × {Math.round(crop.h)} px
                    </div>
                  </div>

                  {/* Quality slider */}
                  <div>
                    <label className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                      <span>JPEG Quality</span>
                      <span className="font-mono text-teal-600">{Math.round(quality * 100)}%</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-teal-600"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                      <span>Smaller</span>
                      <span>Better Quality</span>
                    </div>
                  </div>

                  {/* Compress & Download */}
                  <button
                    onClick={compress}
                    disabled={downloading}
                    className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 hover:shadow-lg hover:from-teal-500 hover:to-teal-400 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {downloading ? "Processing..." : "Compress & Download"}
                  </button>

                  <canvas ref={canvasRef} className="hidden" />
                </div>
              )}
            </div>

            {/* Exam Photo Guide */}
            {src && (
              <details className="mt-4 rounded-xl bg-white border border-gray-100 shadow-sm">
                <summary className="cursor-pointer px-6 py-4 text-sm font-semibold text-gray-700 select-none">
                  Competitive Exam Photo Guidelines
                </summary>
                <div className="px-6 pb-4 space-y-1 text-xs text-gray-500">
                  <p>• Passport size: 2″ × 2″ (51 × 51 mm) — most exams</p>
                  <p>• Postcard size: 3.5″ × 2.25″ — SSC, Railway</p>
                  <p>• Max file size usually 20–100 KB</p>
                  <p>• White or light blue background recommended</p>
                  <p>• JPEG format, face should cover 70–80% of photo</p>
                  <p>• Use our Free crop preset for instant sizing</p>
                </div>
              </details>
            )}

            {/* Info */}
            <div className="mt-6 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
              <h2 className="font-semibold text-gray-900 mb-2">How to use</h2>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                <li>Upload your photo or document</li>
                <li>Choose a crop ratio preset or drag to select area</li>
                <li>Adjust quality slider to balance size vs quality</li>
                <li>Click <strong>Compress &amp; Download</strong> — everything stays on your device</li>
                <li>No files are uploaded to any server (100% private)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

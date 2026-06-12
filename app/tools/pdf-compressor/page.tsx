"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { FileText } from "lucide-react";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}

export default function PdfCompressorPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState(0.5);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState("");
  const [result, setResult] = useState<{ blob: Blob; size: number; pages: number } | null>(null);
  const [error, setError] = useState("");

  async function compress() {
    if (!file) return;
    setProcessing(true);
    setError("");
    setResult(null);
    setProgress("Loading PDF...");

    try {
      const pdfjsLib = await import("pdfjs-dist");
      const { jsPDF } = await import("jspdf");

      const workerUrl = "/pdf.worker.min.js";
      pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      const scale = quality <= 0.3 ? 0.5 : quality <= 0.6 ? 0.75 : 1.0;

      const firstPage = await pdf.getPage(1);
      const vp = firstPage.getViewport({ scale: 1 });
      const pdfW = vp.width * 0.75;
      const pdfH = vp.height * 0.75;

      const doc = new jsPDF({ unit: "pt", format: [pdfW, pdfH], compress: true });

      for (let i = 1; i <= totalPages; i++) {
        setProgress(`Processing page ${i} of ${totalPages}...`);
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (page.render as any)({ canvasContext: ctx, viewport }).promise;
        const imgData = canvas.toDataURL("image/jpeg", quality);

        if (i > 1) {
          doc.addPage([viewport.width * 0.75, viewport.height * 0.75]);
        }
        doc.addImage(imgData, "JPEG", 0, 0, viewport.width * 0.75, viewport.height * 0.75);
      }

      const blob = doc.output("blob");
      setResult({ blob, size: blob.size, pages: totalPages });
      setProgress("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Compression failed");
    }
    setProcessing(false);
  }

  return (
    <>
      <Header />
      <main className="min-h-[calc(100dvh-4rem)] bg-gradient-to-br from-gray-50 to-teal-50 pb-20 lg:pb-10">
        <div className="container-page py-8 sm:py-12">
          <div className="mx-auto max-w-2xl">
            <div className="mb-8 text-center">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-100 px-3.5 py-1 text-xs font-semibold text-teal-700 mb-3">
                Free Tool
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">PDF Compressor</h1>
              <p className="mt-2 text-gray-500 text-sm sm:text-base">
                Reduce PDF file size for exam form uploads — 100% private, no server upload
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-lg border border-gray-100">
              {!file ? (
                <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
                  <div className="mb-4 h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center">
                    <FileText className="h-6 w-6 text-teal-600" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Upload a PDF</p>
                  <p className="mt-1 text-xs text-gray-400">Max 50 MB</p>
                  <button
                    onClick={() => fileRef.current?.click()}
                    className="mt-4 rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white hover:bg-teal-500 transition-colors"
                  >
                    Choose PDF
                  </button>
                  <input ref={fileRef} type="file" accept=".pdf" onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setFile(f);
                  }} className="hidden" />
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4 border border-gray-100">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="h-8 w-8 shrink-0 text-teal-600" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                        <p className="text-xs text-gray-400">{formatSize(file.size)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => { setFile(null); setResult(null); }}
                      className="text-xs text-gray-500 hover:text-red-500 transition-colors shrink-0 ml-2"
                    >
                      Change
                    </button>
                  </div>

                  <div>
                    <label className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2">
                      <span>Compression Level</span>
                      <span className="font-mono text-teal-600">
                        {quality <= 0.3 ? "Max" : quality <= 0.6 ? "Medium" : "Light"}
                      </span>
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
                      <span>Smallest</span>
                      <span>Best Quality</span>
                    </div>
                  </div>

                  <button
                    onClick={compress}
                    disabled={processing}
                    className="w-full rounded-xl bg-gradient-to-r from-teal-600 to-teal-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-teal-200 hover:shadow-lg hover:from-teal-500 hover:to-teal-400 transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {processing ? "Compressing..." : "Compress PDF"}
                  </button>

                  {progress && (
                    <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 rounded-lg px-4 py-3 border border-teal-200">
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {progress}
                    </div>
                  )}

                  {error && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                      {error}
                    </div>
                  )}

                  {result && (
                    <div className="rounded-xl bg-green-50 border border-green-200 p-4 space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-3 rounded-lg bg-white/70">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Original</p>
                          <p className="text-lg font-bold text-gray-800">{formatSize(file!.size)}</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-white/70">
                          <p className="text-[10px] text-gray-500 uppercase tracking-wider">Compressed</p>
                          <p className="text-lg font-bold text-teal-700">{formatSize(result.size)}</p>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className="text-xs text-gray-500">
                          {result.pages} page{result.pages > 1 ? "s" : ""} &middot;{" "}
                          {file!.size > 0
                            ? `${Math.round((1 - result.size / file!.size) * 100)}% smaller`
                            : ""}
                        </span>
                      </div>
                      <a
                        href={URL.createObjectURL(result.blob)}
                        download={`compressed-${file!.name}`}
                        className="block w-full rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white text-center hover:bg-teal-500 transition-colors"
                      >
                        Download Compressed PDF
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!file && (
              <div className="mt-6 rounded-2xl bg-white p-6 shadow-lg border border-gray-100">
                <h2 className="font-semibold text-gray-900 mb-2">How to use</h2>
                <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                  <li>Upload your PDF document</li>
                  <li>Choose compression level (Max = smallest size)</li>
                  <li>Click <strong>Compress PDF</strong> &mdash; processing happens on your device</li>
                  <li>Download the compressed file</li>
                  <li>Ideal for exam form attachments, scanned documents, certificates</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

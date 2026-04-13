"use client";
import { OpenAI } from "openai";
import { ChangeEvent, useRef, useState } from "react";

export default function Analysis() {
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setPreviewUrl(base64);
      setImageUrl(base64);
      setAnalysis("");
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!imageUrl) return;
    setLoading(true);
    setAnalysis("");

    try {
      const client = new OpenAI({
        baseURL: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
        dangerouslyAllowBrowser: true,
      });

      const chatCompletion = await client.chat.completions.create({
        model: "moonshotai/Kimi-K2.5:novita",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Describe this image in detail.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
      });

      setAnalysis(chatCompletion.choices[0].message.content ?? "");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-16 font-manrope pt-10">
      {/* Glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.2em] uppercase text-white font-medium">
            AI Image Analyser
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
            Upload anything.
            <br />
            <span className="text-white">Understand it instantly.</span>
          </h1>
        </div>

        {/* Upload row */}
        <div className="flex rounded-xl overflow-hidden border border-white shadow-lg">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex-1 px-5 py-4 text-sm text-zinc-400 truncate">
            {previewUrl ? "Image ready — click Analyse →" : "No image selected"}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="bg-zinc-800 hover:bg-zinc-700 transition-colors duration-150 px-6 text-sm font-semibold text-white whitespace-nowrap border-l border-white/20"
          >
            Upload ↑
          </button>
          <button
            onClick={handleAnalyze}
            disabled={!previewUrl || loading}
            className="bg-white hover:bg-orange-500 hover:text-white hover:font-bold transition-colors duration-150 px-6 text-sm font-semibold text-black whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Analyse →
          </button>
        </div>

        {/* Image preview */}
        {previewUrl && (
          <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-violet-950/30">
            <img src={previewUrl} alt="Uploaded" className="w-full block" />
          </div>
        )}

        {/* Result */}
        {loading ? (
          <div className="w-full rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-3 py-16">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
            <p className="text-xs tracking-widest uppercase text-zinc-600 animate-pulse">
              Analysing...
            </p>
          </div>
        ) : analysis ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 px-6 py-5">
            <p className="text-xs tracking-widest uppercase text-zinc-600 mb-3">
              Analysis
            </p>
            <p className="text-sm text-zinc-300 leading-relaxed">{analysis}</p>
          </div>
        ) : !previewUrl ? (
          <div className="w-full aspect-video rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 text-xl">
              ✦
            </div>
            <p className="text-xs tracking-widest uppercase text-zinc-700">
              Your analysis will appear here
            </p>
          </div>
        ) : null}
      </div>
    </main>
  );
}

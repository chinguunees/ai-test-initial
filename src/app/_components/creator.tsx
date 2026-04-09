"use client";
import { InferenceClient } from "@huggingface/inference";

import { ChangeEvent, useState } from "react";

export default function Creator() {
  const [prompt, setPrompt] = useState("");
  const [data, setData] = useState("");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const onClick = async () => {
    setLoading(true);
    const client = new InferenceClient("APIKEY");

    const image = await client.textToImage({
      provider: "nscale",
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
      parameters: { num_inference_steps: 5 },
    });
    const url = URL.createObjectURL(image);
    setData(url);
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4 py-16 font-manrope ">
      {/* Glow blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <span className="text-xs tracking-[0.2em] uppercase text-white font-medium">
            AI Image Generator
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
            Imagine anything.
            <br />
            <span className="text-white">See it instantly.</span>
          </h1>
        </div>

        <div className="flex rounded-xl overflow-hidden border border-white duration-200 shadow-lg">
          <input
            type="text"
            value={prompt}
            onChange={handleChange}
            placeholder="A fox reading a book under northern lights..."
            className="flex-1 bg-transparent px-5 py-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none"
          />
          <button
            onClick={onClick}
            className="bg-white hover:bg-orange-500 hover:text-white hover:font-bold transition-colors duration-150 px-6 text-sm font-semibold text-black whitespace-nowrap"
          >
            Generate →
          </button>
        </div>

        {/* Result */}
        {loading ? (
          <div className="w-full aspect-video rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
            <p className="text-xs tracking-widest uppercase text-zinc-600 animate-pulse">
              Generating...
            </p>
          </div>
        ) : data ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl shadow-violet-950/30">
              <img src={data} alt={prompt} className="w-full block" />
            </div>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-zinc-600 italic truncate max-w-sm">
                "{text}"
              </p>
              <a
                href={data}
                download="generated.png"
                className="shrink-0 ml-4 text-xs text-zinc-400 hover:text-violet-400 border border-zinc-800 hover:border-violet-500 px-4 py-1.5 rounded-full transition-colors duration-150"
              >
                Download ↓
              </a>
            </div>
          </div>
        ) : (
          <div className="w-full aspect-video rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 text-xl">
              ✦
            </div>
            <p className="text-xs tracking-widest uppercase text-zinc-700">
              Your image will appear here
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

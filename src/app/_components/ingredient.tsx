"use client";
import { OpenAI } from "openai";
import { ChangeEvent, useRef, useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const client = new OpenAI({
        baseURL: "https://router.huggingface.co/v1",
        apiKey: process.env.HF_TOKEN,
        dangerouslyAllowBrowser: true,
      });

      const chatCompletion = await client.chat.completions.create({
        model: "zai-org/GLM-5.1:together",
        messages: updatedMessages,
      });

      const assistantMessage: Message = {
        role: "assistant",
        content: chatCompletion.choices[0].message.content ?? "",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
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
            AI Chat
          </span>
          <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
            Ask anything.
            <br />
            <span className="text-white">Get answers instantly.</span>
          </h1>
        </div>

        {/* Messages */}
        {messages.length > 0 && (
          <div className="flex flex-col gap-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs mr-2 mt-1 shrink-0">
                    ✦
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-white text-black font-medium"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {/* Loading bubble */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 text-xs mr-2 mt-1 shrink-0">
                  ✦
                </div>
                <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-3 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-zinc-700 border-t-white animate-spin" />
                  <p className="text-xs tracking-widest uppercase text-zinc-600 animate-pulse">
                    Thinking...
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty state */}
        {messages.length === 0 && !loading && (
          <div className="w-full aspect-video rounded-2xl border border-dashed border-zinc-800 flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-700 text-xl">
              ✦
            </div>
            <p className="text-xs tracking-widest uppercase text-zinc-700">
              Your conversation will appear here
            </p>
          </div>
        )}

        {/* Input */}
        <div className="flex rounded-xl overflow-hidden border border-white duration-200 shadow-lg">
          <input
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="What is the capital of France..."
            className="flex-1 bg-transparent px-5 py-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="bg-white hover:bg-orange-500 hover:text-white hover:font-bold transition-colors duration-150 px-6 text-sm font-semibold text-black whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Send →
          </button>
        </div>
      </div>
    </main>
  );
}

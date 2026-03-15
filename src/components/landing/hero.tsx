"use client";

import { useState } from "react";

export function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white">
      <div className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <p className="text-sm font-semibold uppercase tracking-widest opacity-70 mb-4">
          For USDA-Accredited Veterinarians
        </p>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold tracking-tight mb-6 max-w-3xl leading-tight">
          Stop dreading export health certificates.
        </h1>
        <p className="text-lg md:text-xl opacity-85 mb-10 max-w-2xl leading-relaxed">
          VetExport Pro collects patient and client travel information with
          simple input from you, the accredited veterinarian — then
          automatically populates the correct USDA APHIS export certificate
          with the proper strikethroughs and formatting. You just review and
          sign.
        </p>

        {status === "success" ? (
          <div className="max-w-md bg-white/15 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
            <p className="text-white font-semibold">
              You&apos;re on the list! Check your inbox for a welcome email.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@clinic.com"
              className="flex-1 px-5 py-4 rounded-xl border-none text-text text-base outline-none focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-8 py-4 bg-white text-primary font-bold text-base rounded-xl hover:bg-gray-50 transition-colors border-none cursor-pointer shadow-lg disabled:opacity-60 whitespace-nowrap"
            >
              {status === "loading" ? "Joining..." : "Join the Waitlist"}
            </button>
          </form>
        )}
        {status === "error" && (
          <p className="text-white/80 text-sm mt-3">Something went wrong. Please try again.</p>
        )}

        <a
          href="#how-it-works"
          className="inline-block mt-6 text-white/70 text-sm font-medium hover:text-white transition-colors no-underline"
        >
          See how it works &darr;
        </a>
      </div>
    </section>
  );
}

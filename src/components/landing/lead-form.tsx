"use client";

import { useState } from "react";
import { COUNTRIES_EU } from "@/lib/certificates/en-es-2019-1293/constants";

export function LeadForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [destination, setDestination] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), destination }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  if (status === "success") {
    return (
      <section id="signup" className="py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="bg-success-bg border border-success-border rounded-2xl p-10">
            <div className="text-4xl mb-4">&#x2705;</div>
            <h3 className="text-xl font-serif font-bold text-text mb-2">
              You&apos;re on the list!
            </h3>
            <p className="text-sm text-text-muted">
              Check your inbox for a welcome email from VetExport Pro.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="signup" className="py-20">
      <div className="max-w-xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-border-light shadow-sm">
          <h2 className="text-2xl font-serif font-bold text-text mb-2 text-center">
            Get Started
          </h2>
          <p className="text-sm text-text-muted text-center mb-8">
            Sign up to get notified about new destinations and certificate types.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-text mb-1">
                Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2.5 border-[1.5px] border-border rounded-lg text-sm bg-white text-text outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-1">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2.5 border-[1.5px] border-border rounded-lg text-sm bg-white text-text outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text mb-1">
                Where are you traveling?
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full px-3 py-2.5 border-[1.5px] border-border rounded-lg text-sm bg-white text-text outline-none appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%3E%3Cpath%20d=%27M6%208L1%203h10z%27%20fill=%27%236b7c93%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
              >
                <option value="">Select destination (optional)</option>
                {COUNTRIES_EU.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            {status === "error" && (
              <p className="text-sm text-danger">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default border-none text-sm"
            >
              {status === "loading" ? "Signing up..." : "Sign Up for Updates"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

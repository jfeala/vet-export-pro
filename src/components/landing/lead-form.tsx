"use client";

import { useState } from "react";
import { COUNTRIES_EU } from "@/lib/certificates/en-es-2019-1293/constants";

export function LeadForm() {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "survey" | "done">("email");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // Survey state
  const [countries, setCountries] = useState<string[]>([]);
  const [canContact, setCanContact] = useState<string>("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("idle");
      setStep("survey");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const toggleCountry = (code: string) => {
    setCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await fetch("/api/leads/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          countries,
          canContact: canContact === "yes",
        }),
      });
    } catch {
      // Non-critical, proceed anyway
    }
    setStep("done");
    setStatus("idle");
  };

  if (step === "done") {
    return (
      <section id="signup" className="py-20">
        <div className="max-w-xl mx-auto px-6 text-center">
          <div className="bg-success-bg border border-success-border rounded-2xl p-10">
            <div className="text-4xl mb-4">&#x2705;</div>
            <h3 className="text-xl font-serif font-bold text-text mb-2">
              You&apos;re on the list!
            </h3>
            <p className="text-sm text-text-muted">
              Thanks for the feedback. Check your inbox for a welcome email from VetExport Pro.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (step === "survey") {
    const popularCountries = COUNTRIES_EU.filter((c) =>
      ["DE", "FR", "ES", "IT", "NL", "GB", "PT", "IE", "GR", "AT", "BE", "CH"].includes(c.code)
    );
    const otherCountries = COUNTRIES_EU.filter(
      (c) => !popularCountries.some((p) => p.code === c.code)
    );

    return (
      <section id="signup" className="py-20">
        <div className="max-w-xl mx-auto px-6">
          <div className="bg-white rounded-2xl p-8 md:p-10 border border-border-light shadow-sm">
            <h2 className="text-2xl font-serif font-bold text-text mb-2 text-center">
              Quick questions
            </h2>
            <p className="text-sm text-text-muted text-center mb-8">
              Help us build VetExport Pro for the destinations you need most.
            </p>
            <form onSubmit={handleSurveySubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-text mb-3">
                  Which countries do you most commonly export to? <span className="font-normal text-text-muted">(select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {popularCountries.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => toggleCountry(c.code)}
                      className={`px-3 py-2 rounded-lg text-sm border cursor-pointer transition-colors text-left ${
                        countries.includes(c.code)
                          ? "bg-primary-bg border-primary text-primary font-medium"
                          : "bg-white border-border text-text hover:bg-gray-50"
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
                <details className="text-sm">
                  <summary className="text-text-muted cursor-pointer hover:text-text">
                    Show all EU countries
                  </summary>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                    {otherCountries.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => toggleCountry(c.code)}
                        className={`px-3 py-2 rounded-lg text-sm border cursor-pointer transition-colors text-left ${
                          countries.includes(c.code)
                            ? "bg-primary-bg border-primary text-primary font-medium"
                            : "bg-white border-border text-text hover:bg-gray-50"
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </details>
              </div>

              <div>
                <label className="block text-sm font-semibold text-text mb-3">
                  Can we reach out to learn more about your export workflow?
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCanContact("yes")}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm border cursor-pointer transition-colors ${
                      canContact === "yes"
                        ? "bg-primary-bg border-primary text-primary font-medium"
                        : "bg-white border-border text-text hover:bg-gray-50"
                    }`}
                  >
                    Sure, happy to help
                  </button>
                  <button
                    type="button"
                    onClick={() => setCanContact("no")}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm border cursor-pointer transition-colors ${
                      canContact === "no"
                        ? "bg-primary-bg border-primary text-primary font-medium"
                        : "bg-white border-border text-text hover:bg-gray-50"
                    }`}
                  >
                    Not right now
                  </button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("done")}
                  className="flex-1 py-3 bg-white text-text-muted font-semibold rounded-lg border border-border hover:bg-gray-50 transition-colors cursor-pointer text-sm"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="flex-1 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60 border-none text-sm"
                >
                  {status === "loading" ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
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
            Join the Waitlist
          </h2>
          <p className="text-sm text-text-muted text-center mb-8">
            We&apos;re onboarding veterinary practices now. Get early access and help shape the product.
          </p>
          <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@clinic.com"
              className="flex-1 px-4 py-3 border-[1.5px] border-border rounded-lg text-sm bg-white text-text outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-default border-none text-sm whitespace-nowrap"
            >
              {status === "loading" ? "Joining..." : "Join the Waitlist"}
            </button>
          </form>
          {status === "error" && (
            <p className="text-sm text-danger mt-3">{errorMsg}</p>
          )}
        </div>
      </div>
    </section>
  );
}

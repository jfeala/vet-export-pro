"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { StripeProvider } from "@/components/stripe/stripe-provider";
import { PaymentMethodForm } from "@/components/stripe/payment-method-form";

const STEPS = [
  { id: "profile", label: "Practice Info" },
  { id: "payment", label: "Payment Method" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [step, setStep] = useState(0);

  // Profile fields
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [accreditedVetName, setAccreditedVetName] = useState("");
  const [nationalAccreditationNumber, setNationalAccreditationNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Stripe
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        hospitalName,
        hospitalAddress,
        accreditedVetName,
        nationalAccreditationNumber,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to save");
      setLoading(false);
      return;
    }

    // Create setup intent for payment step
    const setupRes = await fetch("/api/stripe/setup-intent", { method: "POST" });
    if (!setupRes.ok) {
      setError("Failed to initialize payment setup. Please try again.");
      setLoading(false);
      return;
    }

    const { clientSecret: secret } = await setupRes.json();
    setClientSecret(secret);
    setStep(1);
    setLoading(false);
  }

  async function handlePaymentSuccess() {
    // Mark onboarding complete
    const res = await fetch("/api/onboarding/complete", { method: "POST" });
    if (!res.ok) {
      setError("Failed to complete onboarding. Please try again.");
      return;
    }

    await update({ onboardedAt: new Date().toISOString() });
    router.push("/dashboard");
    router.refresh();
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light px-8 pt-7 pb-5 text-white">
        <div className="max-w-[600px] mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Link href="/" className="flex items-center gap-2 no-underline text-white">
              <span className="text-2xl">&#x1F43E;</span>
              <h1 className="text-[22px] font-serif font-bold tracking-tight">
                VetExport Pro
              </h1>
            </Link>
          </div>
          <p className="text-sm opacity-80">Set up your account</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-border-light px-8 py-3">
        <div className="max-w-[600px] mx-auto flex gap-4 items-center">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <span
                className={`w-6 h-6 rounded-full text-xs flex items-center justify-center font-semibold ${
                  i < step
                    ? "bg-primary-light text-white"
                    : i === step
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? "\u2713" : i + 1}
              </span>
              <span
                className={`text-sm ${
                  i === step ? "text-primary font-semibold" : "text-text-muted"
                }`}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px ml-2 ${
                    i < step ? "bg-primary-light" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-8 pt-7 pb-16">
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-border-light">
          {step === 0 && (
            <>
              <h2 className="text-xl font-serif font-semibold text-text mb-1">
                Practice Information
              </h2>
              <p className="text-sm text-text-muted mb-6">
                This information will be used to pre-fill your certificates.
              </p>

              {error && (
                <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3 mb-4 border border-red-200">
                  {error}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Veterinary Hospital / Clinic Name
                  </label>
                  <input
                    type="text"
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    required
                    placeholder="Springfield Animal Hospital"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Hospital Address
                  </label>
                  <input
                    type="text"
                    value={hospitalAddress}
                    onChange={(e) => setHospitalAddress(e.target.value)}
                    required
                    placeholder="456 Vet Clinic Rd, Springfield, IL 62704"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    Accredited Veterinarian Name
                  </label>
                  <input
                    type="text"
                    value={accreditedVetName}
                    onChange={(e) => setAccreditedVetName(e.target.value)}
                    required
                    placeholder="Dr. Jane Doe, DVM"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text mb-1">
                    National Accreditation Number
                  </label>
                  <p className="text-xs text-text-muted mb-1.5">
                    Found on your USDA accreditation certificate or via the{" "}
                    <a
                      href="https://vsapps.aphis.usda.gov/vsps/public/VetSearch.do"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      USDA Vet Lookup tool
                    </a>
                  </p>
                  <input
                    type="text"
                    value={nationalAccreditationNumber}
                    onChange={(e) => setNationalAccreditationNumber(e.target.value)}
                    required
                    placeholder="e.g. 123456789"
                    className={inputClass}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors mt-2"
                >
                  {loading ? "Saving..." : "Continue to Payment Setup"}
                </button>
              </form>
            </>
          )}

          {step === 1 && clientSecret && (
            <>
              <h2 className="text-xl font-serif font-semibold text-text mb-1">
                Payment Method
              </h2>
              <p className="text-sm text-text-muted mb-2">
                Add a payment method to your account.
              </p>

              {/* Assurance message */}
              <div className="bg-primary-bg rounded-lg p-4 mb-6">
                <p className="text-sm text-primary font-medium mb-1">
                  No charges today
                </p>
                <p className="text-xs text-text-muted">
                  You&apos;ll only be charged per certificate once it&apos;s successfully
                  submitted. No monthly fees, no upfront costs.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3 mb-4 border border-red-200">
                  {error}
                </div>
              )}

              <StripeProvider clientSecret={clientSecret}>
                <PaymentMethodForm onSuccess={handlePaymentSuccess} />
              </StripeProvider>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

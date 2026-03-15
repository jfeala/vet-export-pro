"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function OnboardingPage() {
  const router = useRouter();
  const { update } = useSession();
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [accreditedVetName, setAccreditedVetName] = useState("");
  const [nationalAccreditationNumber, setNationalAccreditationNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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

    // Update the session so middleware knows we're onboarded
    await update({ onboardedAt: new Date().toISOString() });

    router.push("/certificate");
    router.refresh();
  }

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
          <p className="text-sm opacity-80">Set up your practice profile</p>
        </div>
      </div>

      <div className="max-w-[600px] mx-auto px-8 pt-7 pb-16">
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-border-light">
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

          <form onSubmit={handleSubmit} className="space-y-4">
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
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
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
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors mt-2"
            >
              {loading ? "Saving..." : "Continue to Certificates"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

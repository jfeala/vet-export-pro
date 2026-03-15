"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { OwnerStep } from "@/components/forms/owner-step";
import { DestinationStep } from "@/components/forms/destination-step";
import { PetsStep } from "@/components/forms/pets-step";
import { RabiesStep } from "@/components/forms/rabies-step";
import { TapewormStep } from "@/components/forms/tapeworm-step";
import { VetStep } from "@/components/forms/vet-step";
import { ReviewStep } from "@/components/forms/review-step";
import { STEPS } from "@/lib/certificates/en-es-2019-1293/constants";
import type { CertificateFormData } from "@/lib/certificates/en-es-2019-1293/types";
import { initialFormData } from "@/lib/certificates/en-es-2019-1293/types";

export default function CertificateByIdPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<CertificateFormData>(initialFormData());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Load existing certificate data
  useEffect(() => {
    fetch(`/api/certificates/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((cert) => {
        if (cert.formData && Object.keys(cert.formData).length > 0) {
          setData({ ...initialFormData(), ...cert.formData });
        }
        setLoading(false);
      })
      .catch(() => {
        router.push("/dashboard");
      });
  }, [id, router]);

  // Auto-save with debounce
  const saveToServer = useCallback(
    async (formData: CertificateFormData) => {
      setSaving(true);
      await fetch(`/api/certificates/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          destinationCountry: formData.destinationCountry || null,
          departureDate: formData.departureDate || null,
        }),
      }).catch(() => {});
      setSaving(false);
    },
    [id]
  );

  const update = useCallback(
    (field: string, value: unknown) => {
      setData((prev) => {
        const next = { ...prev, [field]: value };
        // Debounced auto-save
        clearTimeout(saveTimer.current);
        saveTimer.current = setTimeout(() => saveToServer(next), 2000);
        return next;
      });
    },
    [saveToServer]
  );

  // Save on step change
  function handleStepChange(newStep: number) {
    clearTimeout(saveTimer.current);
    saveToServer(data);
    setStep(newStep);
  }

  const hasDogs = (data.pets || []).some(
    (p) => p.species === "Canis familiaris"
  );

  const visibleSteps = STEPS.filter((s) => {
    if (s.id === "tapeworm" && !hasDogs) return false;
    return true;
  });

  const currentStepId = visibleSteps[step]?.id;

  const renderStep = () => {
    switch (currentStepId) {
      case "owner":
        return <OwnerStep data={data} update={update} />;
      case "destination":
        return <DestinationStep data={data} update={update} />;
      case "pets":
        return <PetsStep data={data} update={update} />;
      case "rabies":
        return <RabiesStep data={data} update={update} />;
      case "tapeworm":
        return <TapewormStep data={data} update={update} />;
      case "vet":
        return <VetStep data={data} update={update} />;
      case "review":
        return <ReviewStep data={data} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center">
        <p className="text-sm text-text-muted">Loading certificate...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light px-8 pt-7 pb-5 text-white">
        <div className="max-w-[800px] mx-auto">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <span className="text-2xl">&#x1F43E;</span>
              <h1 className="text-[22px] font-serif font-bold tracking-tight">
                EU Pet Travel Certificate
              </h1>
            </div>
            <Link
              href="/dashboard"
              className="text-sm text-white/80 hover:text-white no-underline"
            >
              &larr; Dashboard
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-sm opacity-80">
              EN-ES 2019-1293 — Non-commercial movement of dogs, cats, or ferrets
              from the U.S.
            </p>
            {saving && (
              <span className="text-xs opacity-60">Saving...</span>
            )}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border-b border-border-light px-8 py-3 sticky top-0 z-10">
        <div className="max-w-[800px] mx-auto flex gap-1 items-center">
          {visibleSteps.map((s, i) => (
            <div key={s.id} className="flex items-center flex-1">
              <button
                onClick={() => handleStepChange(i)}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border-none text-xs whitespace-nowrap transition-all cursor-pointer ${
                  i === step
                    ? "bg-primary-bg text-primary font-bold"
                    : i < step
                      ? "bg-success-bg/50 text-primary-light font-medium"
                      : "bg-transparent text-gray-400 font-medium"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-semibold ${
                    i < step
                      ? "bg-primary-light text-white"
                      : i === step
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? "\u2713" : s.icon}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {i < visibleSteps.length - 1 && (
                <div
                  className={`flex-1 h-px mx-1 min-w-2 ${
                    i < step ? "bg-primary-light" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div className="max-w-[800px] mx-auto px-8 pt-7 pb-32">
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-border-light">
          {renderStep()}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light px-8 py-3">
        <div className="max-w-[800px] mx-auto flex justify-between items-center">
          <button
            onClick={() => handleStepChange(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-6 py-2.5 rounded-lg border-[1.5px] border-border bg-white text-sm font-semibold cursor-pointer disabled:text-gray-300 disabled:cursor-default hover:enabled:bg-gray-50 transition-colors"
          >
            &larr; Back
          </button>
          <div className="text-xs text-gray-400">
            Step {step + 1} of {visibleSteps.length}
          </div>
          <button
            onClick={() =>
              handleStepChange(Math.min(visibleSteps.length - 1, step + 1))
            }
            disabled={step === visibleSteps.length - 1}
            className="px-6 py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 disabled:cursor-default hover:enabled:bg-primary-dark transition-colors"
          >
            {step === visibleSteps.length - 2 ? "Review \u2192" : "Next \u2192"}
          </button>
        </div>
      </div>
    </div>
  );
}

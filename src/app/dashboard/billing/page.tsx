"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StripeProvider } from "@/components/stripe/stripe-provider";
import { PaymentMethodForm } from "@/components/stripe/payment-method-form";

export default function BillingPage() {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleUpdatePayment() {
    setLoading(true);
    const res = await fetch("/api/stripe/setup-intent", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setClientSecret(data.clientSecret);
      setShowUpdateForm(true);
    }
    setLoading(false);
  }

  function handleSuccess() {
    setShowUpdateForm(false);
    setClientSecret(null);
  }

  const priceDisplay = `$${(parseInt(process.env.NEXT_PUBLIC_PRICE_PER_CERTIFICATE || "4999", 10) / 100).toFixed(2)}`;

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <DashboardHeader />

      <div className="max-w-[600px] mx-auto px-8 pt-8 pb-16">
        <h2 className="text-xl font-serif font-semibold text-text mb-6">
          Billing
        </h2>

        {/* Pricing info */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-border-light mb-6">
          <h3 className="text-sm font-semibold text-text mb-2">Pricing</h3>
          <p className="text-sm text-text-muted mb-3">
            You are charged <strong className="text-text">{priceDisplay} per certificate</strong> only
            when it is successfully submitted. No monthly fees, no upfront costs.
          </p>
          <div className="bg-primary-bg rounded-lg p-4">
            <p className="text-sm text-primary font-medium">
              Pay-per-certificate pricing ensures you only pay for what you use.
            </p>
          </div>
        </div>

        {/* Payment method */}
        <div className="bg-white rounded-2xl p-7 shadow-sm border border-border-light">
          <h3 className="text-sm font-semibold text-text mb-4">Payment Method</h3>

          {showUpdateForm && clientSecret ? (
            <StripeProvider clientSecret={clientSecret}>
              <PaymentMethodForm onSuccess={handleSuccess} />
            </StripeProvider>
          ) : (
            <button
              onClick={handleUpdatePayment}
              disabled={loading}
              className="px-5 py-2.5 rounded-lg border border-border bg-white text-sm font-semibold text-primary cursor-pointer disabled:bg-gray-100 hover:enabled:bg-primary-bg transition-colors"
            >
              {loading ? "Loading..." : "Update Payment Method"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

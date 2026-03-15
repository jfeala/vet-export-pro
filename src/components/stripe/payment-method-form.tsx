"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

interface Props {
  onSuccess: () => void;
}

export function PaymentMethodForm({ onSuccess }: Props) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: submitError } = await stripe.confirmSetup({
      elements,
      redirect: "if_required",
    });

    if (submitError) {
      setError(submitError.message || "Something went wrong.");
      setProcessing(false);
      return;
    }

    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3 mt-4 border border-red-200">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors mt-6"
      >
        {processing ? "Saving..." : "Save Payment Method & Continue"}
      </button>
    </form>
  );
}

"use client";

import { forwardRef, useImperativeHandle, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { stripePromise } from "@/lib/stripe";

export type StripeFormHandle = {
  confirmPayment: (clientSecret: string) => Promise<void>;
};

type InnerProps = {
  onValidated: () => void;
};

const StripeInner = forwardRef<StripeFormHandle, InnerProps>(function StripeInner({ onValidated }, ref) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useImperativeHandle(ref, () => ({
    async confirmPayment(clientSecret: string) {
      if (!stripe || !elements) throw new Error("Stripe not ready.");
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation`,
        },
        redirect: "if_required",
      });
      if (error) throw new Error(error.message);
    },
  }));

  async function handleSubmit() {
    if (!stripe || !elements) return;
    try {
      setError("");
      setIsSubmitting(true);
      const { error } = await elements.submit();
      if (error) {
        setError(error.message ?? "Please check your payment details.");
        return;
      }
      onValidated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="button"
        onClick={handleSubmit}
        disabled={!stripe || isSubmitting}
        className="mt-2 w-full rounded-xl bg-[#e5b43d] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Validating..." : "Review Order"}
      </button>
    </div>
  );
});

type Props = {
  onValidated: () => void;
  amount: number;
};

const StripePaymentForm = forwardRef<StripeFormHandle, Props>(function StripePaymentForm({ onValidated, amount }, ref) {
  return (
    <Elements
      stripe={stripePromise}
      options={{
        mode: "payment",
        currency: "usd",
        amount: Math.round(amount * 100),
        appearance: {
          theme: "flat",
          variables: {
            borderRadius: "12px",
            colorPrimary: "#e5b43d",
            colorBackground: "#ffffff",
            colorText: "#0a0a0a",
            colorDanger: "#ef4444",
            fontFamily: "inherit",
            spacingUnit: "4px",
          },
          rules: {
            ".Input": {
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "none",
              padding: "12px 16px",
            },
            ".Input:focus": {
              border: "1px solid #e5b43d",
              boxShadow: "0 0 0 3px rgba(229,180,61,0.15)",
              outline: "none",
            },
            ".Label": {
              fontWeight: "600",
              marginBottom: "6px",
            },
            ".Tab": {
              border: "1px solid rgba(0,0,0,0.1)",
              borderRadius: "12px",
            },
            ".Tab--selected": {
              border: "1px solid #e5b43d",
              backgroundColor: "#fff8e7",
            },
          },
        },
      }}
    >
      <StripeInner ref={ref} onValidated={onValidated} />
    </Elements>
  );
});

export default StripePaymentForm;

"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Square?: any;
  }
}

type Props = {
  onTokenized: (result: { sourceId: string }) => void;
  amount: number;
};

export default function SquarePaymentForm({ onTokenized, amount }: Props) {
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const applePayContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<any>(null);
  const applePayRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const amountRef = useRef(amount);

  useEffect(() => { amountRef.current = amount; }, [amount]);

  const [paymentMethod, setPaymentMethod] = useState<"card" | "apple-pay">("card");
  const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState("");
  const [isTokenizing, setIsTokenizing] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function initSquare() {
      if (initializedRef.current) return;

      try {
        const appId = process.env.NEXT_PUBLIC_SQUARE_APP_ID;
        const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID;
        const squareEnv = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox";
        const scriptSrc = squareEnv === "production"
          ? "https://web.squarecdn.com/v1/square.js"
          : "https://sandbox.web.squarecdn.com/v1/square.js";

        if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
          const script = document.createElement("script");
          script.src = scriptSrc;
          script.async = true;
          document.body.appendChild(script);
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
          });
        } else if (!window.Square) {
          await new Promise<void>((resolve) => {
            const interval = setInterval(() => {
              if (window.Square) { clearInterval(interval); resolve(); }
            }, 100);
          });
        }

        if (!window.Square || !appId || !locationId || !cardContainerRef.current) {
          throw new Error("Square failed to initialize.");
        }

        cardContainerRef.current.innerHTML = "";

        const payments = window.Square.payments(appId, locationId);

        const card = await payments.card();
        await card.attach(cardContainerRef.current);
        cardRef.current = card;

        // Try Apple Pay — only available on Safari + HTTPS with domain verification
        try {
          const paymentRequest = payments.paymentRequest({
            countryCode: "US",
            currencyCode: "USD",
            total: { amount: amountRef.current.toFixed(2), label: "El Hilo Co" },
          });
          const applePay = await payments.applePay(paymentRequest);
          applePayRef.current = applePay;

          if (applePayContainerRef.current) {
            applePayContainerRef.current.innerHTML = "";
            await applePay.attach(applePayContainerRef.current);
          }

          if (mounted) setIsApplePayAvailable(true);
        } catch {
          // Apple Pay not supported on this device/browser
        }

        if (!mounted) return;
        initializedRef.current = true;
        setIsReady(true);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Square failed to load.");
      }
    }

    initSquare();

    return () => {
      mounted = false;
      try { cardRef.current?.destroy?.(); } catch {}
      try { applePayRef.current?.destroy?.(); } catch {}
      cardRef.current = null;
      applePayRef.current = null;
      initializedRef.current = false;
      if (cardContainerRef.current) cardContainerRef.current.innerHTML = "";
      if (applePayContainerRef.current) applePayContainerRef.current.innerHTML = "";
    };
  }, []);

  async function handleCardTokenize() {
    try {
      setError("");
      setIsTokenizing(true);
      if (!cardRef.current) throw new Error("Card form is not ready.");
      const result = await cardRef.current.tokenize();
      if (result.status !== "OK") throw new Error("Card tokenization failed.");
      onTokenized({ sourceId: result.token });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to tokenize card.");
    } finally {
      setIsTokenizing(false);
    }
  }

  return (
    <div className="space-y-3">
      {/* Card option */}
      <div className={`rounded-[1.25rem] border p-5 transition ${
        paymentMethod === "card" ? "border-[#e5b43d] bg-[#fff8e7]" : "border-black/10 bg-white"
      }`}>
        <button
          type="button"
          className="flex w-full items-center gap-3 text-left"
          onClick={() => setPaymentMethod("card")}
        >
          <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
            paymentMethod === "card" ? "border-[#e5b43d]" : "border-black/20"
          }`}>
            {paymentMethod === "card" && <div className="h-2 w-2 rounded-full bg-[#e5b43d]" />}
          </div>
          <span className="font-semibold">Pay with new card</span>
        </button>

        {/* Keep in DOM once Square is attached — just visually hide when not selected */}
        <div className={paymentMethod === "card" ? "mt-4" : "hidden"}>
          <div
            ref={cardContainerRef}
            className="min-h-[90px] rounded-xl border border-black/10 bg-white p-4"
          />
          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
          <button
            type="button"
            disabled={!isReady || isTokenizing}
            onClick={handleCardTokenize}
            className="mt-4 w-full rounded-xl bg-[#e5b43d] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isTokenizing ? "Processing..." : "Review Order"}
          </button>
        </div>
      </div>

      {/* Apple Pay option — only shown if available on this device */}
      {isApplePayAvailable && (
        <div className={`rounded-[1.25rem] border p-5 transition ${
          paymentMethod === "apple-pay" ? "border-[#e5b43d] bg-[#fff8e7]" : "border-black/10 bg-white"
        }`}>
          <button
            type="button"
            className="flex w-full items-center gap-3 text-left"
            onClick={() => setPaymentMethod("apple-pay")}
          >
            <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition ${
              paymentMethod === "apple-pay" ? "border-[#e5b43d]" : "border-black/20"
            }`}>
              {paymentMethod === "apple-pay" && <div className="h-2 w-2 rounded-full bg-[#e5b43d]" />}
            </div>
            <span className="font-semibold">Pay with Apple Pay</span>
          </button>

          <div className={paymentMethod === "apple-pay" ? "mt-4" : "hidden"}>
            <div ref={applePayContainerRef} />
          </div>
        </div>
      )}
    </div>
  );
}

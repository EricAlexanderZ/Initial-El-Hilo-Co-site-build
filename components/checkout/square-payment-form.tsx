"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    Square?: any;
  }
}

type SquarePaymentFormProps = {
  onTokenized: (result: { sourceId: string; verificationToken?: string }) => void;
};

export default function SquarePaymentForm({
  onTokenized,
}: SquarePaymentFormProps) {
  const cardContainerRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<any>(null);
  const initializedRef = useRef(false);

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
        const squareEnv =
          process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production"
            ? "production"
            : "sandbox";

        const scriptSrc =
          squareEnv === "production"
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
        }

        if (!window.Square || !appId || !locationId || !cardContainerRef.current) {
          throw new Error("Square failed to initialize.");
        }

        // Clear old DOM before attaching
        cardContainerRef.current.innerHTML = "";

        const payments = window.Square.payments(appId, locationId);
        const card = await payments.card();
        await card.attach(cardContainerRef.current);

        if (!mounted) return;

        cardRef.current = card;
        initializedRef.current = true;
        setIsReady(true);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Square failed to load.");
      }
    }

    initSquare();

    return () => {
      mounted = false;

      try {
        if (cardRef.current?.destroy) {
          cardRef.current.destroy();
        }
      } catch {
        // ignore cleanup errors
      }

      cardRef.current = null;
      initializedRef.current = false;

      if (cardContainerRef.current) {
        cardContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  async function handleTokenize() {
    try {
      setError("");
      setIsTokenizing(true);

      if (!cardRef.current) {
        throw new Error("Card form is not ready.");
      }

      const result = await cardRef.current.tokenize();

      if (result.status !== "OK") {
        throw new Error("Card tokenization failed.");
      }

      onTokenized({
        sourceId: result.token,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to tokenize card.");
    } finally {
      setIsTokenizing(false);
    }
  }

  return (
    <div className="rounded-[1.25rem] border border-black/10 bg-white p-5">
      <h3 className="text-xl font-bold">Card Information</h3>

      <div
        ref={cardContainerRef}
        className="mt-4 min-h-[90px] rounded-xl border border-black/10 p-4"
      />

      {error ? <p className="mt-3 text-sm text-red-500">{error}</p> : null}

      <button
        type="button"
        disabled={!isReady || isTokenizing}
        onClick={handleTokenize}
        className="mt-5 rounded-xl bg-[#e5b43d] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isTokenizing ? "Processing Card..." : "Review Order"}
      </button>
    </div>
  );
}
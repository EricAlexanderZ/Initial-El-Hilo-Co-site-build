"use client";

import { useMemo, useState, useEffect } from "react";
import { TopBanner, SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import CheckoutStep from "@/components/checkout/checkout-step";
import CheckoutSummary from "@/components/checkout/checkout-summary";
import AddressSuggestionModal from "@/components/checkout/address-suggestion-modal";
import SquarePaymentForm from "@/components/checkout/square-payment-form";
import { useCart } from "@/components/cart/cart-provider";
import {
  DEFAULT_SHIPPING_FORM,
  getShippingLabel,
  hasShippingErrors,
  validateShippingForm,
} from "@/lib/checkout";
import type {
  DeliveryMethod,
  ShippingFormData,
  ShippingFormErrors,
  SuggestedAddress,
} from "@/types/checkout";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();

  const [openStep, setOpenStep] = useState(1);

  useEffect(() => {
    const el = document.getElementById(`checkout-step-${openStep}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }, [openStep]);

  const [shippingComplete, setShippingComplete] = useState(false);
  const [deliveryComplete, setDeliveryComplete] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);

  const [deliveryMethods, setDeliveryMethods] = useState<DeliveryMethod[]>([]);
  const [selectedDelivery, setSelectedDelivery] =
    useState<DeliveryMethod | null>(null);

  const [shippingForm, setShippingForm] =
    useState<ShippingFormData>(DEFAULT_SHIPPING_FORM);
  const [shippingErrors, setShippingErrors] =
    useState<ShippingFormErrors>({});
  const [shippingError, setShippingError] = useState("");

  const [showAddressSuggestion, setShowAddressSuggestion] = useState(false);
  const [suggestedAddress, setSuggestedAddress] = useState<SuggestedAddress>({
    name: "",
    line1: "",
    line2: "",
    country: "US",
  });

  const [squareSourceId, setSquareSourceId] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [isLoadingRates, setIsLoadingRates] = useState(false);

  const shippingPrice = selectedDelivery?.price ?? 0;
  const grandTotal = useMemo(
    () => subtotal + shippingPrice,
    [subtotal, shippingPrice]
  );

  // Preload Square script as soon as delivery is confirmed so step 3 loads instantly
  useEffect(() => {
    if (!deliveryComplete) return;
    const squareEnv = process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === "production" ? "production" : "sandbox";
    const scriptSrc = squareEnv === "production"
      ? "https://web.squarecdn.com/v1/square.js"
      : "https://sandbox.web.squarecdn.com/v1/square.js";
    if (!document.querySelector(`script[src="${scriptSrc}"]`)) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.body.appendChild(script);
    }
  }, [deliveryComplete]);

  function updateShippingField<K extends keyof ShippingFormData>(
    name: K,
    value: ShippingFormData[K]
  ) {
    setShippingForm((prev) => ({ ...prev, [name]: value }));
  }

  async function validateAddressWithServer() {
    const res = await fetch("/api/address/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: shippingForm.firstName,
        lastName: shippingForm.lastName,
        address1: shippingForm.address1,
        address2: shippingForm.address2,
        city: shippingForm.city,
        state: shippingForm.state,
        zip: shippingForm.zip,
        country: "US",
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Address validation failed.");
    }

    return data;
  }

  async function fetchLiveShippingRates() {
    const res = await fetch("/api/shipping/rates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: shippingForm.firstName,
        lastName: shippingForm.lastName,
        address1: shippingForm.address1,
        address2: shippingForm.address2,
        city: shippingForm.city,
        state: shippingForm.state,
        zip: shippingForm.zip,
        country: "US",
        totalWeightOz: 16,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Could not load shipping rates.");
    }

    return data.rates as DeliveryMethod[];
  }

  async function completeShippingStep() {
    try {
      setIsLoadingRates(true);
      setShippingError("");

      const rates = await fetchLiveShippingRates();
      setDeliveryMethods(rates);
      setShippingComplete(true);
      setShowAddressSuggestion(false);
      setOpenStep(2);
    } catch (error) {
      setShippingError(
        error instanceof Error
          ? error.message
          : "Could not load shipping rates."
      );
    } finally {
      setIsLoadingRates(false);
    }
  }

  async function saveShipping() {
    const errors = validateShippingForm(shippingForm);
    setShippingErrors(errors);
    setShippingError("");

    if (hasShippingErrors(errors)) return;

    try {
      const validated = await validateAddressWithServer();
      setSuggestedAddress(validated.suggested);
      setShowAddressSuggestion(true);
    } catch {
      await completeShippingStep();
    }
  }

  function saveDelivery() {
    if (!selectedDelivery) return;
    setDeliveryComplete(true);
    setOpenStep(3);
  }

  async function handlePlaceOrder() {
    try {
      setPaymentError("");
      setIsPlacingOrder(true);

      if (!squareSourceId) {
        throw new Error("Please complete the payment step first.");
      }

      if (grandTotal <= 0) {
        throw new Error("Invalid order total.");
      }

      const paymentRes = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceId: squareSourceId,
          amount: grandTotal,
          currency: "USD",
          note: "El Hilo Co checkout payment",
        }),
      });

      const paymentData = await paymentRes.json();
      if (!paymentRes.ok) throw new Error(paymentData?.error || "Payment failed.");

      // Save order to database
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName:  `${shippingForm.firstName} ${shippingForm.lastName}`.trim(),
          customerEmail: shippingForm.email,
          customerPhone: shippingForm.phone,
          shippingAddress: {
            line1: shippingForm.address1,
            line2: shippingForm.address2 || undefined,
            city:  shippingForm.city,
            state: shippingForm.state,
            zip:   shippingForm.zip,
          },
          shippingMethod: selectedDelivery?.label ?? "",
          shippingPrice,
          subtotal,
          total: grandTotal,
          items,
        }),
      });

      if (!orderRes.ok) {
        console.error("[checkout] failed to save order — payment succeeded");
      }

      setSquareSourceId("");
      clearCart();
      window.location.href = "/order-confirmation";
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Payment failed."
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }

  function handlePaymentTokenized({ sourceId }: { sourceId: string }) {
    setSquareSourceId(sourceId);
    setPaymentComplete(true);
    setPaymentError("");
    setOpenStep(4);
  }

  function handleUseSuggestedAddress() {
    setShippingForm((prev) => ({
      ...prev,
      address1: suggestedAddress.line1,
      city: prev.city.toUpperCase(),
      state: prev.state.toUpperCase(),
      zip: prev.zip,
    }));

    void completeShippingStep();
  }

  return (
    <main className="min-h-dvh bg-[#f6f6f4] text-black">
      <TopBanner />
      <SiteHeader />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-center text-3xl font-extrabold tracking-tight sm:text-5xl">
          Checkout
        </h1>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <CheckoutStep
              id="checkout-step-1"
              stepNumber={1}
              title="Shipping Information"
              isOpen={openStep === 1}
              isComplete={shippingComplete}
              onToggle={() => setOpenStep(openStep === 1 ? 0 : 1)}
            >
              <div className="space-y-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Email
                  </label>
                  <input
                    value={shippingForm.email}
                    onChange={(e) =>
                      updateShippingField("email", e.target.value)
                    }
                    className="w-full rounded-xl border border-black/10 bg-[#eef2fb] px-4 py-3"
                  />
                  {shippingErrors.email ? (
                    <p className="mt-2 text-sm text-red-500">
                      {shippingErrors.email}
                    </p>
                  ) : null}
                </div>

                <label className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={shippingForm.subscribe}
                    onChange={(e) =>
                      updateShippingField("subscribe", e.target.checked)
                    }
                  />
                  Subscribe to our deals and reorder emails
                </label>

                <div>
                  <h2 className="text-3xl font-bold">Shipping Address</h2>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      First Name
                    </label>
                    <input
                      value={shippingForm.firstName}
                      onChange={(e) =>
                        updateShippingField("firstName", e.target.value)
                      }
                      className="w-full rounded-xl border border-black/10 bg-[#eef2fb] px-4 py-3"
                    />
                    {shippingErrors.firstName ? (
                      <p className="mt-2 text-sm text-red-500">
                        {shippingErrors.firstName}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Last Name
                    </label>
                    <input
                      value={shippingForm.lastName}
                      onChange={(e) =>
                        updateShippingField("lastName", e.target.value)
                      }
                      className="w-full rounded-xl border border-black/10 bg-[#eef2fb] px-4 py-3"
                    />
                    {shippingErrors.lastName ? (
                      <p className="mt-2 text-sm text-red-500">
                        {shippingErrors.lastName}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Phone
                    </label>
                    <input
                      value={shippingForm.phone}
                      onChange={(e) =>
                        updateShippingField("phone", e.target.value)
                      }
                      className="w-full rounded-xl border border-black/10 bg-[#eef2fb] px-4 py-3"
                    />
                    {shippingErrors.phone ? (
                      <p className="mt-2 text-sm text-red-500">
                        {shippingErrors.phone}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Company
                    </label>
                    <input
                      value={shippingForm.company}
                      onChange={(e) =>
                        updateShippingField("company", e.target.value)
                      }
                      placeholder="Company (optional)"
                      className="w-full rounded-xl border border-black/10 px-4 py-3"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    Street Address
                  </label>
                  <input
                    value={shippingForm.address1}
                    onChange={(e) =>
                      updateShippingField("address1", e.target.value)
                    }
                    className="w-full rounded-xl border border-black/10 bg-[#eef2fb] px-4 py-3"
                  />
                  {shippingErrors.address1 ? (
                    <p className="mt-2 text-sm text-red-500">
                      {shippingErrors.address1}
                    </p>
                  ) : null}
                </div>

                <div>
                  <input
                    value={shippingForm.address2}
                    onChange={(e) =>
                      updateShippingField("address2", e.target.value)
                    }
                    placeholder="Street address 2 (optional)"
                    className="w-full rounded-xl border border-black/10 px-4 py-3"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold">
                    City
                  </label>
                  <input
                    value={shippingForm.city}
                    onChange={(e) =>
                      updateShippingField("city", e.target.value)
                    }
                    className="w-full rounded-xl border border-black/10 bg-[#eef2fb] px-4 py-3"
                  />
                  {shippingErrors.city ? (
                    <p className="mt-2 text-sm text-red-500">
                      {shippingErrors.city}
                    </p>
                  ) : null}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      State
                    </label>
                    <input
                      value={shippingForm.state}
                      onChange={(e) =>
                        updateShippingField("state", e.target.value)
                      }
                      className="w-full rounded-xl border border-black/10 px-4 py-3"
                    />
                    {shippingErrors.state ? (
                      <p className="mt-2 text-sm text-red-500">
                        {shippingErrors.state}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold">
                      Zip Code
                    </label>
                    <input
                      value={shippingForm.zip}
                      onChange={(e) =>
                        updateShippingField("zip", e.target.value)
                      }
                      className="w-full rounded-xl border border-black/10 bg-[#eef2fb] px-4 py-3"
                    />
                    {shippingErrors.zip ? (
                      <p className="mt-2 text-sm text-red-500">
                        {shippingErrors.zip}
                      </p>
                    ) : null}
                  </div>
                </div>

                {shippingError ? (
                  <p className="text-sm text-red-500">{shippingError}</p>
                ) : null}

                <button
                  type="button"
                  onClick={saveShipping}
                  disabled={isLoadingRates}
                  className="rounded-xl bg-[#e5b43d] px-5 py-3 text-sm font-semibold text-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingRates
                    ? "Loading delivery options..."
                    : "Save and Continue to Delivery"}
                </button>
              </div>
            </CheckoutStep>

            <CheckoutStep
              id="checkout-step-2"
              stepNumber={2}
              title="Delivery Method"
              isOpen={openStep === 2}
              isComplete={deliveryComplete}
              isLocked={!shippingComplete}
              onToggle={() =>
                shippingComplete && setOpenStep(openStep === 2 ? 0 : 2)
              }
            >
              <div className="space-y-3">
                {deliveryMethods.map((method) => {
                  const selected = selectedDelivery?.id === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedDelivery(method)}
                      className={`block w-full rounded-xl border px-4 py-4 text-left transition ${
                        selected
                          ? "border-[#e5b43d] bg-[#fff8e7]"
                          : "border-black/10 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{method.label}</span>
                        <span className="font-semibold">
                          {method.price === 0
                            ? "Free"
                            : `$${method.price.toFixed(2)}`}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-500">{method.eta}</p>
                    </button>
                  );
                })}

                <p className="pt-2 text-sm text-gray-500">
                  Delivery dates assume approval within 30 hours. We are closed over the weekends.
                </p>

                <button
                  type="button"
                  onClick={saveDelivery}
                  className="rounded-xl bg-[#e5b43d] px-5 py-3 text-sm font-semibold text-black"
                >
                  Continue to Payment
                </button>
              </div>
            </CheckoutStep>

            <CheckoutStep
              id="checkout-step-3"
              stepNumber={3}
              title="Payment Information"
              isOpen={openStep === 3}
              isComplete={paymentComplete}
              isLocked={!deliveryComplete}
              onToggle={() =>
                deliveryComplete && setOpenStep(openStep === 3 ? 0 : 3)
              }
            >
              <SquarePaymentForm onTokenized={handlePaymentTokenized} amount={grandTotal} />

              {paymentError ? (
                <p className="mt-4 text-sm text-red-500">{paymentError}</p>
              ) : null}

              <p className="mt-3 text-sm text-gray-500">
                Your card details are securely processed by Square. We do not store your card information.
              </p>
            </CheckoutStep>

            <CheckoutStep
              id="checkout-step-4"
              stepNumber={4}
              title="Review Order"
              isOpen={openStep === 4}
              isLocked={!paymentComplete}
              onToggle={() =>
                paymentComplete && setOpenStep(openStep === 4 ? 0 : 4)
              }
            >
              <div className="py-6 text-center">
                <h3 className="text-3xl font-bold">
                  We stitch after you approve — not before.
                </h3>

                <p className="mt-4 max-w-md mx-auto text-base text-gray-600">
                  Once your order is placed, our team will prepare your design proof and send it to your email for review. You'll have the chance to request changes before anything goes into production.
                </p>

                <div className="mt-6 mx-auto max-w-sm space-y-3 rounded-[1.5rem] bg-[#f9f6ee] px-4 py-5 text-left text-sm sm:px-6">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#e5b43d]">✓</span>
                    <p className="text-gray-700">You'll receive a design proof by email. Approve it or request adjustments — we'll make it right.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#e5b43d]">✓</span>
                    <p className="text-gray-700">Your order moves into production only after you give the green light.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-amber-500">⚠</span>
                    <p className="text-gray-700">No response within 5 days? Your proof auto-approves and production begins — so your timeline stays on track.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-[#e5b43d]">✓</span>
                    <p className="text-gray-700">You may cancel at any time before approving your proof.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="mt-8 rounded-xl bg-[#e5b43d] px-8 py-3 text-sm font-bold text-black transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isPlacingOrder ? "Processing..." : "Place Order"}
                </button>

                <p className="mt-4 text-xs text-gray-400">
                  By clicking "Place Order", you agree to our{" "}
                  <a href="/terms" className="underline hover:text-gray-600">Terms of Service</a>{" "}and{" "}
                  <a href="/privacy" className="underline hover:text-gray-600">Privacy Policy</a>.
                </p>
              </div>
            </CheckoutStep>
          </div>

          <CheckoutSummary
            shippingLabel={getShippingLabel(selectedDelivery)}
            shippingPrice={shippingPrice}
          />
        </div>
      </section>

      <AddressSuggestionModal
        isOpen={showAddressSuggestion}
        onClose={() => setShowAddressSuggestion(false)}
        onUseOriginal={completeShippingStep}
        onUseSuggested={handleUseSuggestedAddress}
        original={{
          name: `${shippingForm.firstName} ${shippingForm.lastName}`.trim(),
          line1: shippingForm.address1,
          line2: `${shippingForm.city}, ${shippingForm.state} ${shippingForm.zip}`,
          country: "US",
        }}
        suggested={suggestedAddress}
      />

      <SiteFooter />
    </main>
  );
}
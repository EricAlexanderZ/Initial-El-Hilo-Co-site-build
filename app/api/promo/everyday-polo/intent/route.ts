import { NextResponse } from "next/server";
import Stripe from "stripe";
import { computeOrderAmounts, type PromoCheckoutRequest } from "@/lib/promo/everyday-polo";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Creates the Stripe PaymentIntent for the promo checkout. The charge amount is
// recomputed server-side from the raw config — the client's totals are never trusted.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Pick<PromoCheckoutRequest, "config" | "fulfillment">;

    const amounts = computeOrderAmounts(body.config, body.fulfillment);
    if ("error" in amounts) {
      return NextResponse.json({ error: amounts.error }, { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amounts.total * 100),
      currency: "usd",
      automatic_payment_methods: { enabled: true },
      metadata: { source: "everyday-work-polo" },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      subtotal: amounts.subtotal,
      shippingPrice: amounts.shippingPrice,
      total: amounts.total,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create payment intent" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

const BASE_URL =
  process.env.SQUARE_ENVIRONMENT === "production"
    ? "https://connect.squareup.com"
    : "https://connect.squareupsandbox.com";

export async function POST(req: Request) {
  try {
    const {
      sourceId,
      amount,
      currency = "USD",
      note = "El Hilo Co order",
      verificationToken,
      orderReference,
    } = await req.json();

    const accessToken = process.env.SQUARE_ACCESS_TOKEN;

    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing SQUARE_ACCESS_TOKEN" },
        { status: 500 }
      );
    }

    const body = {
      source_id: sourceId,
      idempotency_key: crypto.randomUUID(),
      amount_money: {
        amount: Math.round(Number(amount) * 100),
        currency,
      },
      autocomplete: true,
      location_id: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
      note,
      reference_id: orderReference || crypto.randomUUID(),
      verification_token: verificationToken || undefined,
    };

    const res = await fetch(`${BASE_URL}/v2/payments`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "Square-Version": "2025-10-16",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.errors?.[0]?.detail || "Payment failed", raw: data },
        { status: res.status }
      );
    }

    return NextResponse.json({
      success: true,
      payment: data.payment,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unexpected payment error",
      },
      { status: 500 }
    );
  }
}
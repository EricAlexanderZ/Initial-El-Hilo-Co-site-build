import { NextResponse } from "next/server";
import { getShippoRates } from "@/lib/shippo";

export async function POST(req: Request) {
  try {
    const {
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      zip,
      country = "US",
      totalWeightOz,
    } = await req.json();

    const rates = await getShippoRates({
      name: `${firstName} ${lastName}`.trim(),
      address1,
      address2,
      city,
      state,
      zip,
      country,
      weightOz: totalWeightOz,
    });

    return NextResponse.json({ rates });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected shipping error",
      },
      { status: 500 }
    );
  }
}
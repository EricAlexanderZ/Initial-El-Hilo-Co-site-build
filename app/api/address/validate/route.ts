import { NextResponse } from "next/server";

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
    } = await req.json();

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing GOOGLE_MAPS_API_KEY" },
        { status: 500 }
      );
    }

    const payload = {
      address: {
        regionCode: country,
        locality: city,
        administrativeArea: state,
        postalCode: zip,
        addressLines: [address1, address2].filter(Boolean),
      },
      enableUspsCass: country === "US" || country === "PR",
    };

    const googleRes = await fetch(
      `https://addressvalidation.googleapis.com/v1:validateAddress?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await googleRes.json();

    if (!googleRes.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Address validation failed." },
        { status: googleRes.status }
      );
    }

    const result = data?.result ?? {};
    const address = result?.address ?? {};
    const uspsData = result?.uspsData ?? {};
    const verdict = result?.verdict ?? {};

    const formattedAddress =
      address?.formattedAddress ||
      [address1, address2, city, state, zip].filter(Boolean).join(", ");

    return NextResponse.json({
      original: {
        name: `${firstName} ${lastName}`.trim(),
        line1: address1 || "",
        line2: [city, state, zip].filter(Boolean).join(", "),
        country,
      },
      suggested: {
        name: `${firstName} ${lastName}`.trim(),
        line1:
          uspsData?.standardizedAddress?.firstAddressLine ||
          formattedAddress.split("\n")[0] ||
          address1 ||
          "",
        line2:
          uspsData?.standardizedAddress?.cityStateZipAddressLine ||
          formattedAddress.split("\n")[1] ||
          [city, state, zip].filter(Boolean).join(", "),
        country,
      },
      meta: {
        addressComplete: verdict?.addressComplete ?? false,
        hasUnconfirmedComponents: verdict?.hasUnconfirmedComponents ?? false,
        hasInferredComponents: verdict?.hasInferredComponents ?? false,
        raw: result,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected server error",
      },
      { status: 500 }
    );
  }
}
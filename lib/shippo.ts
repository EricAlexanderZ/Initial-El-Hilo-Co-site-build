type LiveRate = {
  id: string;
  label: string;
  eta: string;
  price: number;
};

export async function getShippoRates({
  name,
  address1,
  address2,
  city,
  state,
  zip,
  country = "US",
  weightOz,
}: {
  name: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country?: string;
  weightOz: number;
}) {
  const token = process.env.SHIPPO_API_TOKEN;

  if (!token) {
    throw new Error("Missing SHIPPO_API_TOKEN");
  }

  const payload = {
    address_from: {
      name: "El Hilo Co",
      street1: "123 Main St",
      city: "Edinburg",
      state: "TX",
      zip: "78539",
      country: "US",
    },
    address_to: {
      name,
      street1: address1,
      street2: address2 || "",
      city,
      state,
      zip,
      country,
    },
    parcels: [
      {
        length: "10",
        width: "8",
        height: "6",
        distance_unit: "in",
        weight: String(weightOz),
        mass_unit: "oz",
      },
    ],
    async: false,
  };

  const res = await fetch("https://api.goshippo.com/shipments/", {
    method: "POST",
    headers: {
      Authorization: `ShippoToken ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.detail || "Shippo rate request failed");
  }

  const rates = Array.isArray(data?.rates) ? data.rates : [];

  return rates
    .map((rate: any): LiveRate => ({
      id: rate.object_id,
      label: `${rate.provider} ${rate.servicelevel?.name || ""}`.trim(),
      eta: rate.estimated_days
        ? `Estimated Delivery: ${rate.estimated_days} day(s)`
        : "Estimated delivery unavailable",
      price: Number(rate.amount || 0),
    }))
    .sort((a: { price: number }, b: { price: number }) => a.price - b.price);
}
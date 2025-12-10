import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  // MUCH BETTER: use q= instead of city=
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`;

  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  const data = await res.json();

  const results = data.map((item: any) => ({
    city:
      item.address.city ||
      item.address.town ||
      item.address.village ||
      item.address.municipality ||
      item.address.suburb ||
      item.address.county ||
      item.display_name.split(",")[0] || // fallback
      "Unknown",

    country: item.address.country || "",
  }));

  return NextResponse.json({ results });
}

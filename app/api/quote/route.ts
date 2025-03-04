import { getMinInvestment } from "@/lib/api";
import axios from "axios";

const api = axios.create({
  baseURL: "https://brapi.dev/api",
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ticker = searchParams.get("ticker");

  if (!ticker) {
    return new Response("Ticker is required", { status: 400 });
  }

  try {
    const apiKey = process.env.BRAPI_API_KEY;
    const response = await api.get(
      `/quote/${ticker}?range=1d&interval=1d&fundamental=true&token=${apiKey}`
    );

    if (
      response.data &&
      response.data.results &&
      response.data.results.length > 0
    ) {
      const result = response.data.results[0];
      return Response.json({
        price: result.regularMarketPrice,
        minInvestment: getMinInvestment(ticker),
      });
    }

    throw new Error("Asset not found");
  } catch {
    return Response.json(
      { error: "Error fetching asset price" },
      { status: 500 }
    );
  }
}

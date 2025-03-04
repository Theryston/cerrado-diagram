import { DEFAULT_ASSET_CLASSES } from "@/lib/constants";
import { CerradoDiagram } from "@/lib/types";
import { createClient } from "redis";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect();

export async function POST(request: Request) {
  const { code, data } = await request.json();

  if (!code || !data) {
    return new Response("Code and data are required", { status: 400 });
  }

  await client.set(`cerrado-diagram-data-${code}`, data);

  return Response.json({ message: "Data saved" }, { status: 200 });
}

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const code = searchParams.get("code");

  if (!code) {
    return Response.json({ error: "Code is required" }, { status: 400 });
  }

  const data: string | null = await client.get(`cerrado-diagram-data-${code}`);

  const initialData: CerradoDiagram = {
    assetClasses: DEFAULT_ASSET_CLASSES,
    assets: [],
    investments: [],
    totalInvestment: 0,
    contributionAmount: 0,
  };

  if (!data) {
    return Response.json(initialData);
  }

  return Response.json(JSON.parse(data));
}

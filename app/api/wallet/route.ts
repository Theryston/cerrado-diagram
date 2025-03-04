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

  const data = await client.get(`cerrado-diagram-data-${code}`);

  if (!data) {
    return Response.json({ error: "Data not found" }, { status: 404 });
  }

  return Response.json(JSON.parse(data));
}

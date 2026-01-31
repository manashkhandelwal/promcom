import { NextResponse } from "next/server";
import { getMatches } from "../../neo4j.action";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ matches: [] });
  }

  const matches = await getMatches(email);

  return NextResponse.json({ matches });
}

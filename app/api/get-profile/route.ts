import { NextResponse } from "next/server";
import { getUserByEmail } from "../../neo4j.action";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }

  const user = await getUserByEmail(email);

  if (!user) {
    return NextResponse.json({ exists: false }, { status: 404 });
  }

  return NextResponse.json(user);
}

import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose";
import { NextResponse } from "next/server";
import { getUserByID } from "@/app/neo4j.action";

const tenantId = process.env.AZURE_TENANT_ID!;
const clientId = process.env.AZURE_CLIENT_ID!;

interface MicrosoftTokenPayload extends JWTPayload {
  oid?: string;
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
}

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 401 });
  }

  try {
    const JWKS = createRemoteJWKSet(
      new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`)
    );

    const { payload } = await jwtVerify(token, JWKS, {
      audience: clientId,
    });

    const userPayload = payload as MicrosoftTokenPayload;
    const email = userPayload.email || userPayload.preferred_username;

    if (!email || !email.endsWith("@bennett.edu.in")) {
      return NextResponse.json({ error: "Unauthorized email domain" }, { status: 403 });
    }

    const applicationId = userPayload.oid;
    if (!applicationId) {
      return NextResponse.json({ error: "Invalid Microsoft account" }, { status: 400 });
    }

    const user = await getUserByID(applicationId);

    return NextResponse.json({
      user,
      needsProfile: !user,
    });

  } catch (err) {
    console.error("Auth error:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}

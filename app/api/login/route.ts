import { jwtVerify, createRemoteJWKSet, JWTPayload } from "jose";
import { NextResponse } from "next/server";

import { getUserByID, createUser } from "@/app/neo4j.action";
import { Neo4JUser } from "@/types";

const tenantId = process.env.NEXT_PUBLIC_TENANT_ID as string;
const clientId = process.env.NEXT_PUBLIC_AZURE_CLIENT_ID as string;

const JWKS = createRemoteJWKSet(
  new URL(
    `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`
  )
);

interface MicrosoftTokenPayload extends JWTPayload {
  oid?: string; // Microsoft unique user id
  email?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
}

export async function POST(req: Request): Promise<Response> {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 401 }
    );
  }

  try {
    // 🔐 Verify Microsoft JWT
    const { payload } = await jwtVerify(token, JWKS, {
      audience: clientId,
    });

    const userPayload = payload as MicrosoftTokenPayload;

    const email = userPayload.email || userPayload.preferred_username;

    if (!email || !email.endsWith("@bennett.edu.in")) {
      return NextResponse.json(
        { error: "Unauthorized email domain" },
        { status: 403 }
      );
    }

    const applicationId = userPayload.oid;

    if (!applicationId) {
      return NextResponse.json(
        { error: "Invalid Microsoft account" },
        { status: 400 }
      );
    }

    // 🔎 Check if user exists
    let user = await getUserByID(applicationId);

    // 🆕 Create user if not exists
    if (!user) {
      const newUser: Neo4JUser = {
        applicationId,
        firstname: userPayload.given_name || "",
        lastname: userPayload.family_name || "",
        email,
      };

      await createUser(newUser);
      user = newUser;
    }

    // ✅ Auth success
    return NextResponse.json(
      { user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 401 }
    );
  }
}

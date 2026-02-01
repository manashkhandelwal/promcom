import { NextResponse } from "next/server";
import { getUsersWithNoConnection } from "@/app/neo4j.action";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const applicationId = searchParams.get("applicationId");

    if (!applicationId) {
        return NextResponse.json(
            { error: "Missing applicationId" },
            { status: 400 }
        );
    }

    const users = await getUsersWithNoConnection(applicationId);
    return NextResponse.json(users);
}

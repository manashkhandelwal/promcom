import { NextResponse } from "next/server";
import { createUser } from "../../neo4j.action";

export async function POST(req: Request) {
    const body = await req.json();
    await createUser({
        applicationId: body.email, // or auth id
        ...body,
    });

    return NextResponse.json({ success: true });
}

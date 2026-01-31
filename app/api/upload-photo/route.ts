import { NextResponse } from "next/server";
import { updateUser } from "../../neo4j.action";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.age < 18 || body.age > 24) {
    return NextResponse.json(
      { success: false, error: "Age must be between 18 and 24" },
      { status: 400 },
    );
  }

  await updateUser({
    applicationId: body.email,
    fullName: body.fullName,
    age: body.age,
    email: body.email,
    phone: body.phone,
    bio: body.bio,
    hobbies: body.hobbies,
    photoUrl: body.photoUrl,
  });

  return NextResponse.json({ success: true });
}

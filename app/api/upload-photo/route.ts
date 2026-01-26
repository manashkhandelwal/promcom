import { NextResponse } from "next/server";
import cloudinary from "../../../lib/cloudinary";

export async function POST(req: Request) {
    const { base64 } = await req.json();

    const result = await cloudinary.uploader.upload(base64, {
        folder: "students",
    });

    return NextResponse.json({
        photoUrl: result.secure_url,
    });
}

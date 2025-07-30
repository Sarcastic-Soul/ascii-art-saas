import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { asciiArt } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const artId = Number(id);

        if (isNaN(artId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const result = await db
            .select()
            .from(asciiArt)
            .where(eq(asciiArt.id, artId))
            .limit(1);

        if (!result.length) {
            return NextResponse.json({ error: "ASCII art not found" }, { status: 404 });
        }

        const art = result[0];
        return NextResponse.json({
            id: art.id,
            imageName: art.imageName,
            asciiText: art.asciiText,
            createdAt: art.createdAt,
        });
    } catch (error) {
        console.error("Error fetching ASCII art:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

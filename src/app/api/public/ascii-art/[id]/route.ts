import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/drizzle";
import { asciiArt } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const artId = parseInt(id);

        if (isNaN(artId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        // Fetch only public ASCII art
        const [art] = await db
            .select()
            .from(asciiArt)
            .where(and(eq(asciiArt.id, artId), eq(asciiArt.isPublic, true)));

        if (!art) {
            return NextResponse.json({ error: "ASCII art not found or not public" }, { status: 404 });
        }

        return NextResponse.json(art);
    } catch (error) {
        console.error("Error fetching public ASCII art:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

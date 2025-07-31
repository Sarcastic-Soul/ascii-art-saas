import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { asciiArt } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const artId = parseInt(id);

        if (isNaN(artId)) {
            return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
        }

        const { isPublic } = await request.json();

        // Update only if the user owns the ASCII art
        const result = await db
            .update(asciiArt)
            .set({ isPublic })
            .where(and(eq(asciiArt.id, artId), eq(asciiArt.userId, userId)))
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: "ASCII art not found or access denied" }, { status: 404 });
        }

        return NextResponse.json({ success: true, isPublic });
    } catch (error) {
        console.error("Error updating ASCII art:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

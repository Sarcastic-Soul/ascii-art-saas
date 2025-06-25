// app/api/ascii-art/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { asciiArt } from "@/db/schema";
import { and, eq, ilike } from "drizzle-orm";

export async function GET(req: Request) {
    try {
        const { userId } = await auth();   // ← add await here!

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search");

        // Build basic user filter
        const userFilter = eq(asciiArt.userId, userId);

        // If there’s a search term, add ilike; otherwise just use the user filter
        const whereClause = search
            ? and(userFilter, ilike(asciiArt.imageName, `%${search}%`))
            : userFilter;

        const arts = await db
            .select()
            .from(asciiArt)
            .where(whereClause)
            .orderBy(asciiArt.createdAt);

        return NextResponse.json({ arts });
    } catch (error) {
        console.error("Error in /api/ascii-art:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

"use server";

import { db } from "@/db/drizzle";
import { asciiArt } from "@/db/schema";
import { and, eq, desc, like } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

// Paginated fetch with optional search
export const getAsciiArtHistory = async ({
    userId,
    search = "",
    page = 1,
    limit = 6,
}: {
    userId: string;
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const offset = (page - 1) * limit;

    const whereClause = and(
        eq(asciiArt.userId, userId),
        search ? like(asciiArt.imageName, `%${search}%`) : undefined
    );

    const [arts, [{ count }]] = await Promise.all([
        db
            .select()
            .from(asciiArt)
            .where(whereClause)
            .orderBy(desc(asciiArt.createdAt))
            .limit(limit)
            .offset(offset),

        db
            .select({ count: sql<number>`count(*)` })
            .from(asciiArt)
            .where(whereClause),
    ]);

    return { arts, total: Number(count) };
};

export const addAsciiArt = async ({
    userId,
    imageName,
    asciiText,
}: {
    userId: string;
    imageName: string;
    asciiText: string;
}) => {
    await db.insert(asciiArt).values({ userId, imageName, asciiText });
    revalidatePath("/dashboard");
};

export const deleteAsciiArt = async (id: number) => {
    await db.delete(asciiArt).where(eq(asciiArt.id, id));
    revalidatePath("/dashboard");
};

export const toggleAsciiArtPublic = async (id: number, isPublic: boolean) => {
    await db.update(asciiArt)
        .set({ isPublic })
        .where(eq(asciiArt.id, id));
    revalidatePath("/dashboard");
};

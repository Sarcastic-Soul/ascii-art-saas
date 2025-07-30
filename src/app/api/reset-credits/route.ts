// app/api/reset-credits/route.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
    if (process.env.NODE_ENV === "production") {
        return new Response("❌ Not allowed in production", { status: 403 });
    }

    const { userId } = await auth();
    if (!userId) {
        return new Response("Unauthorized", { status: 401 });
    }

    try {
        await db.update(users)
            .set({
                dailyCreditsUsed: 0,
                lastCreditReset: new Date(),
            })
            .where(eq(users.id, userId));

        return new Response("✅ Daily credits reset");
    } catch (error) {
        console.error("Failed to reset credits:", error);
        return new Response("Failed to reset credits", { status: 500 });
    }
}

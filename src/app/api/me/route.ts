// app/api/me/route.ts
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return new Response("Not found", { status: 404 });

    return Response.json({
        isSubscribed: user.isSubscribed,
        dailyCreditsUsed: user.dailyCreditsUsed,
    });
}

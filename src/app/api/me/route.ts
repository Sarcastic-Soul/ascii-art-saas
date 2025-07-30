// app/api/me/route.ts
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
    const { userId } = await auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    // Get user from DB, create if doesn't exist (for development)
    let [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) {
        console.log("User not found in database, creating:", userId);
        // In development, automatically create user record
        try {
            // Get user email from Clerk
            const client = await clerkClient();
            const clerkUser = await client.users.getUser(userId);
            const email = clerkUser.emailAddresses[0]?.emailAddress || "temp@example.com";

            await db.insert(users).values({
                id: userId,
                email: email,
                isSubscribed: false,
                dailyCreditsUsed: 0,
                lastCreditReset: new Date(),
            });
            // Fetch the newly created user
            [user] = await db.select().from(users).where(eq(users.id, userId));
        } catch (error: any) {
            // If user already exists (race condition), just fetch it
            if (error.code === '23505') {
                console.log("User already exists (race condition), fetching:", userId);
                [user] = await db.select().from(users).where(eq(users.id, userId));
            } else {
                console.error("Failed to create user:", error);
                return new Response("Failed to create user", { status: 500 });
            }
        }
    }

    return Response.json({
        isSubscribed: user.isSubscribed,
        dailyCreditsUsed: user.dailyCreditsUsed,
    });
}

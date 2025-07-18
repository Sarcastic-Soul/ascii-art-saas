// app/api/register/route.ts
import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export async function POST(req: Request) {
    if (process.env.NODE_ENV === "production") {
        return new Response("❌ Not allowed in production", { status: 403 });
    }

    const { email } = await req.json();

    const matchingUsers = await clerkClient.users.getUserList({ emailAddress: [email] });

    if (!matchingUsers.length) {
        return new Response("User not found in Clerk", { status: 404 });
    }

    const userId = matchingUsers[0].id;

    console.log("DEV user registration:", { email, userId });

    if (!userId || !email) {
        return new Response("Missing userId or email", { status: 400 });
    }

    try {
        await db.insert(users).values({
            id: userId,
            email,
            isSubscribed: false,
        });

        return new Response("✅ User manually registered in dev");
    } catch (err) {
        console.error("Manual register failed:", err);
        return new Response("DB insert error", { status: 500 });
    }
}
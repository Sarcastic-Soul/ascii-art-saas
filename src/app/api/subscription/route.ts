// app/api/subscribe/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// POST: Start/renew subscription
export async function POST() {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // ⛔️ Dummy payment logic placeholder
        const paymentSuccess = true; // Imagine this was result from Stripe/Razorpay/etc.
        if (!paymentSuccess) {
            return NextResponse.json({ error: "Payment failed" }, { status: 402 });
        }

        const subscriptionEnds = new Date();
        subscriptionEnds.setMonth(subscriptionEnds.getMonth() + 1);

        await db
            .update(users)
            .set({
                isSubscribed: true,
                subscriptionEnds,
            })
            .where(eq(users.id, userId));

        return NextResponse.json({
            message: "Subscribed Successfully",
            subscriptionEnds,
        });
    } catch (error) {
        console.error("Error updating subscription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// GET: Check subscription status
export async function GET() {
    const { userId } = auth();

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await db.query.users.findFirst({
            where: eq(users.id, userId),
            columns: {
                isSubscribed: true,
                subscriptionEnds: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const now = new Date();

        // ⏳ Expired subscription check
        if (user.subscriptionEnds && user.subscriptionEnds < now) {
            await db
                .update(users)
                .set({
                    isSubscribed: false,
                    subscriptionEnds: null,
                })
                .where(eq(users.id, userId));

            return NextResponse.json({
                isSubscribed: false,
                subscriptionEnds: null,
            });
        }

        return NextResponse.json({
            isSubscribed: user.isSubscribed,
            subscriptionEnds: user.subscriptionEnds,
        });
    } catch (error) {
        console.error("Error retrieving subscription:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

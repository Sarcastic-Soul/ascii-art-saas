import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { asciiArt, users } from "@/db/schema";
import { db } from "@/db/drizzle";
import { uploadImageAndConvertToAscii, getImageDimensions } from "@/lib/ascii";
import { eq } from "drizzle-orm";
import { format, isSameDay } from "date-fns";

export const POST = async (req: NextRequest) => {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Get user from DB, create if doesn't exist (for development)
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
                return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
            }
        }
    }

    const now = new Date();
    const lastReset = user.lastCreditReset;

    // 2. Reset daily credits if last reset was before today
    if (!lastReset || !isSameDay(new Date(lastReset), now)) {
        await db.update(users)
            .set({
                dailyCreditsUsed: 0,
                lastCreditReset: now,
            })
            .where(eq(users.id, userId));
        user.dailyCreditsUsed = 0; // reflect locally
    }

    // 3. Read and validate form data
    const form = await req.formData();
    const file = form.get("file") as File;
    const imageName = form.get("imageName") as string;
    const width = form.get("width") ? parseInt(form.get("width") as string) : undefined;
    const height = form.get("height") ? parseInt(form.get("height") as string) : undefined;
    const chars = (form.get("chars") as string) || "@%#*+=-:. ";
    const isPreview = form.get("preview") === "true";
    const maintainOriginalSize = form.get("maintainOriginalSize") !== "false"; // default to true
    const sizeMultiplier = form.get("sizeMultiplier") ? parseFloat(form.get("sizeMultiplier") as string) : 1.0;

    if (!file || !imageName) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 4. Check usage limits (only for non-preview requests)
    const dailyLimit = process.env.NODE_ENV === "development" ? 10 : 5; // Higher limit in dev
    if (!isPreview && !user.isSubscribed && user.dailyCreditsUsed >= dailyLimit) {
        console.log("Daily limit reached for user:", userId, "Credits used:", user.dailyCreditsUsed);
        return NextResponse.json(
            { error: `Daily free limit reached (${user.dailyCreditsUsed}/${dailyLimit}). Come back tomorrow or upgrade.` },
            { status: 403 }
        );
    }

    // 5. Process image
    const buffer = Buffer.from(await file.arrayBuffer());
    const asciiText = await uploadImageAndConvertToAscii(buffer, width, chars, height, maintainOriginalSize, sizeMultiplier);

    // 6. If this is just a preview, return the ASCII without saving
    if (isPreview) {
        return NextResponse.json({ asciiText });
    }

    // 7. Save result
    await db.insert(asciiArt).values({
        userId,
        imageName,
        asciiText,
    });

    // 8. Increment daily credits
    await db.update(users)
        .set({
            dailyCreditsUsed: user.dailyCreditsUsed + 1,
            lastCreditReset: now,
        })
        .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
};

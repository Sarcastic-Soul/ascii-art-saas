import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { asciiArt, users } from "@/db/schema";
import { db } from "@/db/drizzle";
import { uploadImageAndConvertToAscii } from "@/lib/ascii";
import { eq } from "drizzle-orm";
import { format, isSameDay } from "date-fns";

export const POST = async (req: NextRequest) => {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // 1. Get user from DB
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

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

    // 3. Check usage limits
    if (!user.isSubscribed && user.dailyCreditsUsed >= 3) {
        return NextResponse.json(
            { error: "Daily free limit reached. Come back tomorrow or upgrade." },
            { status: 403 }
        );
    }

    // 4. Read and validate form data
    const form = await req.formData();
    const file = form.get("file") as File;
    const imageName = form.get("imageName") as string;
    const width = parseInt(form.get("width") as string) || 100;
    const chars = (form.get("chars") as string) || "@%#*+=-:. ";

    if (!file || !imageName) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 5. Process image
    const buffer = Buffer.from(await file.arrayBuffer());
    const asciiText = await uploadImageAndConvertToAscii(buffer, width, chars);

    // 6. Save result
    await db.insert(asciiArt).values({
        userId,
        imageName,
        asciiText,
    });

    // 7. Increment daily credits
    await db.update(users)
        .set({
            dailyCreditsUsed: user.dailyCreditsUsed + 1,
            lastCreditReset: now,
        })
        .where(eq(users.id, userId));

    return NextResponse.json({ success: true });
};

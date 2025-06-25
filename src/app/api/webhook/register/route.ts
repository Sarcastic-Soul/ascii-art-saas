// app/api/webhooks/user/route.ts
import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db/drizzle";
import { users } from "@/db/schema";

export async function POST(req: Request) {
    const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error("Please add webhook secret in .env");
    }

    const headerPayload = headers();
    const svix_id = headerPayload.get("svix-id");
    const svix_timestamp = headerPayload.get("svix-timestamp");
    const svix_signature = headerPayload.get("svix-signature");

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Missing Svix headers", { status: 400 });
    }

    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log("Webhook payload:", payload)

    const wh = new Webhook(WEBHOOK_SECRET);
    let evt: WebhookEvent;

    try {
        evt = wh.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error("Webhook verification failed", err);
        return new Response("Invalid signature", { status: 400 });
    }

    if (evt.type === "user.created") {
        const { email_addresses, primary_email_address_id } = evt.data;

        const primaryEmail = email_addresses.find(
            (email) => email.id === primary_email_address_id
        );

        if (!primaryEmail) {
            return new Response("Primary email not found", { status: 400 });
        }

        try {
            await db.insert(users).values({
                id: evt.data.id!,
                email: primaryEmail.email_address,
                isSubscribed: false,
            });

            console.log("✅ New user inserted with Drizzle:", primaryEmail.email_address);
        } catch (error) {
            console.error("❌ Failed to insert user:", error);
            return new Response("Error creating user in DB", { status: 500 });
        }
    }

    return new Response("Webhook received successfully", { status: 200 });
}

import { clerkClient } from "@clerk/nextjs/server";

async function isAdmin(userId: string) {
    const user = await clerkClient.users.getUser(userId);
    return user.privateMetadata.role === "admin"
}

// TODO: write all the priviledge functions for admin like search all users, monitor stats, etc
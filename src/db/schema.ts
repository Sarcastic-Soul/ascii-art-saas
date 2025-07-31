// db/schema.ts
import { boolean, date, integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const asciiArt = pgTable("ascii_art", {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 255 }).notNull(), // Clerk user ID
    imageName: varchar("image_name", { length: 255 }).notNull(),
    asciiText: text("ascii_text").notNull(),
    isPublic: boolean("is_public").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

export const users = pgTable("users", {
    id: varchar("id", { length: 255 }).primaryKey(), // Clerk ID
    email: varchar("email", { length: 255 }).notNull(),
    isSubscribed: boolean("is_subscribed").default(false).notNull(),
    subscriptionEnds: timestamp("subscription_ends", { mode: "date" }),
    dailyCreditsUsed: integer("daily_credits_used").default(0).notNull(),
    lastCreditReset: timestamp("last_credit_reset", { mode: "date" }),
});

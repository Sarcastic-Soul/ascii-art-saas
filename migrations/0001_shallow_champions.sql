ALTER TABLE "users" ADD COLUMN "daily_credits_used" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "last_credit_reset" timestamp;
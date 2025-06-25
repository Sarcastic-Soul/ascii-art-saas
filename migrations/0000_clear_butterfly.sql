CREATE TABLE "ascii_art" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"image_name" varchar(255) NOT NULL,
	"ascii_text" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"is_subscribed" boolean DEFAULT false NOT NULL,
	"subscription_ends" timestamp
);

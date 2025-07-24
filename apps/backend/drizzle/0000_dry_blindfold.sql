CREATE TABLE "agenda" (
	"id" text PRIMARY KEY NOT NULL,
	"event_id" text NOT NULL,
	"start" text NOT NULL,
	"end" text NOT NULL,
	"person_in_charge" text NOT NULL,
	"duration" integer NOT NULL,
	"activity" text NOT NULL,
	"remarks" text DEFAULT '',
	"actual_end_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"location" text NOT NULL,
	"description" text,
	"created_by" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"avatar_url" text DEFAULT '' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

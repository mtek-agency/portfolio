CREATE TABLE "posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"excerpt" text,
	"content" text DEFAULT '' NOT NULL,
	"cover_image" text,
	"tags" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX "posts_status_idx" ON "posts" ("status");
CREATE INDEX "posts_slug_idx" ON "posts" ("slug");

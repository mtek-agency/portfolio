CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"urlWebsite" text,
	"urlRepository" text,
	"year" text NOT NULL,
	"tags" text,
	"slug" text NOT NULL,
	"stack" text,
	"isDisabled" text DEFAULT 'false' NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);

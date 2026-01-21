CREATE TABLE "project_images" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"url" text NOT NULL,
	"filename" text NOT NULL,
	"mimeType" text,
	"size" integer,
	"order" integer DEFAULT 0,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "project_images" ADD CONSTRAINT "project_images_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
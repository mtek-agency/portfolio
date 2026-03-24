CREATE TABLE "project_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"viewedAt" timestamp DEFAULT now() NOT NULL
);
ALTER TABLE "project_views" ADD CONSTRAINT "project_views_projectId_projects_id_fk"
  FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "project_views_projectId_idx" ON "project_views" ("projectId");
CREATE INDEX "project_views_viewedAt_idx" ON "project_views" ("viewedAt");

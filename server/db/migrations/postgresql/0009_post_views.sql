CREATE TABLE "post_views" (
	"id" serial PRIMARY KEY NOT NULL,
	"postId" integer NOT NULL,
	"viewedAt" timestamp DEFAULT now() NOT NULL
);
ALTER TABLE "post_views" ADD CONSTRAINT "post_views_postId_posts_id_fk"
  FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE cascade ON UPDATE no action;
CREATE INDEX "post_views_postId_idx" ON "post_views" ("postId");
CREATE INDEX "post_views_viewedAt_idx" ON "post_views" ("viewedAt");

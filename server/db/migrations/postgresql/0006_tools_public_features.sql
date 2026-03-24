ALTER TABLE "tools" ADD COLUMN "isPublic" boolean DEFAULT false NOT NULL;
ALTER TABLE "tools" ADD COLUMN "isDailyDriver" boolean DEFAULT false NOT NULL;
ALTER TABLE "tools" ADD COLUMN "clicks" integer DEFAULT 0 NOT NULL;
ALTER TABLE "projects" ADD COLUMN "isDisabled_temp" boolean;
UPDATE "projects" SET "isDisabled_temp" =
                          CASE
                              WHEN "isDisabled" = 'true' THEN true
                              ELSE false
                              END;
ALTER TABLE "projects" DROP COLUMN "isDisabled";
ALTER TABLE "projects" RENAME COLUMN "isDisabled_temp" TO "isDisabled";
ALTER TABLE "projects" ALTER COLUMN "isDisabled" SET DEFAULT false;
ALTER TABLE "projects" ALTER COLUMN "isDisabled" SET NOT NULL;
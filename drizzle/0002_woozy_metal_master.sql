ALTER TABLE "permissions" ALTER COLUMN "role_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "role_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "role_permissions" ALTER COLUMN "permission_id" SET NOT NULL;
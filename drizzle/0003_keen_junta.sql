ALTER TABLE "permissions" DROP CONSTRAINT "permissions_role_id_roles_id_fk";
--> statement-breakpoint
ALTER TABLE "permissions" DROP COLUMN "role_id";
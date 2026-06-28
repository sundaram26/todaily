CREATE TABLE "verification_tokens" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "verification_tokens_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" uuid NOT NULL,
	"verification_token" varchar(255) NOT NULL,
	"token_expiry" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "otps" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."otp_type";--> statement-breakpoint
CREATE TYPE "public"."otp_type" AS ENUM('password_reset');--> statement-breakpoint
ALTER TABLE "otps" ALTER COLUMN "type" SET DATA TYPE "public"."otp_type" USING "type"::"public"."otp_type";--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
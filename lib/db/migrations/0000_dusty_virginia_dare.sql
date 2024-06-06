CREATE TABLE IF NOT EXISTS "items" (
	"id" varchar(191) PRIMARY KEY NOT NULL,
	"content" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

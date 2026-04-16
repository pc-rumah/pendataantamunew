CREATE TABLE "aspirations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"email" varchar(255) NOT NULL,
	"kategori" text NOT NULL,
	"judul" text NOT NULL,
	"isi" text NOT NULL,
	"tanggal" date NOT NULL,
	"status" text DEFAULT 'baru' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

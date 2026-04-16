CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nama" text NOT NULL,
	"nik" varchar(16) NOT NULL,
	"alamat" text NOT NULL,
	"no_telp" varchar(20) NOT NULL,
	"tanggal" date NOT NULL,
	"instansi" text,
	"tujuan" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

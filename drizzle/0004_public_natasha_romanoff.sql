CREATE TABLE "students" (
	"id" integer PRIMARY KEY NOT NULL,
	"registration_no" text NOT NULL,
	"admission_date" date NOT NULL,
	"dob" date,
	"gender" text,
	"guardian_name" text,
	"contact_no" text,
	"address" text,
	"b_form" text,
	"cnic" text,
	CONSTRAINT "students_registration_no_unique" UNIQUE("registration_no"),
	CONSTRAINT "students_b_form_unique" UNIQUE("b_form"),
	CONSTRAINT "students_cnic_unique" UNIQUE("cnic")
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"level" text
);
--> statement-breakpoint
CREATE TABLE "student_class_enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer,
	"class_id" integer,
	"section_id" integer,
	"year" integer NOT NULL,
	"status" text,
	"promoted_to_class_id" integer
);
--> statement-breakpoint
CREATE TABLE "student_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"student_id" integer,
	"type" text,
	"file_path" text NOT NULL,
	"uploaded_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer,
	"name" text NOT NULL,
	"description" text
);
--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class_enrollments" ADD CONSTRAINT "student_class_enrollments_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class_enrollments" ADD CONSTRAINT "student_class_enrollments_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class_enrollments" ADD CONSTRAINT "student_class_enrollments_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_class_enrollments" ADD CONSTRAINT "student_class_enrollments_promoted_to_class_id_classes_id_fk" FOREIGN KEY ("promoted_to_class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_documents" ADD CONSTRAINT "student_documents_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_class_id_classes_id_fk" FOREIGN KEY ("class_id") REFERENCES "public"."classes"("id") ON DELETE no action ON UPDATE no action;
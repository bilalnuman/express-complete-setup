import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { students } from "./students";

export const student_documents = pgTable("student_documents", {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => students.id),
    type: text('type'),
    filePath: text('file_path').notNull(),
    uploadedAt: timestamp('uploaded_at').defaultNow(),
})

export type StudentDocument = typeof student_documents.$inferSelect;
export type NewStudentDocument = typeof student_documents.$inferInsert
import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { students } from "./students";
import { classes } from "./classes";
import { sections } from "./sections";

export const student_class_enrollments = pgTable("student_class_enrollments", {
    id: serial('id').primaryKey(),
    studentId: integer('student_id').references(() => students.id),
    classId: integer('class_id').references(() => classes.id),
    sectionId: integer('section_id').references(() => sections.id),
    year: integer('year').notNull(),
    status: text('status'),
    promotedToClassId: integer('promoted_to_class_id').references(() => classes.id),
})

export type StudentClassEnrollment = typeof student_class_enrollments.$inferSelect;
export type NewsStudentClassEnrollment = typeof student_class_enrollments.$inferInsert
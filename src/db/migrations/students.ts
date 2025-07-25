import { pgTable, integer, text, date } from "drizzle-orm/pg-core";
import { users } from "./users";

export const students = pgTable("students", {
    id: integer('id').primaryKey().references(() => users.id),
    registrationNo: text('registration_no').unique().notNull(),
    dateOfAdmission: date('admission_date').notNull(),
    dateOfBirth: date('dob'),
    gender: text('gender'),
    guardianName: text('guardian_name'),
    contactNo: text('contact_no'),
    address: text('address'),
    bFormNumber: text('b_form').unique(),
    cnic: text('cnic').unique(),
})

export type Student = typeof students.$inferSelect;
export type NewStudent = typeof students.$inferInsert
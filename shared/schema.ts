import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").default("user").notNull(),
  email: text("email").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
});

export const analyses = pgTable("analyses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  jobTitle: text("job_title").notNull(),
  department: text("department"),
  jobDescription: text("job_description").notNull(),
  createdById: integer("created_by_id").notNull(),
  status: text("status").default("queued").notNull(), // queued, processing, completed, failed
  candidateCount: integer("candidate_count").default(0).notNull(),
  averageScore: integer("average_score"),
  filters: jsonb("filters"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertAnalysisSchema = createInsertSchema(analyses).pick({
  name: true,
  jobTitle: true,
  department: true,
  jobDescription: true,
  filters: true,
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  analysisId: integer("analysis_id").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  location: text("location"),
  experience: text("experience"),
  education: text("education"),
  skills: jsonb("skills"),
  matchScore: integer("match_score").notNull(),
  resumeText: text("resume_text"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertCandidateSchema = createInsertSchema(candidates).pick({
  analysisId: true,
  name: true,
  email: true,
  phone: true,
  location: true,
  experience: true,
  education: true,
  skills: true,
  matchScore: true,
  resumeText: true,
});

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").default("info").notNull(),
  isRead: boolean("is_read").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  relatedId: integer("related_id"),
  relatedType: text("related_type"),
});

export const insertNotificationSchema = createInsertSchema(notifications).pick({
  userId: true,
  title: true,
  message: true,
  type: true,
  relatedId: true,
  relatedType: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Analysis = typeof analyses.$inferSelect;
export type InsertAnalysis = z.infer<typeof insertAnalysisSchema>;
export type Candidate = typeof candidates.$inferSelect;
export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

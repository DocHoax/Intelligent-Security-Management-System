import { z } from "zod";
import { incidentPriorities, incidentTypes, roles, visitorStatuses } from "./constants.js";

export const roleSchema = z.enum(roles);

export const registerSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phoneNumber: z.string().min(7).optional(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
  role: roleSchema
}).refine((value) => value.password === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  rememberMe: z.boolean().optional().default(false)
});

export const forgotPasswordSchema = z.object({
  email: z.string().email()
});

export const verifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  newPassword: z.string().min(8),
  confirmPassword: z.string().min(8)
}).refine((value) => value.newPassword === value.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

export const incidentCreateSchema = z.object({
  type: z.enum(incidentTypes),
  title: z.string().min(3),
  description: z.string().min(10),
  location: z.string().min(2),
  priority: z.enum(incidentPriorities).default("medium"),
  occurredAt: z.string().datetime().optional()
});

export const visitorCheckInSchema = z.object({
  fullName: z.string().min(2),
  host: z.string().min(2),
  purpose: z.string().min(2),
  status: z.enum(visitorStatuses).default("checked-in")
});

export const broadcastNotificationSchema = z.object({
  title: z.string().min(3),
  message: z.string().min(5)
});

export const reportGenerateSchema = z.object({
  title: z.string().min(3),
  format: z.enum(["pdf", "excel", "csv"])
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type IncidentCreateInput = z.infer<typeof incidentCreateSchema>;
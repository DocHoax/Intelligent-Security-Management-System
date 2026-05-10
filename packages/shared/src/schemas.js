"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportGenerateSchema = exports.broadcastNotificationSchema = exports.visitorCheckInSchema = exports.incidentCreateSchema = exports.verifyOtpSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.registerSchema = exports.roleSchema = void 0;
const zod_1 = require("zod");
const constants_1 = require("./constants");
exports.roleSchema = zod_1.z.enum(constants_1.roles);
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    email: zod_1.z.string().email(),
    phoneNumber: zod_1.z.string().min(7).optional(),
    password: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(8),
    role: exports.roleSchema
}).refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    rememberMe: zod_1.z.boolean().optional().default(false)
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
exports.verifyOtpSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    otp: zod_1.z.string().length(6),
    newPassword: zod_1.z.string().min(8),
    confirmPassword: zod_1.z.string().min(8)
}).refine((value) => value.newPassword === value.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"]
});
exports.incidentCreateSchema = zod_1.z.object({
    type: zod_1.z.enum(constants_1.incidentTypes),
    title: zod_1.z.string().min(3),
    description: zod_1.z.string().min(10),
    location: zod_1.z.string().min(2),
    priority: zod_1.z.enum(constants_1.incidentPriorities).default("medium"),
    occurredAt: zod_1.z.string().datetime().optional()
});
exports.visitorCheckInSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(2),
    host: zod_1.z.string().min(2),
    purpose: zod_1.z.string().min(2),
    status: zod_1.z.enum(constants_1.visitorStatuses).default("checked-in")
});
exports.broadcastNotificationSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    message: zod_1.z.string().min(5)
});
exports.reportGenerateSchema = zod_1.z.object({
    title: zod_1.z.string().min(3),
    format: zod_1.z.enum(["pdf", "excel", "csv"])
});

export const roles = ["admin", "security-personnel", "staff", "visitor"];

export const incidentTypes = [
  "theft",
  "fire",
  "suspicious-activity",
  "violence",
  "medical-emergency",
  "unauthorized-access"
];

export const incidentPriorities = ["low", "medium", "high", "critical"];

export const visitorStatuses = ["pending", "checked-in", "checked-out", "rejected"];

export const reportFormats = ["pdf", "excel", "csv"];

export const notificationChannels = ["in-app", "email", "sms", "web-socket"];

export const dashboardRoutes = {
  admin: "/dashboard/admin",
  securityPersonnel: "/dashboard/security-personnel",
  staff: "/dashboard/staff",
  visitor: "/dashboard/visitor"
};
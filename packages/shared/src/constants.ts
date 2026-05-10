export const roles = ["admin", "security-personnel", "staff", "visitor"] as const;

export const incidentTypes = [
  "theft",
  "fire",
  "suspicious-activity",
  "violence",
  "medical-emergency",
  "unauthorized-access"
] as const;

export const incidentPriorities = ["low", "medium", "high", "critical"] as const;

export const visitorStatuses = ["pending", "checked-in", "checked-out", "rejected"] as const;

export const reportFormats = ["pdf", "excel", "csv"] as const;

export const notificationChannels = ["in-app", "email", "sms", "web-socket"] as const;

export const dashboardRoutes = {
  admin: "/dashboard/admin",
  securityPersonnel: "/dashboard/security-personnel",
  staff: "/dashboard/staff",
  visitor: "/dashboard/visitor"
} as const;
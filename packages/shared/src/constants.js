"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRoutes = exports.notificationChannels = exports.reportFormats = exports.visitorStatuses = exports.incidentPriorities = exports.incidentTypes = exports.roles = void 0;
exports.roles = ["admin", "security-personnel", "staff", "visitor"];
exports.incidentTypes = [
    "theft",
    "fire",
    "suspicious-activity",
    "violence",
    "medical-emergency",
    "unauthorized-access"
];
exports.incidentPriorities = ["low", "medium", "high", "critical"];
exports.visitorStatuses = ["pending", "checked-in", "checked-out", "rejected"];
exports.reportFormats = ["pdf", "excel", "csv"];
exports.notificationChannels = ["in-app", "email", "sms", "web-socket"];
exports.dashboardRoutes = {
    admin: "/dashboard/admin",
    securityPersonnel: "/dashboard/security-personnel",
    staff: "/dashboard/staff",
    visitor: "/dashboard/visitor"
};

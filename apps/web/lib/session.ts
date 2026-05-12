import { dashboardRoutes } from "@isms/shared/constants";
import { roles } from "@isms/shared/constants";

export type AuthRole = (typeof roles)[number];

export function persistAuthSession(accessToken: string, refreshToken: string) {
  window.localStorage.setItem("isms-access-token", accessToken);
  window.localStorage.setItem("isms-refresh-token", refreshToken);
}

export function getStoredAccessToken() {
  return window.localStorage.getItem("isms-access-token");
}

export function getStoredRefreshToken() {
  return window.localStorage.getItem("isms-refresh-token");
}

export function getDashboardPath(role: string) {
  const normalizedRole = role as AuthRole;

  switch (normalizedRole) {
    case "admin":
      return dashboardRoutes.admin;
    case "security-personnel":
      return dashboardRoutes.securityPersonnel;
    case "staff":
      return dashboardRoutes.staff;
    default:
      return dashboardRoutes.visitor;
  }
}
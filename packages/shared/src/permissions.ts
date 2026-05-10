import { roles } from "./constants";

export type RoleName = (typeof roles)[number];

export const roleHierarchy: Record<RoleName, number> = {
  admin: 4,
  "security-personnel": 3,
  staff: 2,
  visitor: 1
};

export function canAccessRole(actorRole: RoleName, requiredRole: RoleName) {
  return roleHierarchy[actorRole] >= roleHierarchy[requiredRole];
}
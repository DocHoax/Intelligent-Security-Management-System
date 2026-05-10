import { roles } from "./constants.js";

export const roleHierarchy = {
  admin: 4,
  "security-personnel": 3,
  staff: 2,
  visitor: 1
};

export function canAccessRole(actorRole, requiredRole) {
  return roleHierarchy[actorRole] >= roleHierarchy[requiredRole];
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleHierarchy = void 0;
exports.canAccessRole = canAccessRole;
exports.roleHierarchy = {
    admin: 4,
    "security-personnel": 3,
    staff: 2,
    visitor: 1
};
function canAccessRole(actorRole, requiredRole) {
    return exports.roleHierarchy[actorRole] >= exports.roleHierarchy[requiredRole];
}

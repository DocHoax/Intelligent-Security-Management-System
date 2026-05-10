export function toRoleEnum(role: string) {
  return role.toUpperCase().replace(/-/g, "_");
}

export function toRoleSlug(role: string) {
  return role.toLowerCase().replace(/_/g, "-");
}
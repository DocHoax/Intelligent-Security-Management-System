export function normalizeIncidentStatus(status: string) {
  return status.toUpperCase().replace(/-/g, "_");
}
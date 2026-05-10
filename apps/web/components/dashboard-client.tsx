"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/lib/api";
import { getStoredAccessToken } from "@/lib/session";

type DashboardRole = "admin" | "security-personnel" | "staff" | "visitor";

type IncidentItem = {
  id: string;
  title: string;
  location: string;
  status: string;
  priority: string;
  createdAt?: string;
};

type DashboardPayload = {
  analytics: {
    incidentsByMonth: number[];
    incidentTypes: { label: string; value: number }[];
    responseTimes: number[];
    activeStaff: number;
    alertsHandled: number;
  };
  incidents: IncidentItem[];
  notifications: Array<{ id: string; title: string; message: string; read: boolean }>;
  visitors: Array<{ id: string; fullName: string; host: string; status: string; purpose: string }>;
  staff: Array<{ id: string; fullName: string; rank: string; shift: string; status: string }>;
};

const defaultPayload: DashboardPayload = {
  analytics: {
    incidentsByMonth: [],
    incidentTypes: [],
    responseTimes: [],
    activeStaff: 0,
    alertsHandled: 0
  },
  incidents: [],
  notifications: [],
  visitors: [],
  staff: []
};

export function DashboardClient({ role }: { role: DashboardRole }) {
  const [payload, setPayload] = useState<DashboardPayload>(defaultPayload);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const deferredSearch = useDeferredValue(search);
  const pageSize = 4;

  useEffect(() => {
    const token = getStoredAccessToken();

    if (!token) {
      setError("Sign in again to view your dashboard.");
      setLoading(false);
      return;
    }

    async function loadDashboard() {
      try {
        const [analyticsResponse, incidentsResponse, notificationsResponse, visitorsResponse, staffResponse] = await Promise.all([
          apiRequest<DashboardPayload["analytics"]>("/analytics/summary", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          apiRequest<{ id: string; title: string; location: string; status: string; priority: string; createdAt?: string }[]>("/incidents", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          apiRequest<DashboardPayload["notifications"]>("/notifications", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          apiRequest<DashboardPayload["visitors"]>("/visitors", {
            headers: { Authorization: `Bearer ${token}` }
          }),
          apiRequest<DashboardPayload["staff"]>("/staff", {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setPayload({
          analytics: analyticsResponse.data ?? defaultPayload.analytics,
          incidents: incidentsResponse.data ?? [],
          notifications: notificationsResponse.data ?? [],
          visitors: visitorsResponse.data ?? [],
          staff: staffResponse.data ?? []
        });
      } catch (requestError) {
        setError(requestError instanceof Error ? requestError.message : "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const filteredIncidents = useMemo(() => {
    const normalizedSearch = deferredSearch.trim().toLowerCase();

    return payload.incidents.filter((incident) => {
      const matchesSearch =
        !normalizedSearch ||
        [incident.title, incident.location, incident.status, incident.priority].join(" ").toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === "all" || incident.status.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [deferredSearch, payload.incidents, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredIncidents.length / pageSize));
  const visibleIncidents = filteredIncidents.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, statusFilter]);

  const summaryCards =
    role === "admin"
      ? [
          ["Total Users", "1,284"],
          ["Open Incidents", String(payload.incidents.filter((incident) => incident.status === "open").length)],
          ["Pending Reports", String(payload.notifications.filter((notification) => !notification.read).length)],
          ["Resolved Cases", String(payload.incidents.filter((incident) => incident.status === "resolved").length)]
        ]
      : role === "security-personnel"
        ? [
            ["Assigned Cases", String(payload.incidents.length)],
            ["Active Alerts", String(payload.notifications.filter((notification) => !notification.read).length)],
            ["Patrol Updates", String(payload.staff.length)],
            ["Chat Messages", "9"]
          ]
        : role === "staff"
          ? [
              ["Submitted Reports", String(payload.incidents.length)],
              ["Tracked Updates", String(payload.notifications.length)],
              ["Safety Alerts", String(payload.notifications.filter((notification) => !notification.read).length)],
              ["Announcements", "6"]
            ]
          : [
              ["Approved Visits", String(payload.visitors.filter((visitor) => visitor.status === "checked-in").length)],
              ["Pending Approval", String(payload.visitors.filter((visitor) => visitor.status === "pending").length)],
              ["Active Passes", String(payload.visitors.length)],
              ["Notifications", String(payload.notifications.length)]
            ];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--muted)] shadow-panel">
          Loading dashboard data...
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 text-sm text-[var(--muted)] shadow-panel">
          {error}
        </div>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map(([label, value]) => (
          <article key={label} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-panel backdrop-blur-xl">
            <p className="text-sm text-[var(--muted)]">{label}</p>
            <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-display text-2xl font-semibold">Operational Modules</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">Search and filter the incident queue with pagination.</p>
            </div>

            <div className="flex flex-wrap gap-3">
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search incidents"
                className="min-w-56 rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm outline-none"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 text-sm outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="in-review">In Review</option>
                <option value="assigned">Assigned</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-hidden rounded-[1.25rem] border border-[var(--border)]">
            <table className="min-w-full divide-y divide-[var(--border)] text-left text-sm">
              <thead className="bg-[rgba(148,163,184,0.08)] text-[var(--muted)]">
                <tr>
                  <th className="px-4 py-3 font-semibold">Incident</th>
                  <th className="px-4 py-3 font-semibold">Location</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {visibleIncidents.length > 0 ? (
                  visibleIncidents.map((incident) => (
                    <tr key={incident.id} className="bg-[var(--surface-strong)]">
                      <td className="px-4 py-3">
                        <p className="font-semibold">{incident.title}</p>
                        <p className="text-xs text-[var(--muted)]">{incident.id}</p>
                      </td>
                      <td className="px-4 py-3 text-[var(--muted)]">{incident.location}</td>
                      <td className="px-4 py-3 capitalize text-[var(--muted)]">{incident.status.replace(/-/g, " ")}</td>
                      <td className="px-4 py-3 capitalize text-[var(--muted)]">{incident.priority}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-[var(--muted)]">
                      No incidents match the current search and filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-[var(--muted)]">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold"
              >
                Next
              </button>
            </div>
          </div>
        </article>

        <aside className="space-y-6">
          <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
            <h2 className="font-display text-2xl font-semibold">Activity Log</h2>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              {payload.notifications.slice(0, 4).map((notification) => (
                <p key={notification.id}>• {notification.title}</p>
              ))}
            </div>
          </article>

          <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
            <h2 className="font-display text-2xl font-semibold">Analytics Snapshot</h2>
            <div className="mt-5 space-y-3">
              {payload.analytics.incidentTypes.slice(0, 3).map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-[rgba(148,163,184,0.16)]">
                    <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
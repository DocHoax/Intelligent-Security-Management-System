import { notFound } from "next/navigation";

const dashboards = {
  admin: {
    title: "Admin Dashboard",
    description: "Monitor users, incidents, visitors, alerts, and system configuration from one control room.",
    stats: [
      ["Total Users", "1,284"],
      ["Open Incidents", "37"],
      ["Pending Reports", "12"],
      ["Resolved Cases", "428"]
    ],
    modules: ["Manage Users", "Assign Security Personnel", "CCTV Feed Simulation", "System Settings"]
  },
  security: {
    title: "Security Personnel Dashboard",
    description: "Review assigned incidents, emergency alerts, patrol reports, and live activity logs.",
    stats: [
      ["Assigned Cases", "14"],
      ["Active Alerts", "3"],
      ["Patrol Updates", "21"],
      ["Chat Messages", "9"]
    ],
    modules: ["Update Incident Status", "Emergency Alert Queue", "Patrol Reporting", "Admin Chat"]
  },
  staff: {
    title: "Staff Dashboard",
    description: "Submit incidents, track report progress, and receive safety notices or announcements.",
    stats: [
      ["Submitted Reports", "8"],
      ["Tracked Updates", "11"],
      ["Safety Alerts", "4"],
      ["Announcements", "6"]
    ],
    modules: ["Report Incidents", "Track Progress", "Emergency Contacts", "Announcements"]
  },
  visitor: {
    title: "Visitor Dashboard",
    description: "Access your visit status, QR pass, host information, and check-in history.",
    stats: [
      ["Approved Visits", "3"],
      ["Pending Approval", "1"],
      ["Active Passes", "2"],
      ["Notifications", "5"]
    ],
    modules: ["QR Pass", "Host Approval", "Visit History", "Contact Security"]
  }
} as const;

export default function RoleDashboardPage({
  params
}: {
  params: { role: string };
}) {
  const role = params.role.toLowerCase() as keyof typeof dashboards;
  const dashboard = dashboards[role];

  if (!dashboard) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-4 py-6 text-[var(--page-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Dashboard</p>
              <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{dashboard.title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">{dashboard.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <button className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 font-semibold">Search</button>
              <button className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 font-semibold">Filter</button>
              <button className="rounded-full bg-[var(--accent)] px-4 py-2 font-semibold text-white">Export Report</button>
            </div>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {dashboard.stats.map(([label, value]) => (
            <article key={label} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-panel backdrop-blur-xl">
              <p className="text-sm text-[var(--muted)]">{label}</p>
              <p className="mt-3 font-display text-3xl font-semibold">{value}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold">Operational Modules</h2>
                <p className="mt-2 text-sm text-[var(--muted)]">Quick entry points into the core workflows for this role.</p>
              </div>
              <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">Live</span>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {dashboard.modules.map((module) => (
                <div key={module} className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4">
                  <p className="font-semibold">{module}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">Module placeholder for the implementation stage.</p>
                </div>
              ))}
            </div>
          </article>

          <aside className="space-y-6">
            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
              <h2 className="font-display text-2xl font-semibold">Activity Log</h2>
              <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <p>• Security alert acknowledged by Admin</p>
                <p>• Visitor QR pass generated successfully</p>
                <p>• Incident status updated to In Review</p>
                <p>• Patrol report submitted for Zone B</p>
              </div>
            </article>

            <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
              <h2 className="font-display text-2xl font-semibold">Analytics Snapshot</h2>
              <div className="mt-5 space-y-3">
                {[
                  ["Incident resolution", 86],
                  ["Patrol compliance", 72],
                  ["Emergency readiness", 94]
                ].map(([label, value]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between text-sm">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[rgba(148,163,184,0.16)]">
                      <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </aside>
        </section>
      </div>
    </main>
  );
}
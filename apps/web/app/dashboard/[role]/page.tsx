import { notFound } from "next/navigation";
import Link from "next/link";
import { DashboardClient } from "@/components/dashboard-client";

const dashboards = {
  admin: true,
  "security-personnel": true,
  staff: true,
  visitor: true
} as const;

export default function RoleDashboardPage({
  params
}: {
  params: { role: string };
}) {
  const role = params.role.toLowerCase() as keyof typeof dashboards;

  if (!dashboards[role]) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-4 py-6 text-[var(--page-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Dashboard</p>
              <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{role.replace(/-/g, " ")} Dashboard</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                Live operations view for incidents, alerts, visitor access, staff activity, and analytics.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <Link href="/profile" className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 font-semibold">
                Profile
              </Link>
              <button className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 font-semibold">Search</button>
              <button className="rounded-full border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-2 font-semibold">Filter</button>
              <button className="rounded-full bg-[var(--accent)] px-4 py-2 font-semibold text-white">Export Report</button>
            </div>
          </div>
        </header>
        <DashboardClient role={role} />
      </div>
    </main>
  );
}
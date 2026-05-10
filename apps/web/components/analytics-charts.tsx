"use client";

type AnalyticsData = {
  incidentsByMonth: number[];
  incidentTypes: { label: string; value: number }[];
  responseTimes: number[];
  activeStaff: number;
  alertsHandled: number;
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const palette = ["#0f766e", "#0891b2", "#2563eb", "#7c3aed", "#ea580c", "#be123c"];

export function AnalyticsCharts({ analytics }: { analytics: AnalyticsData }) {
  const maxIncidents = Math.max(...analytics.incidentsByMonth, 1);
  const maxResponse = Math.max(...analytics.responseTimes, 1);
  const totalTypes = Math.max(analytics.incidentTypes.reduce((sum, item) => sum + item.value, 0), 1);

  const pieStops = analytics.incidentTypes
    .map((item, index) => {
      const start = analytics.incidentTypes.slice(0, index).reduce((sum, current) => sum + current.value, 0);
      const startPercent = (start / totalTypes) * 100;
      const endPercent = ((start + item.value) / totalTypes) * 100;
      return `${palette[index % palette.length]} ${startPercent}% ${endPercent}%`;
    })
    .join(", ");

  const linePoints = analytics.responseTimes
    .map((value, index) => {
      const x = analytics.responseTimes.length === 1 ? 0 : (index / (analytics.responseTimes.length - 1)) * 100;
      const y = 100 - (value / maxResponse) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <section className="grid gap-4 xl:grid-cols-3">
      <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl xl:col-span-2">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold">Incident Trends</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">Monthly activity and response-time tracking.</p>
          </div>
          <div className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">Live analytics</div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <ChartPanel title="Incident Volume" subtitle="Monthly reports">
            <div className="flex h-64 items-end gap-2">
              {analytics.incidentsByMonth.map((value, index) => (
                <div key={`${monthLabels[index] ?? index}-${value}`} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                  <div className="text-[11px] font-semibold text-[var(--muted)]">{value}</div>
                  <div className="flex w-full items-end justify-center">
                    <div
                      className="w-full max-w-10 rounded-t-2xl bg-[var(--accent)]"
                      style={{ height: `${Math.max((value / maxIncidents) * 100, 6)}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-medium text-[var(--muted)]">{monthLabels[index] ?? index + 1}</div>
                </div>
              ))}
            </div>
          </ChartPanel>

          <ChartPanel title="Response Time" subtitle="Minutes per checkpoint">
            <svg viewBox="0 0 100 100" className="h-64 w-full overflow-visible rounded-[1.25rem] bg-[rgba(148,163,184,0.04)] p-3">
              <polyline
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={linePoints}
              />
              {analytics.responseTimes.map((value, index) => {
                const x = analytics.responseTimes.length === 1 ? 0 : (index / (analytics.responseTimes.length - 1)) * 100;
                const y = 100 - (value / maxResponse) * 100;
                return <circle key={`${index}-${value}`} cx={x} cy={y} r="1.8" fill="var(--accent)" />;
              })}
            </svg>
          </ChartPanel>
        </div>
      </article>

      <article className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
        <ChartPanel title="Incident Categories" subtitle="Distribution">
          <div className="mx-auto flex h-56 w-56 items-center justify-center rounded-full" style={{ background: `conic-gradient(${pieStops})` }}>
            <div className="flex h-32 w-32 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface-strong)] text-center">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[var(--muted)]">Total</p>
                <p className="font-display text-2xl font-semibold">{totalTypes}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {analytics.incidentTypes.map((item, index) => (
              <div key={item.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: palette[index % palette.length] }} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[var(--muted)]">{item.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-[rgba(148,163,184,0.16)]">
                  <div className="h-2 rounded-full bg-[var(--accent)]" style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartPanel>
      </article>
    </section>
  );
}

function ChartPanel({
  title,
  subtitle,
  children
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-4 shadow-sm">
      <div className="mb-4">
        <h4 className="font-semibold">{title}</h4>
        {subtitle ? <p className="text-sm text-[var(--muted)]">{subtitle}</p> : null}
      </div>
      {children}
    </div>
  );
}
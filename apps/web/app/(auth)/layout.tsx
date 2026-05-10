import Link from "next/link";

export default function AuthLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-4 py-6 text-[var(--page-text)] sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] shadow-soft backdrop-blur-xl lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="hidden flex-col justify-between border-r border-[var(--border)] p-8 lg:flex">
          <div>
            <p className="font-display text-2xl font-semibold">ISM System</p>
            <p className="mt-2 text-sm uppercase tracking-[0.3em] text-[var(--muted)]">Secure access portal</p>
          </div>

          <div className="space-y-4">
            <h1 className="font-display text-4xl font-semibold leading-tight">
              Secure entry for administrators, security personnel, staff, and visitors.
            </h1>
            <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
              The authentication flow supports role selection, email verification, OTP reset, and a controlled onboarding process for the security platform.
            </p>
          </div>

          <div className="space-y-3 text-sm text-[var(--muted)]">
            <p>• Password hashing and secure sessions</p>
            <p>• Role-based access control</p>
            <p>• Real-time alert-ready accounts</p>
          </div>
        </aside>

        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-xl">{children}</div>
        </section>
      </div>

      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between text-xs text-[var(--muted)]">
        <Link href="/">Back to homepage</Link>
        <span>Safety and Security Management System</span>
      </div>
    </main>
  );
}
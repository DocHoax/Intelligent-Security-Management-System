import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="animate-fadeUp">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Forgot Password</p>
      <h2 className="mt-3 font-display text-3xl font-semibold">Request a reset code</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        Submit your email address and we will simulate the OTP reset workflow used for secure account recovery.
      </p>

      <form className="mt-8 space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-panel">
        <Field label="Email" name="email" type="email" placeholder="name@example.com" />
        <button type="submit" className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95">
          Send OTP Link
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Use <Link href="/verify-otp" className="font-semibold text-[var(--accent)]">the verification page</Link> to complete the reset flow.
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder
}: {
  label: string;
  name: string;
  type?: string;
  placeholder: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--page-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
      />
    </label>
  );
}
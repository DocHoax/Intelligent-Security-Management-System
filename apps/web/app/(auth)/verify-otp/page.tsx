import Link from "next/link";

export default function VerifyOtpPage() {
  return (
    <div className="animate-fadeUp">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Email Verification / OTP Reset</p>
      <h2 className="mt-3 font-display text-3xl font-semibold">Confirm the code and finish account recovery</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        This screen supports both email verification and OTP reset in the same secure flow for the project prototype.
      </p>

      <form className="mt-8 space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-panel">
        <Field label="Email" name="email" type="email" placeholder="name@example.com" />
        <Field label="OTP Code" name="otp" placeholder="Enter the 6-digit code" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New Password" name="newPassword" type="password" placeholder="Create new password" />
          <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" />
        </div>
        <button type="submit" className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95">
          Verify and Reset
        </button>
      </form>

      <p className="mt-6 text-sm text-[var(--muted)]">
        Return to <Link href="/login" className="font-semibold text-[var(--accent)]">login</Link> after verification.
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
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>("Complete the OTP flow to finish recovery.");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiRequest<{ verified: boolean }>("/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email: String(formData.get("email") ?? ""),
          otp: String(formData.get("otp") ?? ""),
          newPassword: String(formData.get("newPassword") ?? ""),
          confirmPassword: String(formData.get("confirmPassword") ?? "")
        })
      });

      setMessage(response.message ?? "OTP verified successfully");
      router.push("/login");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fadeUp">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Email Verification / OTP Reset</p>
      <h2 className="mt-3 font-display text-3xl font-semibold">Confirm the code and finish account recovery</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        This screen supports both email verification and OTP reset in the same secure flow for the project prototype.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-panel">
        <Field label="Email" name="email" type="email" placeholder="name@example.com" />
        <Field label="OTP Code" name="otp" placeholder="Enter the 6-digit code" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="New Password" name="newPassword" type="password" placeholder="Create new password" />
          <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat password" />
        </div>
        <button type="submit" disabled={loading} className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? "Verifying..." : "Verify and Reset"}
        </button>
      </form>

      {message ? <p className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">{message}</p> : null}

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
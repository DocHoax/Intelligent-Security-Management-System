"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { getDashboardPath, persistAuthSession } from "@/lib/session";

const roles = ["Admin", "Security Personnel", "Staff", "Visitor / User"];

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phoneNumber: String(formData.get("phoneNumber") ?? ""),
      role: String(formData.get("role") ?? "visitor").toLowerCase().replace(/\s+/g, "-"),
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? "")
    };

    try {
      const response = await apiRequest<{
        accessToken: string;
        refreshToken: string;
        user: { role: string };
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (!response.data) {
        throw new Error("Registration response missing data");
      }

      persistAuthSession(response.data.accessToken, response.data.refreshToken);
      setMessage(response.message ?? "Registration successful");
      router.push(getDashboardPath(response.data.user.role));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fadeUp">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Register</p>
      <h2 className="mt-3 font-display text-3xl font-semibold">Create a secure account</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        Set up an account with role selection, email verification, and an OTP-ready password reset flow.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-panel">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" name="fullName" placeholder="Enter full name" />
          <Field label="Email" name="email" type="email" placeholder="name@example.com" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Phone Number" name="phoneNumber" placeholder="0801 234 5678" />
          <label className="block">
            <span className="mb-2 block text-sm font-semibold">Role</span>
            <select name="role" className="w-full rounded-2xl border border-[var(--border)] bg-[var(--page-bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]">
              {roles.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Password" name="password" type="password" placeholder="Create a strong password" />
          <Field label="Confirm Password" name="confirmPassword" type="password" placeholder="Repeat the password" />
        </div>

        <label className="flex items-start gap-2 text-sm text-[var(--muted)]">
          <input type="checkbox" name="terms" className="mt-1 h-4 w-4 rounded border-[var(--border)]" />
          I agree to the security platform terms and privacy policy.
        </label>

        <button type="submit" disabled={loading} className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      {message ? <p className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">{message}</p> : null}

      <p className="mt-6 text-sm text-[var(--muted)]">
        Already have an account? <Link href="/login" className="font-semibold text-[var(--accent)]">Login here</Link>
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
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { apiRequest } from "@/lib/api";
import { getDashboardPath, persistAuthSession } from "@/lib/session";

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      rememberMe: formData.get("rememberMe") === "on"
    };

    try {
      const response = await apiRequest<{
        accessToken: string;
        refreshToken: string;
        user: { role: string };
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload)
      });

      if (!response.data) {
        throw new Error("Login response missing data");
      }

      persistAuthSession(response.data.accessToken, response.data.refreshToken);
      setMessage(response.message ?? "Login successful");
      router.push(getDashboardPath(response.data.user.role));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="animate-fadeUp">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Login</p>
      <h2 className="mt-3 font-display text-3xl font-semibold">Welcome back</h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
        Sign in to access incident reporting, emergency alerts, staff coordination, and your role-specific dashboard.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-6 shadow-panel">
        <Field label="Email" name="email" type="email" placeholder="name@example.com" />
        <Field label="Password" name="password" type="password" placeholder="Enter your password" />

        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-[var(--muted)]">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="rememberMe" className="h-4 w-4 rounded border-[var(--border)]" />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-semibold text-[var(--accent)]">
            Forgot password?
          </Link>
        </div>

        <button type="submit" disabled={loading} className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70">
          {loading ? "Signing in..." : "Login to Dashboard"}
        </button>
      </form>

      {message ? <p className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--muted)]">{message}</p> : null}

      <p className="mt-6 text-sm text-[var(--muted)]">
        New here? <Link href="/register" className="font-semibold text-[var(--accent)]">Create an account</Link>
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
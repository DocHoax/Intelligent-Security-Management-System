"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

type ProfileData = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber?: string | null;
  role?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await apiRequest<ProfileData>("/auth/me");
        setProfile(response.data ?? null);
      } catch (error) {
        setMessage(error instanceof Error ? error.message : "Unable to load profile");
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await apiRequest<ProfileData>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify({
          fullName: String(formData.get("fullName") ?? ""),
          phoneNumber: String(formData.get("phoneNumber") ?? "")
        })
      });

      setProfile(response.data ?? profile);
      setMessage(response.message ?? "Profile updated");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Profile update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--page-bg)] px-4 py-6 text-[var(--page-text)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-soft backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">Profile Management</p>
          <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">Manage your security account</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
            Review your account details, update your profile, and keep your contact information current for alerts and workflow notifications.
          </p>
        </header>

        <section className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
          {loading ? (
            <p className="text-sm text-[var(--muted)]">Loading profile...</p>
          ) : profile ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" name="fullName" defaultValue={profile.fullName} />
                <Field label="Phone Number" name="phoneNumber" defaultValue={profile.phoneNumber ?? ""} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <ReadonlyField label="Email" value={profile.email} />
                <ReadonlyField label="Role" value={profile.role ?? "visitor"} />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save Profile"}
                </button>
                <Link href="/dashboard/admin" className="rounded-full border border-[var(--border)] px-6 py-3 text-sm font-semibold">
                  Back to dashboard
                </Link>
              </div>
            </form>
          ) : (
            <p className="text-sm text-[var(--muted)]">No profile data found.</p>
          )}

          {message ? <p className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm text-[var(--muted)]">{message}</p> : null}
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  defaultValue
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
      />
    </label>
  );
}

function ReadonlyField({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        value={value}
        readOnly
        className="w-full rounded-2xl border border-[var(--border)] bg-[rgba(148,163,184,0.08)] px-4 py-3 text-sm outline-none"
      />
    </label>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light";

type Feature = {
  title: string;
  description: string;
  icon: string;
};

type Stat = {
  label: string;
  value: number;
  suffix?: string;
};

const features: Feature[] = [
  {
    title: "Incident Reporting",
    description: "Capture theft, fire, medical, violence, and unauthorized access reports instantly.",
    icon: "shield"
  },
  {
    title: "Visitor Management",
    description: "Register guests, issue QR passes, track host approval, and log every visit.",
    icon: "users"
  },
  {
    title: "Emergency Alerts",
    description: "Broadcast panic alerts through the dashboard with simulated SMS and email workflows.",
    icon: "bell"
  },
  {
    title: "Security Monitoring",
    description: "Monitor assigned cases, patrol updates, and activity logs in one operational view.",
    icon: "radar"
  },
  {
    title: "Staff Management",
    description: "Manage officers, duty schedules, attendance, and performance records.",
    icon: "badge"
  },
  {
    title: "Surveillance Tracking",
    description: "Simulate CCTV feeds, motion detection alerts, and camera activity logs.",
    icon: "camera"
  },
  {
    title: "Analytics Dashboard",
    description: "Review trends, response time, incident categories, and security performance at a glance.",
    icon: "chart"
  },
  {
    title: "User Authentication",
    description: "Protect the platform with JWT authentication, role-based access, and secure sessions.",
    icon: "lock"
  }
];

const processSteps = [
  "Register or log in with a verified role.",
  "Report incidents or raise emergency alerts.",
  "Admins review, assign, and track responses.",
  "Notifications and logs update in real time."
];

const testimonials = [
  {
    name: "Amina Yusuf",
    role: "Admin Officer",
    quote:
      "The dashboard gives us a single source of truth for incidents, visitor access, and emergency activity."
  },
  {
    name: "Bola Adeyemi",
    role: "Security Supervisor",
    quote:
      "Assigned cases, patrol logs, and alerts are easy to track, so response coordination becomes faster."
  },
  {
    name: "Kemi Johnson",
    role: "Staff Member",
    quote:
      "Reporting concerns now feels simple and transparent, and I can follow the status without chasing updates."
  }
];

const stats: Stat[] = [
  { label: "Reports Logged", value: 2840, suffix: "+" },
  { label: "Resolved Incidents", value: 1270, suffix: "+" },
  { label: "Active Security Staff", value: 86, suffix: "" },
  { label: "Emergency Alerts Handled", value: 432, suffix: "+" }
];

const rolePills = ["Admin", "Security Personnel", "Staff", "Visitor / User"];

function Icon({ name }: { name: string }) {
  const shared = "h-5 w-5 shrink-0 stroke-current";

  switch (name) {
    case "shield":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={shared} strokeWidth="1.7">
          <path d="M12 3l7 3v5c0 4.6-3 8.7-7 10-4-1.3-7-5.4-7-10V6l7-3Z" />
          <path d="M9.5 12.1L11.2 13.8 14.8 10.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "users":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={shared} strokeWidth="1.7">
          <path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
          <path d="M17 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
          <path d="M3.8 19c.8-3 3-4.7 5.2-4.7s4.4 1.7 5.2 4.7" strokeLinecap="round" />
          <path d="M14.2 18.8c.3-1.8 1.5-3.2 3.3-4" strokeLinecap="round" />
        </svg>
      );
    case "bell":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={shared} strokeWidth="1.7">
          <path d="M15 17H9a3 3 0 0 1-3-3V10a6 6 0 0 1 12 0v4a3 3 0 0 1-3 3Z" />
          <path d="M10 17a2 2 0 0 0 4 0" strokeLinecap="round" />
        </svg>
      );
    case "radar":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={shared} strokeWidth="1.7">
          <circle cx="12" cy="12" r="8" />
          <path d="M12 12l5-5" strokeLinecap="round" />
          <path d="M12 4v3" strokeLinecap="round" />
          <path d="M4 12h3" strokeLinecap="round" />
        </svg>
      );
    case "badge":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={shared} strokeWidth="1.7">
          <path d="M12 2l2.8 2.8 3.9.6.6 3.9L22 12l-2.8 2.7-.6 3.9-3.9.6L12 22l-2.7-2.8-3.9-.6-.6-3.9L2 12l2.8-2.7.6-3.9 3.9-.6L12 2Z" />
          <path d="M9.5 15.2h5" strokeLinecap="round" />
          <path d="M10 9.8h.01M14 9.8h.01" strokeLinecap="round" />
        </svg>
      );
    case "camera":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={shared} strokeWidth="1.7">
          <path d="M4 8.5h4l1.5-2h5L16 8.5h4v9H4v-9Z" />
          <circle cx="12" cy="13" r="2.8" />
        </svg>
      );
    case "chart":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={shared} strokeWidth="1.7">
          <path d="M4 19h16" strokeLinecap="round" />
          <path d="M7 17v-5" strokeLinecap="round" />
          <path d="M12 17V7" strokeLinecap="round" />
          <path d="M17 17v-8" strokeLinecap="round" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={shared} strokeWidth="1.7">
          <path d="M7 11V8a5 5 0 0 1 10 0v3" strokeLinecap="round" />
          <path d="M6 11h12v8H6v-8Z" />
          <path d="M12 14v2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="max-w-2xl space-y-3">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">{eyebrow}</p>
      <h2 className="font-display text-3xl font-semibold text-[var(--page-text)] sm:text-4xl">{title}</h2>
      <p className="text-sm leading-7 text-[var(--muted)] sm:text-base">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [counts, setCounts] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("isms-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
    }

    const timer = window.setTimeout(() => setReady(true), 650);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("isms-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!ready) {
      return;
    }

    const targets = stats.map((stat) => stat.value);
    const duration = 1200;
    const start = window.performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);

      setCounts(
        targets.map((target) => {
          const value = Math.round(target * progress);
          return value;
        })
      );

      if (progress < 1) {
        frame = window.requestAnimationFrame(tick);
      }
    };

    frame = window.requestAnimationFrame(tick);

    return () => window.cancelAnimationFrame(frame);
  }, [ready]);

  const counters = useMemo(
    () => stats.map((stat, index) => ({ ...stat, count: counts[index] ?? 0 })),
    [counts]
  );

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setToast("Message captured. The security team will review the enquiry shortly.");
    window.setTimeout(() => setToast(null), 3500);
    event.currentTarget.reset();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--page-bg)] text-[var(--page-text)] transition-colors duration-300">
      {!ready ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--page-bg)]">
          <div className="flex flex-col items-center gap-4 rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] px-8 py-7 shadow-soft backdrop-blur-xl">
            <div className="h-11 w-11 animate-spin rounded-full border-2 border-[var(--border)] border-t-[var(--accent)]" />
            <p className="font-display text-lg font-semibold">Booting security console</p>
          </div>
        </div>
      ) : null}

      <div className="absolute left-0 top-0 -z-10 h-64 w-64 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <div className="absolute right-0 top-32 -z-10 h-80 w-80 rounded-full bg-[rgba(148,163,184,0.12)] blur-3xl" />

      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[color-mix(in_srgb,var(--page-bg)80%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="font-display text-lg font-semibold tracking-wide">ISM System</p>
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">Safety and Security Management</p>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex">
            <a href="#about">About</a>
            <a href="#features">Features</a>
            <a href="#workflow">How It Works</a>
            <a href="#contact">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
              className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-[var(--accent)]"
            >
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <Link
              href="/login"
              className="rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--page-text)]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white shadow-soft transition hover:opacity-95"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.25fr_0.95fr] lg:px-8 lg:py-20">
        <div className="space-y-8 animate-fadeUp">
          <div className="flex flex-wrap gap-2">
            {rolePills.map((pill) => (
              <span key={pill} className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--muted)] backdrop-blur">
                {pill}
              </span>
            ))}
          </div>

          <div className="space-y-5">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[var(--accent)]">Lagos State University of Science and Technology</p>
            <h1 className="font-display max-w-3xl text-4xl font-semibold leading-tight sm:text-5xl lg:text-6xl">
              Smart safety operations for campuses, estates, offices, and institutions.
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              A professional safety and security management platform that centralizes incident reporting, visitor control, emergency alerts, staff coordination, and surveillance tracking in one intelligent dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link href="/register" className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95">
              Get Started
            </Link>
            <Link href="#features" className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-sm font-semibold text-[var(--page-text)] shadow-sm transition hover:border-[var(--accent)]">
              Explore Features
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["Secure Authentication", "JWT, verification, and role-based access."],
              ["Real-time Alerts", "Instant response workflows for emergencies."],
              ["Operational Dashboard", "Clear visibility for admins and security teams."],
              ["Audit Trail", "Action logs for accountability and review."]
            ].map(([title, description]) => (
              <div key={title} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-panel backdrop-blur-xl">
                <p className="font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-float">
          <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-soft backdrop-blur-xl sm:p-6">
            <div className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface-strong)] p-5 shadow-panel">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">Live Overview</p>
                  <h2 className="mt-2 font-display text-2xl font-semibold">Security Command Snapshot</h2>
                </div>
                <span className="rounded-full border border-[var(--border)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">Online</span>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {counters.map((stat) => (
                  <div key={stat.label} className="rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                    <p className="text-sm text-[var(--muted)]">{stat.label}</p>
                    <p className="mt-3 font-display text-3xl font-semibold">
                      {stat.count.toLocaleString()}
                      {stat.suffix}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[1.25rem] border border-[var(--border)] bg-[var(--surface)] p-4">
                <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                  <span>Security Activity</span>
                  <span>Updated now</span>
                </div>
                <div className="mt-4 space-y-3">
                  {[
                    ["Incident review queue", 82],
                    ["Visitor check-ins", 67],
                    ["Emergency alert readiness", 91]
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
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <SectionTitle
          eyebrow="About"
          title="Designed to improve safety monitoring, emergency response, and incident documentation."
          description="The system replaces scattered manual processes with a digital command center that supports faster coordination, better accountability, and clearer decision-making for security teams and institutional administrators."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "Purpose",
              description:
                "Unify reporting, emergency handling, visitor access, staff management, and surveillance activities in one secure platform."
            },
            {
              title: "Importance",
              description:
                "Reduce response delays, improve visibility, and give every stakeholder a reliable way to communicate during safety events."
            },
            {
              title: "Problems Solved",
              description:
                "Eliminate paper logs, disconnected messaging, duplicated reports, and poor tracking of incidents and response actions."
            }
          ].map((card) => (
            <article key={card.title} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
              <h3 className="font-display text-xl font-semibold">{card.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <SectionTitle
          eyebrow="Features"
          title="Everything the platform needs to feel like a real-world security operations system."
          description="Each module is structured for scale, from incident reporting and visitor management to analytics, authentication, and surveillance simulation."
        />

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature) => (
            <article key={feature.title} className="group rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-panel backdrop-blur-xl transition hover:-translate-y-1">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] text-[var(--accent)]">
                <Icon name={feature.icon} />
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="workflow" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <SectionTitle
          eyebrow="How It Works"
          title="A simple flow that keeps security operations understandable and traceable."
          description="The workflow is intentionally direct so users can act quickly during routine operations and high-pressure emergency situations."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <article key={step} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-5 shadow-panel backdrop-blur-xl">
              <p className="font-display text-3xl font-semibold text-[var(--accent)]">0{index + 1}</p>
              <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <SectionTitle
          eyebrow="Statistics"
          title="Animated numbers that show the scale of the platform’s day-to-day operations."
          description="These sample metrics illustrate how the dashboard can visualize incident volume, response progress, staffing levels, and emergency handling."
        />

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {counters.map((stat) => (
            <article key={stat.label} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 text-center shadow-panel backdrop-blur-xl">
              <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">{stat.label}</p>
              <p className="mt-4 font-display text-4xl font-semibold text-[var(--page-text)]">
                {stat.count.toLocaleString()}
                {stat.suffix}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <SectionTitle
          eyebrow="Testimonials"
          title="Sample feedback from people who would rely on the platform."
          description="The interface is designed to support administrators, security personnel, staff, and visitors without unnecessary friction."
        />

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article key={testimonial.name} className="rounded-[1.5rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
              <p className="text-sm leading-7 text-[var(--muted)]">“{testimonial.quote}”</p>
              <div className="mt-6">
                <p className="font-display text-lg font-semibold">{testimonial.name}</p>
                <p className="text-sm text-[var(--muted)]">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="contact" className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <SectionTitle
          eyebrow="Contact"
          title="Reach the security team or use the form to send a message."
          description="The contact block includes a simple form, direct contact details, and a location map placeholder for the project submission."
        />

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.8fr]">
          <form onSubmit={handleContactSubmit} className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full Name" name="name" placeholder="Enter your full name" />
              <Field label="Email" name="email" type="email" placeholder="name@example.com" />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Phone Number" name="phone" placeholder="0801 234 5678" />
              <Field label="Subject" name="subject" placeholder="Security enquiry" />
            </div>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-semibold">Message</label>
              <textarea
                name="message"
                rows={5}
                placeholder="Describe the issue or request."
                className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </div>
            <button type="submit" className="mt-5 rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:opacity-95">
              Send Message
            </button>
          </form>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] p-6 shadow-panel backdrop-blur-xl">
              <h3 className="font-display text-xl font-semibold">Contact Details</h3>
              <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
                <p>Email: security@lasustech.edu.ng</p>
                <p>Phone: +234 801 234 5678</p>
                <p>Location: Lagos State University of Science and Technology, Ikorodu, Lagos</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-[var(--surface)] shadow-panel backdrop-blur-xl">
              <iframe
                title="Location map"
                src="https://www.google.com/maps?q=Lagos%20State%20University%20of%20Science%20and%20Technology&output=embed"
                className="h-72 w-full border-0"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
          <div>
            <p className="font-display text-2xl font-semibold">ISM System</p>
            <p className="mt-3 max-w-md text-sm leading-7 text-[var(--muted)]">
              A professional safety and security management platform built for modern institutions and final-year software engineering presentation.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">Quick Links</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <a href="#about" className="block">About</a>
              <a href="#features" className="block">Features</a>
              <a href="#workflow" className="block">How It Works</a>
              <a href="#contact" className="block">Contact</a>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--muted)]">Legal</p>
            <div className="mt-4 space-y-3 text-sm text-[var(--muted)]">
              <a href="/login" className="block">Login</a>
              <a href="/register" className="block">Register</a>
              <a href="#" className="block">Privacy Policy</a>
              <a href="#" className="block">Terms and Conditions</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--border)] px-4 py-4 text-center text-sm text-[var(--muted)]">
          © 2026 Safety and Security Management System. All rights reserved.
        </div>
      </footer>

      {toast ? (
        <div className="fixed bottom-5 right-5 z-40 rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm shadow-soft">
          {toast}
        </div>
      ) : null}
    </main>
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
        className="w-full rounded-2xl border border-[var(--border)] bg-[var(--surface-strong)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
      />
    </label>
  );
}
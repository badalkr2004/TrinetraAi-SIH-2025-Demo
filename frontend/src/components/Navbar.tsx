// src/components/Navbar.tsx
import React, { useEffect, useRef, useState } from "react";

type NavLink = {
  label: string;
  href: string;
  badge?: string;
};

type NavbarProps = {
  alertsCount?: number;
  links?: NavLink[];
  onSearch?: (q: string) => void;
};

const defaultLinks: NavLink[] = [
  { label: "Dashboard", href: "#" },
  { label: "Insights", href: "#" },
  { label: "Alerts", href: "#" },
  { label: "Reports", href: "#" },
  { label: "Pricing", href: "#" },
];

const Navbar: React.FC<NavbarProps> = ({
  alertsCount = 0,
  links = defaultLinks,
  onSearch,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    const initial =
      saved === "light" || saved === "dark"
        ? saved
        : window.matchMedia &&
          window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    setTheme(initial);
    root.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName.toLowerCase() !== "input"
      ) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
  };

  const submitSearch = () => {
    if (onSearch) onSearch(query.trim());
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur">
      <div className="border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-black ">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="group inline-flex items-center gap-2 rounded-xl"
              aria-label="Trinetra Ai Home"
            >
              <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/20 to-cyan-500/20 ring-1 ring-white/15 transition group-hover:scale-105">
                <EyeLogo className="h-6 w-6 text-yellow-600" />
                <span className="absolute inset-0 -z-10 rounded-xl bg-indigo-500/0 blur-xl transition group-hover:bg-indigo-500/10" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-base font-semibold text-white">
                  Trinetra Ai
                </span>
                <span className="text-[11px] uppercase tracking-wide text-slate-400">
                  Intelligence Suite
                </span>
              </div>
            </a>
          </div>

          {/* Center: Links (Desktop) */}
          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="group inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative hidden items-center md:flex">
              <SearchIcon className="pointer-events-none absolute left-3 h-4 w-4 text-slate-500" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder="Search…  ( / )"
                className="w-56 rounded-xl border border-white/10 bg-black/30 px-8 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            >
              {theme === "dark" ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>

            {/* Notifications */}
            <button
              aria-label="Notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
            >
              <BellIcon className="h-5 w-5" />
              {alertsCount > 0 && (
                <span className="absolute right-1 top-1 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-medium text-white">
                  {alertsCount > 99 ? "99+" : alertsCount}
                </span>
              )}
            </button>

            {/* CTA */}
            <a
              href="#"
              className="hidden rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-indigo-500 hover:to-fuchsia-500 md:inline-flex"
            >
              Upgrade
            </a>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-2 py-1.5 text-slate-200 transition hover:bg-white/10"
              >
                <img
                  src="https://api.dicebear.com/8.x/avataaars/svg?seed=trinetra"
                  alt="User avatar"
                  className="h-7 w-7 rounded-lg"
                />
                <ChevronDownIcon className="h-4 w-4 text-slate-400" />
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-slate-900/95 p-1 text-sm text-slate-200 shadow-xl backdrop-blur"
                >
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5"
                  >
                    <UserIcon className="h-4 w-4 text-slate-400" />
                    Profile
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-white/5"
                  >
                    <SettingsIcon className="h-4 w-4 text-slate-400" />
                    Settings
                  </a>
                  <div className="my-1 h-px bg-white/10" />
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-rose-300 hover:bg-rose-500/10"
                  >
                    <LogoutIcon className="h-4 w-4" />
                    Sign out
                  </a>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 md:hidden"
            >
              {mobileOpen ? (
                <CloseIcon className="h-5 w-5" />
              ) : (
                <MenuIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mx-auto block max-w-7xl gap-4 px-4 pb-4 md:hidden">
            <div className="mb-3">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                  placeholder="Search…"
                  className="w-full rounded-xl border border-white/10 bg-black/30 px-9 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>
            </div>

            <div className="grid gap-1">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-3 py-2 text-slate-200 transition hover:bg-white/10"
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-slate-300">
                      {link.badge}
                    </span>
                  )}
                </a>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 px-4 py-2 text-sm font-medium text-white shadow-md transition hover:from-indigo-500 hover:to-fuchsia-500"
              >
                Upgrade
              </a>
              <button
                onClick={toggleTheme}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-slate-300 transition hover:bg-white/10"
              >
                {theme === "dark" ? (
                  <>
                    <SunIcon className="h-4 w-4" />
                    Light
                  </>
                ) : (
                  <>
                    <MoonIcon className="h-4 w-4" />
                    Dark
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

/* ================= Icons (inline, no deps) ================= */

function EyeLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M24 10C14 10 6.6 18 4 24c2.6 6 10 14 20 14s17.4-8 20-14c-2.6-6-10-14-20-14z"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.6"
      />
      <circle
        cx="24"
        cy="24"
        r="6"
        stroke="currentColor"
        strokeWidth="2"
        fill="currentColor"
        opacity="0.9"
      />
      <circle cx="24" cy="24" r="2" fill="white" />
    </svg>
  );
}

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <circle cx="11" cy="11" r="7" strokeWidth="1.8" />
      <path d="m21 21-4.3-4.3" strokeWidth="1.8" />
    </svg>
  );
}

function BellIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <path
        d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9"
        strokeWidth="1.8"
      />
      <path d="M10 21a2 2 0 0 0 4 0" strokeWidth="1.8" />
    </svg>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <path d="M12 2v2M12 20v2M4 12H2M22 12h-2" strokeWidth="1.8" />
      <path d="m4.9 4.9 1.4 1.4M17.7 17.7l1.4 1.4" strokeWidth="1.8" />
      <path d="m19.1 4.9-1.4 1.4M6.3 17.7 4.9 19.1" strokeWidth="1.8" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <path
        d="M21 12.8A8.5 8.5 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <path d="m6 9 6 6 6-6" strokeWidth="1.8" />
    </svg>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <path d="M3 6h18M3 12h18M3 18h18" strokeWidth="1.8" />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <path d="M6 6l12 12M18 6L6 18" strokeWidth="1.8" />
    </svg>
  );
}

function UserIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <circle cx="12" cy="8" r="4" strokeWidth="1.8" />
      <path d="M4 20a8 8 0 0 1 16 0" strokeWidth="1.8" />
    </svg>
  );
}

function SettingsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <path
        d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"
        strokeWidth="1.8"
      />
      <path
        d="M19.4 15a1.9 1.9 0 0 0 .38 2.1l.07.06a2.3 2.3 0 0 1-3.25 3.25l-.06-.07a1.9 1.9 0 0 0-2.1-.38 1.9 1.9 0 0 0-1.1 1.73V22a2.3 2.3 0 0 1-4.6 0v-.11a1.9 1.9 0 0 0-1.1-1.73 1.9 1.9 0 0 0-2.1.38l-.06.07A2.3 2.3 0 0 1 4.15 17l.07-.06a1.9 1.9 0 0 0 .38-2.1 1.9 1.9 0 0 0-1.73-1.1H2.76a2.3 2.3 0 0 1 0-4.6h.11a1.9 1.9 0 0 0 1.73-1.1 1.9 1.9 0 0 0-.38-2.1l-.07-.06A2.3 2.3 0 0 1 7.5 4.15l.06.07a1.9 1.9 0 0 0 2.1.38h.01A1.9 1.9 0 0 0 10.77 2.9V2.8a2.3 2.3 0 0 1 4.6 0v.11a1.9 1.9 0 0 0 1.1 1.73h.01a1.9 1.9 0 0 0 2.1-.38l.06-.07A2.3 2.3 0 0 1 21.85 7.5l-.07.06a1.9 1.9 0 0 0-.38 2.1v.01a1.9 1.9 0 0 0 1.73 1.1h.11a2.3 2.3 0 0 1 0 4.6h-.11a1.9 1.9 0 0 0-1.73 1.1z"
        strokeWidth="1.2"
        opacity="0.6"
      />
    </svg>
  );
}

function LogoutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props} stroke="currentColor">
      <path d="M10 17l5-5-5-5" strokeWidth="1.8" />
      <path d="M15 12H3" strokeWidth="1.8" />
      <path d="M21 21V3" strokeWidth="1.8" opacity="0.5" />
    </svg>
  );
}

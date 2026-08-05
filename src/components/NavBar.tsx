"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const links = [
  { href: "/", label: "Dashboard" },
  { href: "/basdai", label: "BASDAI" },
  { href: "/basfi", label: "BASFI" },
  { href: "/history", label: "History" },
];

export function NavBar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-700 dark:bg-slate-900/80">
      <nav className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold text-slate-900 dark:text-white">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-sm text-white">AS</span>
          <span className="hidden sm:inline">Ankylosing Spondylitis</span>
        </Link>

        {user ? (
          <div className="flex items-center gap-1">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200"
                      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => logout()}
              className="ml-2 rounded-md px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
            >
              Sign out
            </button>
          </div>
        ) : null}
      </nav>
    </header>
  );
}

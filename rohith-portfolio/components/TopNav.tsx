"use client";

import ThemeToggle from "@/components/ThemeToggle";
import { navItems } from "@/lib/portfolio-data";

export default function TopNav() {
  return (
    <header className="site-header fixed inset-x-0 top-4 z-40">
      <div className="mx-auto w-[min(1220px,calc(100%-1.25rem))]">
        <div className="glass-panel rounded-[1.75rem] px-4 py-3 md:px-6">
          <div className="flex items-center justify-between gap-4">
            <nav className="flex min-w-0 flex-1 items-center justify-start gap-2 overflow-x-auto pb-1 md:justify-center">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="nav-link shrink-0"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <div className="shrink-0">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/clients", label: "Clients" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/billing", label: "Billing" },
];

export function DashboardHeader() {
  const pathname = usePathname();

  return (
    <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light px-8 pt-7 pb-0 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <Link href="/dashboard" className="flex items-center gap-2 no-underline text-white">
            <span className="text-2xl">&#x1F43E;</span>
            <h1 className="text-[22px] font-serif font-bold tracking-tight">
              VetExport Pro
            </h1>
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-sm text-white/70 hover:text-white bg-transparent border-none cursor-pointer"
          >
            Sign out
          </button>
        </div>
        <nav className="flex gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2.5 text-sm font-medium no-underline rounded-t-lg transition-colors ${
                  isActive
                    ? "bg-[#f4f7f5] text-primary"
                    : "text-white/80 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

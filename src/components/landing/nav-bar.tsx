"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function NavBar() {
  const { data: session } = useSession();

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-border-light">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 no-underline">
          <span className="text-2xl">&#x1F43E;</span>
          <span className="text-lg font-serif font-bold text-text tracking-tight">
            VetExport Pro
          </span>
        </Link>
        <div className="flex items-center gap-3">
          {session?.user ? (
            <>
              {(session.user as Record<string, unknown>).role === "admin" && (
                <Link
                  href="/admin"
                  className="text-sm text-text-muted hover:text-text no-underline"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/certificate"
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors no-underline"
              >
                Certificates
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-sm text-text-muted hover:text-text bg-transparent border-none cursor-pointer"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-text-muted hover:text-text no-underline"
              >
                Log in
              </Link>
              <a
                href="#signup"
                className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-dark transition-colors no-underline"
              >
                Join Waitlist
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

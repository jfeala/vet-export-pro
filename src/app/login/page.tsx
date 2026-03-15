"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const searchParams = useSearchParams();
  const [csrfToken, setCsrfToken] = useState("");

  const callbackError = searchParams.get("error");

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((res) => res.json())
      .then((data) => setCsrfToken(data.csrfToken));
  }, []);

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 no-underline">
            <span className="text-3xl">&#x1F43E;</span>
            <span className="text-2xl font-serif font-bold text-text tracking-tight">
              VetExport Pro
            </span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-light">
          <h1 className="text-xl font-serif font-bold text-text mb-6">Log in</h1>

          {callbackError && (
            <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3 mb-4 border border-red-200">
              Invalid email or password
            </div>
          )}

          <form
            method="POST"
            action="/api/auth/callback/credentials"
            className="space-y-4"
          >
            <input type="hidden" name="csrfToken" value={csrfToken} />
            <input type="hidden" name="callbackUrl" value="/certificate" />
            <div>
              <label className="block text-sm font-medium text-text mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={!csrfToken}
              className="w-full py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors"
            >
              Log in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center">
          <p className="text-text-muted">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

"use client";

import { Suspense, useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center">
          <p className="text-text-muted">Loading...</p>
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [inviteEmail, setInviteEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (!token) {
      setInvalid(true);
      setValidating(false);
      return;
    }
    fetch(`/api/auth/register?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((data) => {
        setInviteEmail(data.email);
        setValidating(false);
      })
      .catch(() => {
        setInvalid(true);
        setValidating(false);
      });
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, name, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    // Auto sign in
    const signInRes = await signIn("credentials", {
      email: inviteEmail,
      password,
      redirect: false,
    });

    setLoading(false);

    if (signInRes?.error) {
      router.push("/login");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  if (validating) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center">
        <p className="text-text-muted">Validating invite...</p>
      </div>
    );
  }

  if (invalid) {
    return (
      <div className="min-h-screen bg-[#f4f7f5] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-border-light max-w-md w-full text-center">
          <p className="text-lg font-semibold text-text mb-2">Invalid Invite</p>
          <p className="text-sm text-text-muted mb-4">
            This invite link is invalid or has already been used.
          </p>
          <Link href="/" className="text-primary text-sm font-medium hover:underline">
            Go to homepage
          </Link>
        </div>
      </div>
    );
  }

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
          <h1 className="text-xl font-serif font-bold text-text mb-2">Create your account</h1>
          <p className="text-sm text-text-muted mb-6">
            Setting up account for <strong>{inviteEmail}</strong>
          </p>

          {error && (
            <div className="bg-red-50 text-danger text-sm rounded-lg px-4 py-3 mb-4 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">Your name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">Confirm password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

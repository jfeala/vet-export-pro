"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Lead {
  id: string;
  name: string;
  email: string;
  destination: string | null;
  createdAt: string;
  invited: boolean;
}

interface InviteRow {
  id: string;
  email: string;
  invitedAt: string;
  accepted: boolean;
}

interface UserRow {
  id: string;
  email: string;
  name: string | null;
  onboarded: boolean;
  createdAt: string;
}

interface Props {
  leads: Lead[];
  invites: InviteRow[];
  users: UserRow[];
}

type Tab = "waitlist" | "invites" | "users";

export function AdminDashboard({ leads, invites, users }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("waitlist");
  const [inviting, setInviting] = useState<string | null>(null);
  const [resetting, setResetting] = useState<string | null>(null);

  async function handleReset(inviteId: string) {
    if (!confirm("Reset this invite? This will delete the invite and any associated user account.")) return;
    setResetting(inviteId);
    try {
      const res = await fetch("/api/admin/invite/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to reset");
      }
      router.refresh();
    } finally {
      setResetting(null);
    }
  }

  async function handleInvite(email: string, name: string) {
    setInviting(email);
    try {
      const res = await fetch("/api/admin/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to invite");
      }
      router.refresh();
    } finally {
      setInviting(null);
    }
  }

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "waitlist", label: "Waitlist", count: leads.length },
    { id: "invites", label: "Invites", count: invites.length },
    { id: "users", label: "Users", count: users.length },
  ];

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light px-8 pt-7 pb-5 text-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 no-underline text-white">
              <span className="text-2xl">&#x1F43E;</span>
              <h1 className="text-[22px] font-serif font-bold tracking-tight">Admin</h1>
            </Link>
          </div>
          <Link
            href="/certificate"
            className="text-sm text-white/80 hover:text-white no-underline"
          >
            Certificates
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 pt-6 pb-16">
        {/* Tabs */}
        <div className="flex gap-1 mb-6">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border-none cursor-pointer transition-colors ${
                tab === t.id
                  ? "bg-primary text-white"
                  : "bg-white text-text-muted hover:bg-gray-50"
              }`}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
          {tab === "waitlist" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-text-muted">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Destination</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr key={lead.id} className="border-t border-border-light">
                    <td className="px-4 py-3 text-text">{lead.name}</td>
                    <td className="px-4 py-3 text-text">{lead.email}</td>
                    <td className="px-4 py-3 text-text-muted">{lead.destination || "—"}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(lead.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {lead.invited ? (
                        <span className="text-xs text-primary font-medium bg-primary-bg px-2 py-1 rounded">
                          Invited
                        </span>
                      ) : (
                        <button
                          onClick={() => handleInvite(lead.email, lead.name)}
                          disabled={inviting === lead.email}
                          className="text-xs font-medium px-3 py-1.5 rounded-lg border-none bg-primary text-white cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors"
                        >
                          {inviting === lead.email ? "Sending..." : "Invite"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-text-muted">
                      No leads yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {tab === "invites" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-text-muted">
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Invited</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {invites.map((inv) => (
                  <tr key={inv.id} className="border-t border-border-light">
                    <td className="px-4 py-3 text-text">{inv.email}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(inv.invitedAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {inv.accepted ? (
                        <span className="text-xs text-green-700 font-medium bg-success-bg px-2 py-1 rounded">
                          Accepted
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-700 font-medium bg-warning-bg px-2 py-1 rounded">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleReset(inv.id)}
                        disabled={resetting === inv.id}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg border border-danger/30 bg-white text-danger cursor-pointer disabled:opacity-50 hover:enabled:bg-red-50 transition-colors"
                      >
                        {resetting === inv.id ? "Resetting..." : "Reset"}
                      </button>
                    </td>
                  </tr>
                ))}
                {invites.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                      No invites sent yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          {tab === "users" && (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-text-muted">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-t border-border-light">
                    <td className="px-4 py-3 text-text">{user.name || "—"}</td>
                    <td className="px-4 py-3 text-text">{user.email}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {user.onboarded ? (
                        <span className="text-xs text-green-700 font-medium bg-success-bg px-2 py-1 rounded">
                          Onboarded
                        </span>
                      ) : (
                        <span className="text-xs text-yellow-700 font-medium bg-warning-bg px-2 py-1 rounded">
                          Pending setup
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-text-muted">
                      No users yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

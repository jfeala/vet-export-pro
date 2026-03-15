"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { CertificateTable } from "@/components/dashboard/certificate-table";

export default function DashboardPage() {
  const router = useRouter();
  const [creating, setCreating] = useState(false);

  async function handleNewCertificate() {
    setCreating(true);
    try {
      const res = await fetch("/api/certificates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      if (res.ok) {
        const cert = await res.json();
        router.push(`/certificate/${cert.id}`);
      }
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <DashboardHeader />

      <div className="max-w-5xl mx-auto px-8 pt-8 pb-16">
        {/* New Certificate CTA */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-serif font-semibold text-text mb-1">
              Dashboard
            </h2>
            <p className="text-sm text-text-muted">
              Manage your certificates, clients, and practice.
            </p>
          </div>
          <button
            onClick={handleNewCertificate}
            disabled={creating}
            className="px-6 py-3 rounded-xl border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors shadow-sm"
          >
            {creating ? "Creating..." : "+ New Certificate"}
          </button>
        </div>

        <StatsCards />

        <div className="mb-4">
          <h3 className="text-sm font-semibold text-text mb-3">Recent Certificates</h3>
          <CertificateTable />
        </div>
      </div>
    </div>
  );
}

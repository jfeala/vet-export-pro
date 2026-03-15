"use client";

import { useEffect, useState } from "react";
import { COUNTRIES_EU } from "@/lib/certificates/en-es-2019-1293/constants";

interface Stats {
  totalCerts: number;
  certsThisMonth: number;
  topDestination: string | null;
  clientCount: number;
}

export function StatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-border-light animate-pulse h-20" />
        ))}
      </div>
    );
  }

  const topCountryName = stats.topDestination
    ? COUNTRIES_EU.find((c) => c.code === stats.topDestination)?.name || stats.topDestination
    : "—";

  const cards = [
    { label: "This Month", value: stats.certsThisMonth, icon: "&#x1F4C4;" },
    { label: "Total Certificates", value: stats.totalCerts, icon: "&#x1F4CB;" },
    { label: "Clients", value: stats.clientCount, icon: "&#x1F465;" },
    { label: "Top Destination", value: topCountryName, icon: "&#x2708;" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-white rounded-xl p-5 border border-border-light shadow-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-base"
              dangerouslySetInnerHTML={{ __html: card.icon }}
            />
            <span className="text-xs text-text-muted font-medium">{card.label}</span>
          </div>
          <div className="text-xl font-bold text-text">{card.value}</div>
        </div>
      ))}
    </div>
  );
}

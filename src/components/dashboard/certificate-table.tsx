"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CertificateStatusBadge } from "./certificate-status-badge";
import { COUNTRIES_EU } from "@/lib/certificates/en-es-2019-1293/constants";

interface Certificate {
  id: string;
  status: string;
  destinationCountry: string | null;
  departureDate: string | null;
  createdAt: string;
  updatedAt: string;
  client: { name: string } | null;
  patients: { patient: { name: string | null; species: string } }[];
}

export function CertificateTable() {
  const router = useRouter();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certificates")
      .then((r) => r.json())
      .then((data) => {
        setCertificates(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function getCountryName(code: string | null) {
    if (!code) return "—";
    return COUNTRIES_EU.find((c) => c.code === code)?.name || code;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-border-light shadow-sm p-8 text-center text-text-muted text-sm">
        Loading certificates...
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border-light shadow-sm p-8 text-center">
        <p className="text-text-muted text-sm mb-1">No certificates yet</p>
        <p className="text-xs text-text-muted">
          Click &ldquo;New Certificate&rdquo; above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-border-light shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 text-left text-text-muted">
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Destination</th>
            <th className="px-4 py-3 font-medium">Departure</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Updated</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {certificates.map((cert) => (
            <tr key={cert.id} className="border-t border-border-light">
              <td className="px-4 py-3 text-text">
                {cert.client?.name || "—"}
              </td>
              <td className="px-4 py-3 text-text">
                {getCountryName(cert.destinationCountry)}
              </td>
              <td className="px-4 py-3 text-text-muted">
                {cert.departureDate || "—"}
              </td>
              <td className="px-4 py-3">
                <CertificateStatusBadge status={cert.status} />
              </td>
              <td className="px-4 py-3 text-text-muted">
                {new Date(cert.updatedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => router.push(`/certificate/${cert.id}`)}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg border border-border bg-white text-primary cursor-pointer hover:bg-primary-bg transition-colors"
                >
                  {cert.status === "draft" ? "Continue" : "View"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

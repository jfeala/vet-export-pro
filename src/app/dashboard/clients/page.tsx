"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

interface Patient {
  id: string;
  name: string | null;
  species: string;
  breed: string | null;
}

interface Client {
  id: string;
  name: string;
  phone: string | null;
  addressUS: string | null;
  patients: Patient[];
  updatedAt: string;
}

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, phone: newPhone }),
    });
    if (res.ok) {
      const client = await res.json();
      setClients([{ ...client, patients: [] }, ...clients]);
      setNewName("");
      setNewPhone("");
      setShowForm(false);
    }
    setCreating(false);
  }

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <DashboardHeader />

      <div className="max-w-5xl mx-auto px-8 pt-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-serif font-semibold text-text">
            Clients &amp; Patients
          </h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer hover:bg-primary-dark transition-colors"
          >
            + Add Client
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleCreate}
            className="bg-white rounded-2xl p-5 shadow-sm border border-border-light mb-6 flex gap-3 items-end"
          >
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-1">Owner Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                placeholder="Jane Smith"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-text mb-1">Phone</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="(555) 123-4567"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors whitespace-nowrap"
            >
              {creating ? "Saving..." : "Save"}
            </button>
          </form>
        )}

        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-border-light animate-pulse h-40" />
        ) : clients.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border-light shadow-sm p-8 text-center">
            <p className="text-text-muted text-sm">No clients yet. Add your first client above.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-2xl border border-border-light shadow-sm p-5 cursor-pointer hover:border-primary/30 transition-colors"
                onClick={() => router.push(`/dashboard/clients/${client.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text">{client.name}</h3>
                    {client.phone && (
                      <p className="text-xs text-text-muted mt-0.5">{client.phone}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {client.patients.length > 0 && (
                      <span className="text-xs text-text-muted">
                        {client.patients.length} pet{client.patients.length !== 1 ? "s" : ""}
                      </span>
                    )}
                    <span className="text-text-muted">&rarr;</span>
                  </div>
                </div>
                {client.patients.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {client.patients.map((p) => (
                      <span
                        key={p.id}
                        className="text-xs bg-primary-bg text-primary px-2 py-1 rounded font-medium"
                      >
                        {p.name || p.species} {p.breed ? `(${p.breed})` : ""}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

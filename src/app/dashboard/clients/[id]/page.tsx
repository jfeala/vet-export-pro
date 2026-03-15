"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

interface Patient {
  id: string;
  name: string | null;
  species: string;
  breed: string | null;
  sex: string | null;
  color: string | null;
  identificationNumber: string | null;
}

interface ClientDetail {
  id: string;
  name: string;
  phone: string | null;
  addressUS: string | null;
  addressEU: string | null;
  patients: Patient[];
}

const SPECIES_OPTIONS = [
  { value: "Canis familiaris", label: "Dog" },
  { value: "Felis catus", label: "Cat" },
  { value: "Mustela putorius furo", label: "Ferret" },
];

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientSpecies, setPatientSpecies] = useState("Canis familiaris");
  const [patientBreed, setPatientBreed] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch(`/api/clients/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setClient(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  async function handleAddPatient(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    const res = await fetch(`/api/clients/${id}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: patientName,
        species: patientSpecies,
        breed: patientBreed,
      }),
    });
    if (res.ok) {
      const patient = await res.json();
      setClient((prev) =>
        prev ? { ...prev, patients: [...prev.patients, patient] } : prev
      );
      setPatientName("");
      setPatientBreed("");
      setShowPatientForm(false);
    }
    setCreating(false);
  }

  async function handleDeleteClient() {
    if (!confirm("Delete this client and all their patients?")) return;
    setDeleting(true);
    const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/dashboard/clients");
    }
    setDeleting(false);
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <DashboardHeader />

      <div className="max-w-[600px] mx-auto px-8 pt-8 pb-16">
        {loading ? (
          <div className="bg-white rounded-2xl p-8 border border-border-light animate-pulse h-40" />
        ) : !client ? (
          <p className="text-sm text-text-muted">Client not found.</p>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div>
                <button
                  onClick={() => router.push("/dashboard/clients")}
                  className="text-xs text-text-muted hover:text-primary bg-transparent border-none cursor-pointer mb-2"
                >
                  &larr; All Clients
                </button>
                <h2 className="text-xl font-serif font-semibold text-text">
                  {client.name}
                </h2>
                {client.phone && (
                  <p className="text-sm text-text-muted">{client.phone}</p>
                )}
              </div>
              <button
                onClick={handleDeleteClient}
                disabled={deleting}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border border-danger/30 bg-white text-danger cursor-pointer disabled:opacity-50 hover:enabled:bg-red-50 transition-colors"
              >
                Delete Client
              </button>
            </div>

            {/* Patients */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-text">Patients</h3>
              <button
                onClick={() => setShowPatientForm(!showPatientForm)}
                className="text-xs font-medium px-3 py-1.5 rounded-lg border-none bg-primary text-white cursor-pointer hover:bg-primary-dark transition-colors"
              >
                + Add Pet
              </button>
            </div>

            {showPatientForm && (
              <form
                onSubmit={handleAddPatient}
                className="bg-white rounded-2xl p-5 shadow-sm border border-border-light mb-4 space-y-3"
              >
                <div>
                  <label className="block text-sm font-medium text-text mb-1">Pet Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Max"
                    className={inputClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Species</label>
                    <select
                      value={patientSpecies}
                      onChange={(e) => setPatientSpecies(e.target.value)}
                      className={inputClass}
                    >
                      {SPECIES_OPTIONS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text mb-1">Breed</label>
                    <input
                      type="text"
                      value={patientBreed}
                      onChange={(e) => setPatientBreed(e.target.value)}
                      placeholder="Golden Retriever"
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-5 py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors"
                >
                  {creating ? "Adding..." : "Add Pet"}
                </button>
              </form>
            )}

            {client.patients.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border-light shadow-sm p-6 text-center">
                <p className="text-sm text-text-muted">No patients yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {client.patients.map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-xl border border-border-light shadow-sm p-4 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-sm font-medium text-text">
                        {p.name || "Unnamed"}
                      </span>
                      <span className="text-xs text-text-muted ml-2">
                        {SPECIES_OPTIONS.find((s) => s.value === p.species)?.label || p.species}
                        {p.breed ? ` - ${p.breed}` : ""}
                      </span>
                    </div>
                    {p.identificationNumber && (
                      <span className="text-xs text-text-muted font-mono">
                        {p.identificationNumber}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

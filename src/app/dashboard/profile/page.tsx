"use client";

import { useEffect, useState } from "react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

interface VetProfile {
  hospitalName: string;
  hospitalAddress: string;
  accreditedVetName: string;
  nationalAccreditationNumber: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<VetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);
    setSuccess(false);

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });

    if (res.ok) {
      const updated = await res.json();
      setProfile(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
    setSaving(false);
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary";

  return (
    <div className="min-h-screen bg-[#f4f7f5]">
      <DashboardHeader />

      <div className="max-w-[600px] mx-auto px-8 pt-8 pb-16">
        <h2 className="text-xl font-serif font-semibold text-text mb-6">
          Practice Profile
        </h2>

        {loading ? (
          <div className="bg-white rounded-2xl p-7 border border-border-light animate-pulse h-64" />
        ) : profile ? (
          <form onSubmit={handleSave} className="bg-white rounded-2xl p-7 shadow-sm border border-border-light space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Hospital / Clinic Name
              </label>
              <input
                type="text"
                value={profile.hospitalName}
                onChange={(e) => setProfile({ ...profile, hospitalName: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Hospital Address
              </label>
              <input
                type="text"
                value={profile.hospitalAddress}
                onChange={(e) => setProfile({ ...profile, hospitalAddress: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                Accredited Veterinarian Name
              </label>
              <input
                type="text"
                value={profile.accreditedVetName}
                onChange={(e) => setProfile({ ...profile, accreditedVetName: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                National Accreditation Number
              </label>
              <input
                type="text"
                value={profile.nationalAccreditationNumber}
                onChange={(e) =>
                  setProfile({ ...profile, nationalAccreditationNumber: e.target.value })
                }
                required
                className={inputClass}
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-lg border-none bg-primary text-white text-sm font-semibold cursor-pointer disabled:bg-gray-400 hover:enabled:bg-primary-dark transition-colors"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              {success && (
                <span className="text-sm text-green-700 font-medium">Saved!</span>
              )}
            </div>
          </form>
        ) : (
          <p className="text-sm text-text-muted">Could not load profile.</p>
        )}
      </div>
    </div>
  );
}

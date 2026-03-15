const STATUS_STYLES: Record<string, string> = {
  draft: "text-yellow-700 bg-warning-bg",
  submitted: "text-blue-700 bg-blue-50",
  charged: "text-green-700 bg-success-bg",
  failed: "text-red-700 bg-red-50",
};

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  charged: "Paid",
  failed: "Payment Failed",
};

export function CertificateStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`text-xs font-medium px-2 py-1 rounded ${STATUS_STYLES[status] || "text-gray-700 bg-gray-100"}`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}

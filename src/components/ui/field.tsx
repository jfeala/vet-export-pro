interface FieldProps {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function Field({ label, required, hint, error, children }: FieldProps) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-semibold text-text mb-1 tracking-wide">
        {label} {required && <span className="text-danger">*</span>}
      </label>
      {hint && (
        <div className="text-xs text-text-muted mb-1.5 leading-snug italic">
          {hint}
        </div>
      )}
      {children}
      {error && <div className="text-xs text-danger mt-1">{error}</div>}
    </div>
  );
}

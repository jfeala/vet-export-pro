interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: readonly (string | SelectOption)[];
  placeholder?: string;
}

export function Select({ value, onChange, options, placeholder }: SelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 border-[1.5px] border-border rounded-lg text-sm bg-white text-text outline-none appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20width=%2712%27%20height=%2712%27%20viewBox=%270%200%2012%2012%27%3E%3Cpath%20d=%27M6%208L1%203h10z%27%20fill=%27%236b7c93%27/%3E%3C/svg%3E')] bg-no-repeat bg-[right_12px_center] transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map((o) => {
        if (typeof o === "string") {
          return (
            <option key={o} value={o}>
              {o}
            </option>
          );
        }
        return (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        );
      })}
    </select>
  );
}

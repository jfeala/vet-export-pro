interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
}

export function Input({ value, onChange, ...rest }: InputProps) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 border-[1.5px] border-border rounded-lg text-sm bg-white text-text outline-none transition-all focus:border-primary focus:ring-3 focus:ring-primary/10"
      {...rest}
    />
  );
}

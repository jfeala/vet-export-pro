interface RowProps {
  children: React.ReactNode;
  cols?: 2 | 3;
}

export function Row({ children, cols = 2 }: RowProps) {
  const gridClass =
    cols === 3
      ? "grid grid-cols-1 md:grid-cols-3 gap-4"
      : "grid grid-cols-1 md:grid-cols-2 gap-4";
  return <div className={gridClass}>{children}</div>;
}

interface InfoBannerProps {
  type?: "info" | "warning" | "success";
  children: React.ReactNode;
}

const styles = {
  info: "bg-primary-bg border-l-primary",
  warning: "bg-warning-bg border-l-warning-border",
  success: "bg-success-bg border-l-success-border",
} as const;

export function InfoBanner({ type = "info", children }: InfoBannerProps) {
  const icons = { info: "\u2139\uFE0F", warning: "\u26A0\uFE0F", success: "\u2713" };
  return (
    <div
      className={`px-4 py-3 rounded-lg border-l-3 mb-5 text-sm leading-relaxed text-text ${styles[type]}`}
    >
      <span className="mr-2">{icons[type]}</span>
      {children}
    </div>
  );
}

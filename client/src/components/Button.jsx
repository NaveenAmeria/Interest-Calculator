export default function Button({ children, variant="primary", style, ...props }) {
  const base = {
    borderRadius: 12,
    padding: "10px 14px",
    fontWeight: 800,
    cursor: "pointer"
  };
  const variants = {
    primary: { background: "var(--brand)", color: "white", border: "none" },
    ghost: { background: "white", color: "var(--brand)", border: "1px solid var(--border)" },
    danger: { background: "#dc2626", color: "white", border: "none" }
  };
  return (
    <button {...props} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

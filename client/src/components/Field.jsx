export default function Field({ label, children }) {
  return (
    <div>
      <div style={{ color: "var(--muted)", fontWeight: 800, marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

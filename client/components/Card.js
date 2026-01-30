export default function Card({ children, style }) {
  return (
    <div style={{
      background: "var(--card)",
      borderRadius: "var(--radius)",
      boxShadow: "var(--shadow)",
      border: "1px solid var(--border)",
      padding: 16,
      ...style
    }}>
      {children}
    </div>
  );
}
